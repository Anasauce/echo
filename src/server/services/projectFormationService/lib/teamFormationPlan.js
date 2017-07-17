import {
  flatten,
  unique,
} from './util'

export function teamFormationPlanToString(plan) {
  return plan.teams.map(({goalDescriptor, teamSize, memberIds}) => {
    const memberIdPrefixes = memberIds.map(id => id.slice(0, 7))
    const goalDescriptorSuffix = goalDescriptor.split('/').pop()

    return `(${goalDescriptorSuffix}:${teamSize})[${memberIdPrefixes.sort() || ''}]`
  }).join(', ')
}

export function getAssignedMemberIds(teamFormationPlan) {
  return unique(flatten(
    teamFormationPlan.teams.map(({memberIds}) => memberIds)
  ))
}
