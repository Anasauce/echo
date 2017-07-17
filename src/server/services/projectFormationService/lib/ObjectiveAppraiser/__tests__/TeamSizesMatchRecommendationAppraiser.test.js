/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions, max-nested-callbacks */

import TeamSizesMatchRecommendationAppraiser from '../TeamSizesMatchRecommendationAppraiser'
import {
  buildTestPool,
  buildTestTeamFormationPlan,
} from '../../../__tests__/helpers'

describe(testContext(__filename), function () {
  const pool = buildTestPool({memberCount: 5, goalCount: 2, teamSizes: [3, 3]})

  context('when teams are complete', function () {
    it('returns the percentage of teams matching recommendation', function () {
      const teamFormationPlan = buildTestTeamFormationPlan([
        {teamSize: 3, members: ['p0', 'p1', 'p2']},
        {teamSize: 2, members: ['p3', 'p4']}
      ], pool)

      const appraiser = new TeamSizesMatchRecommendationAppraiser(pool)
      const score = appraiser.score(teamFormationPlan)

      expect(score).to.eq(1 / 2)
    })
  })

  context('when teams are NOT complete', function () {
    it('returns the percentage of teams planned to match recommendation', function () {
      const teamFormationPlan = buildTestTeamFormationPlan([
        {teamSize: 3, members: []},
        {teamSize: 2, members: []}
      ], pool)

      const appraiser = new TeamSizesMatchRecommendationAppraiser(pool)
      const score = appraiser.score(teamFormationPlan)

      expect(score).to.eq(1 / 2)
    })
  })
})
