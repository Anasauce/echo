import {
  voteCountsByGoal,
  getTeamSizesByGoal,
  getMinTeamSize,
} from '../pool'

import MembersGotTheirVoteAppraiser from './MembersGotTheirVoteAppraiser'

export default class UnpopularGoalsNotConsideredAppraiser {
  constructor(pool, maxPopularGoals = 10) {
    this.pool = pool
    this.maxPopularGoals = maxPopularGoals
  }

  score(teamFormationPlan /* , {teamsAreIncomplete} = {} */) {
    const popularGoals = this.popularGoals()
    const teamsWithoutPopularGoals = teamFormationPlan.teams.filter(team => !popularGoals.has(team.goalDescriptor)).length
    return 1 - (teamsWithoutPopularGoals / this.maxPotentialTeamCount(teamFormationPlan))
  }

  popularGoals() {
    if (!this._popularGoals) {
      this._popularGoals = new Set(
        this.goalDescriptorsSortedByPopularity().slice(0, this.maxPopularGoals)
      )
    }
    return this._popularGoals
  }

  maxPotentialTeamCount(teamFormationPlan) {
    const seatsOnCurrentTeams = teamFormationPlan.teams.reduce((sum, team) => sum + team.teamSize, 0)
    const remainingSeats = teamFormationPlan.seatCount - seatsOnCurrentTeams
    const currentTeamCount = teamFormationPlan.teams.length
    return currentTeamCount + Math.floor(remainingSeats / this.smallestPossiblePopularGoalSize())
  }

  smallestPossiblePopularGoalSize() {
    if (!this._smallestPossiblePopularGoalSize) {
      const teamSizesByGoal = getTeamSizesByGoal(this.pool)
      const recommendeGoalSizes = [...this.popularGoals().values()].map(goal => teamSizesByGoal[goal])
      const smallestPossibleSizes = recommendeGoalSizes.map(getMinTeamSize)
      this._smallestPossiblePopularGoalSize = smallestPossibleSizes.sort()[0]
    }
    return this._smallestPossiblePopularGoalSize
  }

  goalDescriptorsSortedByPopularity() {
    const voteCounts = voteCountsByGoal(this.pool)

    return [...voteCounts.entries()]
      .map(([goalDescriptor, [firstVoteCount, secondVoteCount]]) => {
        const popularity = firstVoteCount + secondVoteCount * MembersGotTheirVoteAppraiser.SECOND_CHOICE_VALUE
        return {goalDescriptor, popularity}
      }).sort(
        (a, b) => b.popularity - a.popularity
      ).map(
       _ => _.goalDescriptor
      )
  }
}
