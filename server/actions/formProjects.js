import Promise from 'bluebird'
import logger from 'src/server/util/logger'
import {toArray, mapById, sum} from 'src/server/util'
import {flatten} from 'src/common/util'
import {getTeamFormationPlan, NoValidPlanFoundError} from 'src/server/services/projectFormationService'
import {r, Cycle, Phase, Player, Pool, Project, Vote} from 'src/server/services/dataService'
import getLatestFeedback from 'src/server/actions/getLatestFeedback'
import generateProjectName from 'src/server/actions/generateProjectName'
import {LGBadRequestError} from 'src/server/util/error'

export async function formProjectsIfNoneExist(cycleId, handleNonFatalError) {
  const votingPhases = await Phase.filter({hasVoting: true}).pluck('id')
  const votingPhaseIds = r.expr(votingPhases.map(p => p.id))

  const numProjectsInCycleAndVotingPhases = await Project.filter({cycleId}).filter(project => (
    votingPhaseIds.contains(project('phaseId'))
  ))
  .count()
  .execute()

  if (numProjectsInCycleAndVotingPhases > 0) {
    return
  }

  return formProjects(cycleId, handleNonFatalError)
}

export async function formProjects(cycleId, handleNonFatalError) {
  const projects = await buildProjects(cycleId, handleNonFatalError)
  return Project.save(projects)
}

export async function buildProjects(cycleId, handleNonFatalError) {
  const cycle = await Cycle.get(cycleId)

  // pools => [{goals, votes, cycleId}, ...]
  const pools = await _buildVotingPools(cycleId)
  const goals = flatten(pools.map(_ => _.goals))
  const plans = await _getPlansAndHandleErrors(pools, handleNonFatalError)

  // teamFormationPlan => [
  //   {seatCount, teams: [{playerIds, goalDescriptor, teamSize}]},
  //   {seatCount, teams: [{playerIds, goalDescriptor, teamSize}]},
  // ]
  const teamFormationPlan = _mergePlans(plans)
  return _teamFormationPlanToProjects(cycle, goals, teamFormationPlan)
}

async function _getPlansAndHandleErrors(pools, handleNonFatalError) {
  const results = pools.map(_getPlanOrNonFatalError)
  const plans = results.filter(_ => !_.error)

  if (handleNonFatalError) {
    const errors = results.filter(_ => _.error).map(({error, pool}) => {
      error.message = `Unable to form teams for pool ${pool.name}: ${error.message}`
      return error
    })
    await Promise.all(errors.map(handleNonFatalError))
  }

  return plans
}

function _getPlanOrNonFatalError(pool) {
  try {
    return getTeamFormationPlan(pool)
  } catch (err) {
    if (err instanceof NoValidPlanFoundError) {
      return {pool, error: err}
    }
    throw err
  }
}

function _mergePlans(plans) {
  const result = {
    seatCount: sum(plans.map(_ => _.seatCount)),
    teams: flatten(plans.map(_ => _.teams)),
    score: plans.map(_ => _.score),
  }

  return result
}

function _teamFormationPlanToProjects(cycle, goals, teamFormationPlan) {
  const goalsByDescriptor = goals.reduce((result, goal) => {
    result.set(goal.goalDescriptor, goal)
    return result
  }, new Map())

  return Promise.mapSeries(teamFormationPlan.teams, async team => {
    const goal = goalsByDescriptor.get(team.goalDescriptor)
    const [name, phase] = await Promise.all([
      await generateProjectName(),
      isFinite(goal.phase) ? (await Phase.filter({number: goal.phase}))[0] : null,
    ])
    return {
      name,
      goal,
      phaseId: phase ? phase.id : null,
      chapterId: cycle.chapterId,
      cycleId: cycle.id,
      playerIds: team.playerIds,
    }
  })
}

async function _buildVotingPools(cycleId) {
  const poolRows = await Pool.filter({cycleId}).orderBy('createdAt')
  if (poolRows.length === 0) {
    throw new LGBadRequestError('No pools found with this cycleId!', cycleId)
  }
  return Promise.map(poolRows, _buildVotingPool)
    .then(_ignorePoolsWithoutVotes)
}

function _ignorePoolsWithoutVotes(pools) {
  return pools.filter(pool => pool.votes.length > 0)
}

async function _buildVotingPool(pool) {
  const poolVotes = await _findVotesForPool(pool.id)
  if (poolVotes.length === 0) {
    logger.log(`No votes submitted for pool ${pool.name} (${pool.id})`)
  }

  const players = await _getPlayersWhoVoted(poolVotes)

  const votes = poolVotes.map(({goals, playerId}) => ({playerId, votes: goals.map(({url}) => url)}))
  const goalsByUrl = _extractGoalsFromVotes(poolVotes)
  const goals = toArray(goalsByUrl).map(goal => ({goalDescriptor: goal.url, ...goal}))
  const userFeedback = await _getUserFeedback([...players.keys()])

  return {
    poolId: pool.id,
    name: pool.name,
    cycleId: pool.cycleId,
    goals,
    votes,
    userFeedback,
  }
}

async function _getUserFeedback(playerIds) {
  const pairings = flatten(playerIds.map(respondentId => {
    const teammates = playerIds.filter(id => id !== respondentId)
    return teammates.map(subjectId => ({respondentId, subjectId}))
  }))

  const feedbackTuples = await Promise.map(
    pairings,
    pair => getLatestFeedback(pair).then(feedback => ({...pair, feedback})),
    {concurrency: 20}
  )

  const userFeedback = feedbackTuples.reduce((result, {respondentId, subjectId, feedback}) => {
    result.respondentIds[respondentId] = result.respondentIds[respondentId] || {subjectIds: {}}
    result.respondentIds[respondentId].subjectIds[subjectId] = feedback
    return result
  }, {respondentIds: {}})

  return userFeedback
}

function _findVotesForPool(poolId) {
  const voteIsValid = vote => vote.hasFields('goals').and(vote('goals').count().gt(0))
  return Vote
    .filter({poolId})
    .filter(voteIsValid)
}

async function _getPlayersWhoVoted(cycleVotes) {
  const playerVotes = _mapVotesByPlayerId(cycleVotes)
  const votingPlayerIds = Array.from(playerVotes.keys())
  const votingPlayers = await Player.getAll(...votingPlayerIds)
  return mapById(votingPlayers)
}

function _extractGoalsFromVotes(votes) {
  votes = toArray(votes)
  return votes.reduce((result, vote) => {
    if (Array.isArray(vote.goals)) {
      vote.goals.forEach(goal => {
        if (goal.url && !result.has(goal.url)) {
          result.set(goal.url, goal)
        }
      })
    }
    return result
  }, new Map())
}

function _mapVotesByPlayerId(votes) {
  votes = toArray(votes)
  return votes.reduce((result, vote) => {
    result.set(vote.playerId, {
      goals: Array.isArray(vote.goals) ? vote.goals.slice(0) : []
    })
    return result
  }, new Map())
}
