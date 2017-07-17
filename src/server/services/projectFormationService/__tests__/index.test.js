/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions, max-nested-callbacks */

import profiler from '../lib/util/profiler'
import {teamFormationPlanToString} from '../lib/teamFormationPlan'
import {getTeamFormationPlan} from '../index'

import {buildTestPool} from './helpers'

describe(testContext(__filename), function () {
  it('works when everyone votes for the same goal', function () {
    const pool = {
      votes: [
        {memberId: 'p0', votes: ['g1', 'g2']},
        {memberId: 'p1', votes: ['g1', 'g2']},
        {memberId: 'p2', votes: ['g1', 'g2']},
        {memberId: 'p3', votes: ['g1', 'g2']},
        {memberId: 'p4', votes: ['g1', 'g2']},
        {memberId: 'p5', votes: ['g1', 'g2']},
        {memberId: 'p6', votes: ['g1', 'g2']},
        {memberId: 'p7', votes: ['g1', 'g2']},
      ],
      goals: [
        {goalDescriptor: 'g1', teamSize: 4},
        {goalDescriptor: 'g2', teamSize: 4},
        {goalDescriptor: 'g3', teamSize: 4},
      ],
    }

    const {teams} = getTeamFormationPlan(pool)

    expect(teams).to.have.length(2)

    teams.forEach(team => {
      expect(team.goalDescriptor).to.eq('g1')
      expect(team.memberIds).to.have.length(4)
    })
  })

  it('works when two goals tie for most popular', function () {
    const pool = {
      votes: [
        {memberId: 'p0', votes: ['g1', 'g2']},
        {memberId: 'p1', votes: ['g1', 'g2']},
        {memberId: 'p2', votes: ['g1', 'g2']},
        {memberId: 'p3', votes: ['g1', 'g2']},
        {memberId: 'p4', votes: ['g2', 'g1']},
        {memberId: 'p5', votes: ['g2', 'g1']},
        {memberId: 'p6', votes: ['g2', 'g1']},
        {memberId: 'p7', votes: ['g2', 'g1']},
      ],
      goals: [
        {goalDescriptor: 'g1', teamSize: 4},
        {goalDescriptor: 'g2', teamSize: 4},
      ],
    }

    const {teams} = getTeamFormationPlan(pool)

    expect(teams).to.have.length(2)

    for (const goalDescriptor of ['g1', 'g2']) {
      const team = teams.find(_ => _.goalDescriptor === goalDescriptor)

      expect(team, 'a team is formed for each most popular goal').to.be
      expect(team.memberIds, 'each team gets half the members').to.have.length(4)
    }
  })

  it('works with goals of team size 1', function () {
    const pool = {
      votes: [
        {memberId: 'p0', votes: ['g1', 'g2']},
        {memberId: 'p1', votes: ['g1', 'g2']},
        {memberId: 'p2', votes: ['g1', 'g2']},
        {memberId: 'p3', votes: ['g1', 'g2']},
        {memberId: 'p4', votes: ['g1', 'g2']},
        {memberId: 'p5', votes: ['g1', 'g2']},
        {memberId: 'p6', votes: ['g1', 'g2']},
        {memberId: 'p7', votes: ['g1', 'g2']},
      ],
      goals: [
        {goalDescriptor: 'g1', teamSize: 1},
        {goalDescriptor: 'g2', teamSize: 4},
        {goalDescriptor: 'g3', teamSize: 4},
      ],
    }

    const {teams} = getTeamFormationPlan(pool)

    expect(teams).to.have.length(pool.votes.length)

    teams.forEach(team => {
      expect(team.goalDescriptor).to.eq('g1')
      expect(team.memberIds).to.have.length(1)
    })
  })

  it('will throw an error if no solution can be found', function () {
    const pool = {
      votes: [
        {memberId: 'p0', votes: ['g1', 'g2']},
        {memberId: 'p1', votes: ['g1', 'g2']},
        {memberId: 'p2', votes: ['g1', 'g2']},
        {memberId: 'p3', votes: ['g1', 'g2']},
        {memberId: 'p4', votes: ['g1', 'g2']},

        {memberId: 'p5', votes: ['g2', 'g1']},
        {memberId: 'p6', votes: ['g2', 'g1']},
        {memberId: 'p7', votes: ['g2', 'g1']},
        {memberId: 'p8', votes: ['g2', 'g1']},
        {memberId: 'p9', votes: ['g2', 'g1']},
      ],
      goals: [
        {goalDescriptor: 'g1', teamSize: 13},
        {goalDescriptor: 'g2', teamSize: 13},
      ],
    }

    expect(() => getTeamFormationPlan(pool)).to.throw()
  })

  describe('performance tests', function () {
    if (!process.env.LG_RUN_PERF_TESTS) {
      it('skips perormance tests')
      return
    }
    beforeEach(function () {
      profiler.reset()
      console.log(new Date())
    })

    const minutes = n => n * 60000
    const scenarios = [
      // 0
      {
        pool: buildTestPool({memberCount: 19, teamSize: 4, goalCount: 5}),
        expectedRuntime: minutes(0.25),
        minResultScore: 0.95,
      },
      // 1
      {
        pool: buildTestPool({
          memberCount: 40,
          teamSize: 4,
          goalCount: 5,
        }),
        expectedRuntime: minutes(0.25),
        minResultScore: 0.95,
      },
      // 2
      {
        pool: buildTestPool({memberCount: 34, teamSize: 4, goalCount: 5}),
        expectedRuntime: minutes(0.50),
        minResultScore: 0.95,
      },
      // 3
      {
        pool: buildTestPool({memberCount: 34, teamSize: 4, goalCount: 12}),
        expectedRuntime: minutes(2.50),
        minResultScore: 0.925,
      },
      // 4
      {
        pool: buildTestPool({
          memberCount: 37,
          teamSize: 4,
          goalCount: 5,
        }),
        expectedRuntime: minutes(0.40),
        minResultScore: 0.85,
      },
      // 5
      {
        pool: buildTestPool({
          memberCount: 40,
          teamSize: 4,
          goalCount: 12,
        }),
        expectedRuntime: minutes(5),
        minResultScore: 0.95,
      },
      // 6
      {
        pool: buildTestPool({
          memberCount: 20,
          teamSizes: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
          goalCount: 12,
        }),
        expectedRuntime: minutes(5),
        minResultScore: 0.95,
      },
    ]

    scenarios.forEach(({pool, minResultScore, expectedRuntime}, i) => {
      const expectedMinutes = (expectedRuntime / 60000).toFixed(2)
      it(`completes scenario [${i}] in under ${expectedMinutes} minutes`, function () {
        this.timeout(expectedRuntime + minutes(1))
        const start = Date.now()

        const teamFormationPlan = getTeamFormationPlan(pool)
        console.log('result:', teamFormationPlanToString(teamFormationPlan), teamFormationPlan.score)

        const elapsedMilliseconds = Date.now() - start
        console.log('scenario', i, 'completed in', (elapsedMilliseconds / 60000).toFixed(2), 'minutes')

        expect(elapsedMilliseconds).to.be.lt(expectedRuntime)
        // expect(teamFormationPlan.score).to.be.gt(minResultScore)
      })
    })

    afterEach(function () {
      profiler.report()
    })
  })
})
