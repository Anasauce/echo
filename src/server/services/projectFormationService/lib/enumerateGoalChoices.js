import ObjectiveAppraiser from './ObjectiveAppraiser'
import UnpopularGoalsNotConsideredAppraiser from './ObjectiveAppraiser/UnpopularGoalsNotConsideredAppraiser'

import {
  getGoalsWithVotes,
  getTeamSizesByGoal,
  getPoolSize,
  getMaxTeamSize,
  getMinTeamSize,
} from './pool'

export default function enumerateGoalChoices(pool, teamFormationPlan = {}, shouldPrune, appraiser = new ObjectiveAppraiser(pool)) {
  const teamSizesByGoal = getTeamSizesByGoal(pool)
  const goals = getGoalsWithVotes(pool)

  const x = new UnpopularGoalsNotConsideredAppraiser(pool)
  const popularGoalDescriptors = x.popularGoals()

  const goalAndSizeOptions = goals.reduce((result, goalDescriptor) => {
    if (!popularGoalDescriptors.has(goalDescriptor)) {
      return result
    }

    const recommendedTeamSize = teamSizesByGoal[goalDescriptor]
    const maxTeamSize = getMaxTeamSize(recommendedTeamSize)
    const minTeamSize = getMinTeamSize(recommendedTeamSize)
    const options = []
    for (let teamSize = minTeamSize; teamSize <= maxTeamSize; teamSize++) {
      const matchesTeamSizeRecommendation = teamSize === recommendedTeamSize
      options.push({goalDescriptor, teamSize, matchesTeamSizeRecommendation})
    }

    return result.concat(options)
  }, [])

  return goalChoiceGenerator(teamFormationPlan, {
    goalAndSizeOptions,
    pool,
    shouldPrune,
    appraiser,
  })
}

function * goalChoiceGenerator(teamFormationPlan, {goalAndSizeOptions, pool, shouldPrune, appraiser}) {
  const poolSize = getPoolSize(pool)
  const teamOptions = goalAndSizeOptions.map(option => ({memberIds: [], ...option}))
  const nodeStack = teamOptions.map(option => ({
    ...teamFormationPlan,
    seatCount: poolSize,
    teams: [option]
  }))
  .map(teamFormationPlan => ({
    ...teamFormationPlan,
    _score: appraiser.score({...teamFormationPlan})
  }))

  /* eslint-disable no-labels */
  for (;;) {
    nodeStack.sort(({_score: a}, {_score: b}) => a - b)
    const currentNode = nodeStack.pop()

    if (!currentNode) {
      return
    }

    if (shouldPrune && shouldPrune(currentNode)) {
      continue
    }
    delete currentNode._score

    const currentTeams = currentNode.teams
    const currentSeatCount = currentTeams.reduce((sum, team) => sum + team.teamSize, 0)
    if (currentSeatCount === poolSize) {
      yield {...currentNode, seatCount: currentSeatCount}
      continue
    }

    const newNodes = teamOptions
      .filter(option => {
        const newTeamCapacity = currentSeatCount + option.teamSize
        return poolSize >= newTeamCapacity
      })
      // Skipping all nodes that are not sorted to ensure that we won't
      // add children that will be duplicates of nodes further left in the tree
      .filter(option => compareGoals(option, currentTeams[currentTeams.length - 1]) >= 0)
      .map(option => ({
        ...currentNode,
        teams: currentTeams.concat(option)
      }))
      .map(teamFormationPlan => ({
        ...teamFormationPlan,
        _score: appraiser.score(teamFormationPlan)
      }))

    nodeStack.push(...newNodes)
  }
}

function compareGoals(a, b) {
  if (a && !b) {
    return 1
  }
  if (b && !a) {
    return -1
  }
  if (a.goalDescriptor > b.goalDescriptor) {
    return 1
  }
  if (a.goalDescriptor < b.goalDescriptor) {
    return -1
  }
  return a.teamSize - b.teamSize
}
