import {buildPool, getTeamSizeForGoal} from '../lib/pool'
import {range, flatten, repeat} from '../lib/util'

export function buildTestTeamFormationPlan(teams, pool) {
  const teamFormationPlan = {
    seatCount: 0,
    teams: [],
  }
  teams.forEach(teamInfo => {
    const {
      goal = pool.goals[0].goalDescriptor,
      members = [],
      teamSize = members.length || pool.goals[0].teamSize,
    } = teamInfo

    const matchesTeamSizeRecommendation = getTeamSizeForGoal(pool, goal) === teamSize
    teamFormationPlan.teams.push({
      goalDescriptor: goal,
      memberIds: members,
      teamSize,
      matchesTeamSizeRecommendation,
    })
    teamFormationPlan.seatCount += teamSize
  })

  return teamFormationPlan
}

export function buildTestPool(opts) {
  const {
    memberCount,
    goalCount,
    teamSize = 4,
    teamSizes = [],
    voteDistributionPercentages = [0.2, 0.2, 0.1],
  } = opts

  const goals = range(0, goalCount).map(i => ({
    goalDescriptor: `g${i}`,
    teamSize: teamSizes[i] || teamSize,
  }))
  const voteDistribution = buildVoteDistribution(memberCount, goals, voteDistributionPercentages)
  const members = range(0, memberCount).map(i => ({id: `p${i}`}))

  const votes = members.map((memberInfo, i) => ({
    memberId: memberInfo.id,
    votes: voteDistribution[i],
  }))

  return buildPool({votes, goals})
}

function buildVoteDistribution(voteCount, goals, percentages) {
  const distinctGoalCount = goals.length
  const goalDescriptors = goals.map(_ => _.goalDescriptor)
  const voteDistribution = goalDescriptors.reduce((result, goalDescriptor, i) => {
    const percentOfVotes = percentages[i] || 0
    const goalProbability = Math.floor(voteCount * percentOfVotes)

    return result.concat(
      repeat(
        Math.max(1, goalProbability),
        [goalDescriptor, goalDescriptors[(i + 1) % distinctGoalCount]]
      )
    )
  }, [])

  const votesLeft = voteCount - voteDistribution.length
  const fillerVotes = flatten(repeat(Math.ceil(votesLeft / distinctGoalCount), goalDescriptors))
    .map((goalDescriptor, i) => [goalDescriptor, goalDescriptors[(i + 1) % distinctGoalCount]])

  return voteDistribution.concat(fillerVotes.reverse().slice(0, votesLeft))
}
