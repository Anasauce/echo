/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions, max-nested-callbacks */

import {buildTestPool} from '../../../__tests__/helpers'

import UnpopularGoalsNotConsideredAppraiser from '../UnpopularGoalsNotConsideredAppraiser'

describe(testContext(__filename), function () {
  const pool = buildTestPool({
    memberCount: 50,
    goalCount: 20,
    teamSize: 4,
    voteDistributionPercentages: [0.2, 0.2, 0.2, 0.2],
  })

  context('when teams are complete', function () {
    it('returns the percentage of teams formed with popular goals', function () {
      const teamFormationPlan = {
        seatCount: 16,
        teams: [
          pool.goals[0],
          pool.goals[1],
          pool.goals[10],
          pool.goals[11],
        ]
      }
      const appraiser = new UnpopularGoalsNotConsideredAppraiser(pool, 6)
      const score = appraiser.score(teamFormationPlan)

      expect(score).to.eq(1 / 2)
    })
  })
  context('when teams are NOT complete', function () {
    it('returns the percentage of teams that could end up formed with popular goals', function () {
      const teamFormationPlan = {
        seatCount: 16 + 12, // 16 on the teams formed so far, and 12 more leaving room for at most 4 new teams of 3
        teams: [
          pool.goals[0],
          pool.goals[1],
          pool.goals[10],
          pool.goals[11],
        ]
      }
      const appraiser = new UnpopularGoalsNotConsideredAppraiser(pool, 6)
      const score = appraiser.score(teamFormationPlan)

      expect(score).to.eq(6 / 8)
    })
  })

  context('when pool hase team size one goals', function () {
    const pool = buildTestPool({
      memberCount: 50,
      goalCount: 20,
      teamSizes: [1, 2, 4, 4],
      voteDistributionPercentages: [0.2, 0.2, 0.2, 0.2],
    })

    it('returns the percentage of teams formed with popular goals', function () {
      const teamFormationPlan = {
        seatCount: 16,
        teams: [
          pool.goals[0],
          pool.goals[0],
          pool.goals[1],
          pool.goals[10],
          pool.goals[11],
          pool.goals[11],
        ]
      }
      const appraiser = new UnpopularGoalsNotConsideredAppraiser(pool, 6)
      const score = appraiser.score(teamFormationPlan)

      expect(score).to.eq(1 / 2)
    })
  })
})
