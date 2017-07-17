/* eslint-env mocha */
/* global testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions, max-nested-callbacks */
import {assert} from 'chai'
import {resetDB} from 'src/test/helpers'
import factory from 'src/test/factories'
import {Project} from 'src/server/services/dataService'
import {repeat} from 'src/server/util'
import {GOAL_SELECTION} from 'src/common/models/cycle'

import {formProjects, formProjectsIfNoneExist} from '../formProjects'

const RECOMMENDED_TEAM_SIZE = 4

describe(testContext(__filename), function () {
  describe('formProjects()', function () {
    context('all goals equally popular', function () {
      _itFormsProjectsAsExpected({
        members: 6,
        votes: {distribution: [3, 3]},
      })
    })

    context('one goal gets all votes', function () {
      _itFormsProjectsAsExpected({
        members: 6,
        votes: {distribution: [6]},
      })
    })

    context('every goal gets one vote', function () {
      _itFormsProjectsAsExpected({
        members: 6,
        votes: {distribution: [...repeat(6, 1)]},
      })
    })

    context("some people didn't vote", function () {
      _itFormsProjectsAsExpected({
        members: 10,
        votes: {distribution: [6]},
      })
    })

    context('some pools have no votes', function () {
      _itFormsProjectsAsExpected({
        members: 10,
        votes: {distribution: [6]},
        before: async test => {
          const {members} = await _generateTestData({
            cycle: test.data.cycle,
            members: 2,
            votes: {distribution: [0]},
          })
          test.data.members.push(...members)
        },
      })
    })

    context('a pool has only 1 vote', function () {
      before(resetDB)

      before(async function () {
        this.data = await _generateTestData({
          members: 5,
          votes: {distribution: [5]},
        })
        this.membersIdsThatShouldGetOnTeams = this.data.members.map(_ => _.id)
        // Generate a second pool with one vote
        const {members, votes, pool} = await _generateTestData({
          cycle: this.data.cycle,
          members: 2,
          votes: {distribution: [1]},
        })
        this.poolWithoutEnoughVotes = pool
        this.data.members.push(...members)
        this.data.votes.push(...votes)
      })

      it('places other members on teams and calls the handleNonFatalError callback with an error', async function () {
        const {cycle} = this.data

        const errors = []
        const handleNonFatalError = err => errors.push(err)

        await formProjects(cycle.id, handleNonFatalError)

        const projects = await Project.run()
        const projectMemberIds = _extractMemberIdsFromProjects(projects)
        assert.deepEqual(this.membersIdsThatShouldGetOnTeams.sort(), projectMemberIds.sort(),
            'Members that can be assigned to teams are')

        assert.match(errors[0].message, new RegExp(`Unable to form teams for pool ${this.poolWithoutEnoughVotes.name}`))
      })
    })
  })

  describe('formProjectsIfNoneExist()', function () {
    before(resetDB)

    it('creates projects only once for a given cycle', async function () {
      const {cycle} = await _generateTestData({
        members: 6,
        votes: {distribution: [6]},
      })

      const cycleId = cycle.id

      await formProjectsIfNoneExist(cycleId)
      const initialProjects = await Project.filter({cycleId})
      console.log('first projects:', initialProjects.length)
      assert(initialProjects.length > 0, 'projectCount should be > 0')

      await formProjectsIfNoneExist(cycleId)
      const finalProjects = await Project.filter({cycleId})
      console.log('final projects:', finalProjects.length)
      assert(initialProjects.length === finalProjects.length, 'project count should not change')
    })
  })
})

function _itFormsProjectsAsExpected(options) {
  before(resetDB)

  before(async function () {
    const {cycle, members, votes} = await _generateTestData(options)
    this.data = {cycle, members, votes}
    options.before && await options.before(this)
    await formProjects(cycle.id)
    this.data.projects = await Project.run()
  })

  it('places all members who voted on teams, and ONLY members who voted', function () {
    const {projects, votes} = this.data

    const projectMemberIds = _extractMemberIdsFromProjects(projects)

    assert.strictEqual(votes.length, projectMemberIds.length,
        'Number of members who voted does not equal number of members assigned to projects')

    votes.forEach(({memberId}) => {
      const memberIdInProject = projectMemberIds.find(id => memberId === id)
      assert.isOk(memberIdInProject, `Member ${memberId} not assigned to a project`)
    })
  })
}

async function _generateTestData(options = {}) {
  const cycle = options.cycle || await factory.create('cycle', {state: GOAL_SELECTION})
  const phase = await factory.create('phase', {hasVoting: true})
  const pool = await factory.create('pool', {cycleId: cycle.id, phaseId: phase.id})
  const members = await factory.createMany('member', {chapterId: cycle.chapterId, phaseId: phase.id}, options.members)
  const poolMembers = members.map(member => ({memberId: member.id, poolId: pool.id}))
  await factory.createMany('poolMember', poolMembers, poolMembers.length)
  const votes = await _generateVotes(phase.number, pool.id, members, options.votes)
  return {cycle, pool, members, votes}
}

function _generateVotes(phaseNumber, poolId, members, options) {
  const voteData = _createGoalVotes(options)

  const votes = voteData.map((goalIds, i) => ({
    poolId,
    memberId: members[i].id,
    goals: goalIds.map(goalId => ({
      url: `http://ex.co/${goalId}`,
      phase: phaseNumber,
      title: `Goal ${goalId}`,
      teamSize: RECOMMENDED_TEAM_SIZE
    })),
  }))

  return factory.createMany('vote', votes, votes.length)
}

function _extractMemberIdsFromProjects(projects) {
  const allMemberIds = projects.reduce((result, project) => {
    project.memberIds.forEach(memberId => result.set(memberId, memberId))
    return result
  }, new Map())

  return Array.from(allMemberIds.values())
}

function _createGoalVotes({distribution}) {
  return distribution.reduce((votes, count, i) => {
    const firstChoice = i + 100
    const secondChoice = firstChoice + 1
    const vote = [firstChoice, secondChoice]
    return votes.concat(repeat(count, vote))
  }, [])
}
