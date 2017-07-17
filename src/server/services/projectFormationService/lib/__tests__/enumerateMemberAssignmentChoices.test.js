/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions, max-nested-callbacks */

import {getPoolSize} from '../pool'
import {choose} from '../util'
import {teamFormationPlanToString} from '../teamFormationPlan'
import enumerateMemberAssignmentChoices from '../enumerateMemberAssignmentChoices'
import {buildTestPool, buildTestTeamFormationPlan} from '../../__tests__/helpers'

describe(testContext(__filename), function () {
  const pool = buildTestPool({
    memberCount: 6,
    goalCount: 3,
    teamSizes: [2, 2, 2],
    voteDistributionPercentages: [1],
  })

  const teamFormationPlan = buildTestTeamFormationPlan([
    {goal: 'g0', teamSize: 2},
    {goal: 'g1', teamSize: 2},
    {goal: 'g2', teamSize: 2},
  ], pool)

  it('returns the expected number of plans', function () {
    const result = [...enumerateMemberAssignmentChoices(pool, teamFormationPlan)]

    const memberCount = getPoolSize(pool)

    expect(result).to.have.length(
      choose(memberCount, 2) *
      choose(memberCount - 2, 2)
    )
  })

  it('returns the expected plans', function () {
    const result = [...enumerateMemberAssignmentChoices(pool, teamFormationPlan)]

    expect(result.map(teamFormationPlanToString).sort()).to.deep.eq([
      '(g0:2)[p0,p1], (g1:2)[p2,p3], (g2:2)[p4,p5]',
      '(g0:2)[p0,p1], (g1:2)[p2,p4], (g2:2)[p3,p5]',
      '(g0:2)[p0,p1], (g1:2)[p2,p5], (g2:2)[p3,p4]',
      '(g0:2)[p0,p1], (g1:2)[p3,p4], (g2:2)[p2,p5]',
      '(g0:2)[p0,p1], (g1:2)[p3,p5], (g2:2)[p2,p4]',
      '(g0:2)[p0,p1], (g1:2)[p4,p5], (g2:2)[p2,p3]',
      '(g0:2)[p0,p2], (g1:2)[p1,p3], (g2:2)[p4,p5]',
      '(g0:2)[p0,p2], (g1:2)[p1,p4], (g2:2)[p3,p5]',
      '(g0:2)[p0,p2], (g1:2)[p1,p5], (g2:2)[p3,p4]',
      '(g0:2)[p0,p2], (g1:2)[p3,p4], (g2:2)[p1,p5]',
      '(g0:2)[p0,p2], (g1:2)[p3,p5], (g2:2)[p1,p4]',
      '(g0:2)[p0,p2], (g1:2)[p4,p5], (g2:2)[p1,p3]',
      '(g0:2)[p0,p3], (g1:2)[p1,p2], (g2:2)[p4,p5]',
      '(g0:2)[p0,p3], (g1:2)[p1,p4], (g2:2)[p2,p5]',
      '(g0:2)[p0,p3], (g1:2)[p1,p5], (g2:2)[p2,p4]',
      '(g0:2)[p0,p3], (g1:2)[p2,p4], (g2:2)[p1,p5]',
      '(g0:2)[p0,p3], (g1:2)[p2,p5], (g2:2)[p1,p4]',
      '(g0:2)[p0,p3], (g1:2)[p4,p5], (g2:2)[p1,p2]',
      '(g0:2)[p0,p4], (g1:2)[p1,p2], (g2:2)[p3,p5]',
      '(g0:2)[p0,p4], (g1:2)[p1,p3], (g2:2)[p2,p5]',
      '(g0:2)[p0,p4], (g1:2)[p1,p5], (g2:2)[p2,p3]',
      '(g0:2)[p0,p4], (g1:2)[p2,p3], (g2:2)[p1,p5]',
      '(g0:2)[p0,p4], (g1:2)[p2,p5], (g2:2)[p1,p3]',
      '(g0:2)[p0,p4], (g1:2)[p3,p5], (g2:2)[p1,p2]',
      '(g0:2)[p0,p5], (g1:2)[p1,p2], (g2:2)[p3,p4]',
      '(g0:2)[p0,p5], (g1:2)[p1,p3], (g2:2)[p2,p4]',
      '(g0:2)[p0,p5], (g1:2)[p1,p4], (g2:2)[p2,p3]',
      '(g0:2)[p0,p5], (g1:2)[p2,p3], (g2:2)[p1,p4]',
      '(g0:2)[p0,p5], (g1:2)[p2,p4], (g2:2)[p1,p3]',
      '(g0:2)[p0,p5], (g1:2)[p3,p4], (g2:2)[p1,p2]',
      '(g0:2)[p1,p2], (g1:2)[p0,p3], (g2:2)[p4,p5]',
      '(g0:2)[p1,p2], (g1:2)[p0,p4], (g2:2)[p3,p5]',
      '(g0:2)[p1,p2], (g1:2)[p0,p5], (g2:2)[p3,p4]',
      '(g0:2)[p1,p2], (g1:2)[p3,p4], (g2:2)[p0,p5]',
      '(g0:2)[p1,p2], (g1:2)[p3,p5], (g2:2)[p0,p4]',
      '(g0:2)[p1,p2], (g1:2)[p4,p5], (g2:2)[p0,p3]',
      '(g0:2)[p1,p3], (g1:2)[p0,p2], (g2:2)[p4,p5]',
      '(g0:2)[p1,p3], (g1:2)[p0,p4], (g2:2)[p2,p5]',
      '(g0:2)[p1,p3], (g1:2)[p0,p5], (g2:2)[p2,p4]',
      '(g0:2)[p1,p3], (g1:2)[p2,p4], (g2:2)[p0,p5]',
      '(g0:2)[p1,p3], (g1:2)[p2,p5], (g2:2)[p0,p4]',
      '(g0:2)[p1,p3], (g1:2)[p4,p5], (g2:2)[p0,p2]',
      '(g0:2)[p1,p4], (g1:2)[p0,p2], (g2:2)[p3,p5]',
      '(g0:2)[p1,p4], (g1:2)[p0,p3], (g2:2)[p2,p5]',
      '(g0:2)[p1,p4], (g1:2)[p0,p5], (g2:2)[p2,p3]',
      '(g0:2)[p1,p4], (g1:2)[p2,p3], (g2:2)[p0,p5]',
      '(g0:2)[p1,p4], (g1:2)[p2,p5], (g2:2)[p0,p3]',
      '(g0:2)[p1,p4], (g1:2)[p3,p5], (g2:2)[p0,p2]',
      '(g0:2)[p1,p5], (g1:2)[p0,p2], (g2:2)[p3,p4]',
      '(g0:2)[p1,p5], (g1:2)[p0,p3], (g2:2)[p2,p4]',
      '(g0:2)[p1,p5], (g1:2)[p0,p4], (g2:2)[p2,p3]',
      '(g0:2)[p1,p5], (g1:2)[p2,p3], (g2:2)[p0,p4]',
      '(g0:2)[p1,p5], (g1:2)[p2,p4], (g2:2)[p0,p3]',
      '(g0:2)[p1,p5], (g1:2)[p3,p4], (g2:2)[p0,p2]',
      '(g0:2)[p2,p3], (g1:2)[p0,p1], (g2:2)[p4,p5]',
      '(g0:2)[p2,p3], (g1:2)[p0,p4], (g2:2)[p1,p5]',
      '(g0:2)[p2,p3], (g1:2)[p0,p5], (g2:2)[p1,p4]',
      '(g0:2)[p2,p3], (g1:2)[p1,p4], (g2:2)[p0,p5]',
      '(g0:2)[p2,p3], (g1:2)[p1,p5], (g2:2)[p0,p4]',
      '(g0:2)[p2,p3], (g1:2)[p4,p5], (g2:2)[p0,p1]',
      '(g0:2)[p2,p4], (g1:2)[p0,p1], (g2:2)[p3,p5]',
      '(g0:2)[p2,p4], (g1:2)[p0,p3], (g2:2)[p1,p5]',
      '(g0:2)[p2,p4], (g1:2)[p0,p5], (g2:2)[p1,p3]',
      '(g0:2)[p2,p4], (g1:2)[p1,p3], (g2:2)[p0,p5]',
      '(g0:2)[p2,p4], (g1:2)[p1,p5], (g2:2)[p0,p3]',
      '(g0:2)[p2,p4], (g1:2)[p3,p5], (g2:2)[p0,p1]',
      '(g0:2)[p2,p5], (g1:2)[p0,p1], (g2:2)[p3,p4]',
      '(g0:2)[p2,p5], (g1:2)[p0,p3], (g2:2)[p1,p4]',
      '(g0:2)[p2,p5], (g1:2)[p0,p4], (g2:2)[p1,p3]',
      '(g0:2)[p2,p5], (g1:2)[p1,p3], (g2:2)[p0,p4]',
      '(g0:2)[p2,p5], (g1:2)[p1,p4], (g2:2)[p0,p3]',
      '(g0:2)[p2,p5], (g1:2)[p3,p4], (g2:2)[p0,p1]',
      '(g0:2)[p3,p4], (g1:2)[p0,p1], (g2:2)[p2,p5]',
      '(g0:2)[p3,p4], (g1:2)[p0,p2], (g2:2)[p1,p5]',
      '(g0:2)[p3,p4], (g1:2)[p0,p5], (g2:2)[p1,p2]',
      '(g0:2)[p3,p4], (g1:2)[p1,p2], (g2:2)[p0,p5]',
      '(g0:2)[p3,p4], (g1:2)[p1,p5], (g2:2)[p0,p2]',
      '(g0:2)[p3,p4], (g1:2)[p2,p5], (g2:2)[p0,p1]',
      '(g0:2)[p3,p5], (g1:2)[p0,p1], (g2:2)[p2,p4]',
      '(g0:2)[p3,p5], (g1:2)[p0,p2], (g2:2)[p1,p4]',
      '(g0:2)[p3,p5], (g1:2)[p0,p4], (g2:2)[p1,p2]',
      '(g0:2)[p3,p5], (g1:2)[p1,p2], (g2:2)[p0,p4]',
      '(g0:2)[p3,p5], (g1:2)[p1,p4], (g2:2)[p0,p2]',
      '(g0:2)[p3,p5], (g1:2)[p2,p4], (g2:2)[p0,p1]',
      '(g0:2)[p4,p5], (g1:2)[p0,p1], (g2:2)[p2,p3]',
      '(g0:2)[p4,p5], (g1:2)[p0,p2], (g2:2)[p1,p3]',
      '(g0:2)[p4,p5], (g1:2)[p0,p3], (g2:2)[p1,p2]',
      '(g0:2)[p4,p5], (g1:2)[p1,p2], (g2:2)[p0,p3]',
      '(g0:2)[p4,p5], (g1:2)[p1,p3], (g2:2)[p0,p2]',
      '(g0:2)[p4,p5], (g1:2)[p2,p3], (g2:2)[p0,p1]',
    ].sort())
  })

  it('returns plans with the correct number of members in each team', function () {
    const teamFormationPlan = buildTestTeamFormationPlan([
      {goal: 'g0', teamSize: 2},
      {goal: 'g1', teamSize: 4},
    ], pool)

    const result = [...enumerateMemberAssignmentChoices(pool, teamFormationPlan)]
    result.forEach(newPlan => {
      expect(newPlan.teams[0]).to.have.property('memberIds').with.length(2)
      expect(newPlan.teams[1]).to.have.property('memberIds').with.length(4)
    })
  })

  it('returns plans with the same goal selections as in root plan', function () {
    const result = [...enumerateMemberAssignmentChoices(pool, teamFormationPlan)]
    const pluckDescriptorAndSize = teams => teams
      .map(({goalDescriptor, teamSize}) => ({goalDescriptor, teamSize}))

    result.forEach(newPlan =>
      expect(
        pluckDescriptorAndSize(newPlan.teams)
      ).to.deep.eq(
        pluckDescriptorAndSize(teamFormationPlan.teams)
      )
    )
  })

  it('accepts a pruning function', function () {
    const shouldPrune = teamFormationPlan => {
      // Prune any branch where g0 has members with even ids
      const g0Team = teamFormationPlan.teams.find(({goalDescriptor}) => goalDescriptor === 'g0')
      const prune = g0Team && g0Team.memberIds.some(id => id.match(/[02468]/))
      return prune
    }
    const result = [...enumerateMemberAssignmentChoices(pool, teamFormationPlan, shouldPrune)]
    const memberCount = 6
    const oddMemberCount = 3

    expect(result).to.have.length(
      choose(oddMemberCount, 2) *
      choose(memberCount - 2, 2)
    )
  })
})
