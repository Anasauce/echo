import {getMemberIds} from './pool'
import {enumeratePartitionings} from './partitioning'

export default function * enumerateMemberAssignmentChoices(pool, teamFormationPlan, shouldPrune) {
  const memberIdsToAssign = getMemberIds(pool)
  yield * enumerateMemberAssignmentChoicesFromList({
    pool,
    teamFormationPlan,
    memberIdsToAssign,
    shouldPrune,
    getCountToAssign: team => team.teamSize,
  })
}

function * enumerateMemberAssignmentChoicesFromList({teamFormationPlan, memberIdsToAssign, shouldPrune, getCountToAssign}) {
  const totalSeatsByGoal = new Map()
  teamFormationPlan.teams.forEach(team => {
    const countedSeatsForGoal = totalSeatsByGoal.get(team.goalDescriptor) || 0
    totalSeatsByGoal.set(team.goalDescriptor, countedSeatsForGoal + getCountToAssign(team))
  })

  const goalDescriptors = Array.from(totalSeatsByGoal.keys())
  const goalPartitionSizes = Array.from(totalSeatsByGoal.values())
  const goalPartitionings = enumeratePartitionings(
    memberIdsToAssign,
    goalPartitionSizes,
    genShouldPrunePartitioningByGoal(shouldPrune, teamFormationPlan, goalDescriptors, getCountToAssign),
  )

  for (const goalPartitioning of goalPartitionings) {
    const teamPartitioning = goalPartitioningToTeamPartitioning(goalPartitioning, teamFormationPlan, goalDescriptors, getCountToAssign)

    const teams = teamFormationPlan.teams.map((team, i) => {
      const currentMemberIds = team.memberIds || []
      const memberIds = currentMemberIds.concat(teamPartitioning[i])
      return {...team, memberIds}
    })

    yield {...teamFormationPlan, teams}
  }
}

function genShouldPrunePartitioningByGoal(shouldPrunePlan, teamFormationPlan, goalDescriptors, getCountToAssign) {
  return partitioning => {
    if (!shouldPrunePlan) {
      return false
    }
    const partitioningByTeam = goalPartitioningToTeamPartitioning(partitioning, teamFormationPlan, goalDescriptors, getCountToAssign)
    const teams = teamFormationPlan.teams.map((team, i) => ({
      ...team,
      memberIds: (team.memberIds || []).concat(partitioningByTeam[i]),
    }))

    return shouldPrunePlan({...teamFormationPlan, teams})
  }
}

function goalPartitioningToTeamPartitioning(memberPartitioningByGoal, teamFormationPlan, goalDescriptors, getCountToAssign) {
  const teams = teamFormationPlan.teams
  const memberIdsByGoal = getMemberIdsByGoal(memberPartitioningByGoal, goalDescriptors)
  return teams.map(team => {
    const unusedIds = memberIdsByGoal[team.goalDescriptor] || []
    const memberIds = unusedIds.splice(0, getCountToAssign(team))

    return memberIds
  })
}

function getMemberIdsByGoal(memberPartitioning, goalDescriptors) {
  const memberIdsForGoal = {}
  memberPartitioning.forEach((memberIds, i) => {
    const goal = goalDescriptors[i]
    memberIdsForGoal[goal] = memberIdsForGoal[goal] || []
    memberIdsForGoal[goal].push(...memberIds)
  })
  return memberIdsForGoal
}
