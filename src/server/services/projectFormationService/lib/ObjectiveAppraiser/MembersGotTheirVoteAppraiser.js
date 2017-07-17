import {
  getMemberIds,
  getVotesByMemberId,
  getMemberIdsByVote,
} from '../pool'
import {getAssignedMemberIds} from '../teamFormationPlan'

export default class MembersGotTheirVoteAppraiser {
  constructor(pool) {
    this.pool = pool
    this.votesByMemberId = getVotesByMemberId(pool)
    this.memberIdsByVote = getMemberIdsByVote(pool)
    this.memberIds = new Set(getMemberIds(pool))
    this.memberIdsToConsider = this.memberIds
    this.secondChoiceValue = MembersGotTheirVoteAppraiser.SECOND_CHOICE_VALUE
  }

  score(teamFormationPlan) {
    const {memberIdsToConsider} = this
    if (memberIdsToConsider.size === 0) {
      return 1
    }

    const rawScoreForAssignedMembers = this.bestPossibleRawScoreForAssignedMembers(
      teamFormationPlan,
      memberIdsToConsider
    )
    const givenUnassignedMemberIds = this.getUnassignedMemberIds(memberIdsToConsider, teamFormationPlan)
    const rawScoreForUnassignedMembers = this.bestPossibleRawScoreForUnassignedMembers(
      teamFormationPlan,
      givenUnassignedMemberIds
    )

    const score = (rawScoreForAssignedMembers + rawScoreForUnassignedMembers) / memberIdsToConsider.size

    // Make sure floating piont math never gives us more than 1.0
    return Math.min(1, score)
  }

  bestPossibleRawScoreForAssignedMembers(teamFormationPlan, givenMemberIds) {
    const membersConsidered = new Set()
    const memberIdFilter = memberId => givenMemberIds.has(memberId) && !membersConsidered.has(memberId)
    const rawScoreForAssignedMembers = teamFormationPlan.teams.reduce((sum, team) => {
      const matchingMemberIds = team.memberIds.filter(memberIdFilter)
      matchingMemberIds.forEach(id => {
        membersConsidered.add(id)
      })
      const [firstChoice, secondChoice] = this.countMembersWhoGotTheirVote(matchingMemberIds, team.goalDescriptor)
      return sum +
      firstChoice +
      (secondChoice * this.secondChoiceValue)
    }, 0)
    return rawScoreForAssignedMembers
  }

  bestPossibleRawScoreForUnassignedMembers(teamFormationPlan, givenMemberIds) {
    const totalUnassignedMemberCount = this.getUnassignedMemberIds(this.memberIds, teamFormationPlan).size
    const voteCounts = this.voteCountsByGoal(givenMemberIds)

    let sum = 0
    let totalEmptySeats = 0
    for (const [goalDescriptor, emptySeats] of this.emptySeatsByGoal(teamFormationPlan)) {
      totalEmptySeats += emptySeats
      const [firstVotesForGoal, secondVotesForGoal] = voteCounts.get(goalDescriptor)
      const potentialFirstChoiceAssignments = Math.min(emptySeats, firstVotesForGoal)
      const potentialSecondChoiceAssignments = Math.min(emptySeats - potentialFirstChoiceAssignments, secondVotesForGoal)
      sum += potentialFirstChoiceAssignments + (potentialSecondChoiceAssignments * this.secondChoiceValue)
    }
    const membersWhoCouldGetTheirVoteOnUnformedTeams = Math.max(0, totalUnassignedMemberCount - totalEmptySeats)
    sum += membersWhoCouldGetTheirVoteOnUnformedTeams
    return Math.min(sum, givenMemberIds.size)
  }

  getUnassignedMemberIds(memberIds, teamFormationPlan) {
    const assignedMemberIds = new Set(getAssignedMemberIds(teamFormationPlan))
    return new Set(
      Array.from(memberIds).filter(id => !assignedMemberIds.has(id))
    )
  }

  countMembersWhoGotTheirVote(memberIds, goalDescriptor) {
    const result = [0, 0]
    memberIds.forEach(memberId => {
      const votes = this.votesByMemberId[memberId] || []
      result[0] += Number(votes[0] === goalDescriptor)
      result[1] += Number(votes[1] === goalDescriptor)
    })
    return result
  }

  emptySeatsByGoal(teamFormationPlan) {
    const result = new Map()
    teamFormationPlan.teams.forEach(team => {
      const emptySeats = team.teamSize - team.memberIds.length
      const currentCount = result.get(team.goalDescriptor) || 0
      result.set(team.goalDescriptor, currentCount + emptySeats)
    })
    return result
  }

  voteCountsByGoal(memberIds) {
    const result = new Map(this.pool.goals.map(({goalDescriptor}) => [goalDescriptor, [0, 0]]))
    for (const {memberId, votes} of this.pool.votes) {
      if (memberIds.has(memberId)) {
        votes.forEach((goalDescriptor, i) => {
          result.get(goalDescriptor)[i]++
        })
      }
    }
    return result
  }
}

MembersGotTheirVoteAppraiser.SECOND_CHOICE_VALUE = 0.7
