/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */
import Promise from 'bluebird'
import factory from 'src/test/factories'
import {resetDB} from 'src/test/helpers'

import {getPoolByCycleIdAndMemberId, r} from 'src/server/services/dataService'

import {
  migrateVotesToPoolsUp,
  migrateVotesToPoolsDown,
} from '../migrateVotesToPools'

const cycleTable = r.table('cycles')
const voteTable = r.table('votes')
const poolTable = r.table('pools')
const poolMembersTable = r.table('poolMembers')

describe(testContext(__filename), function () {
  beforeEach(resetDB)

  beforeEach(async function () {
    const chapters = await factory.createMany('chapter', 2)
    const cycleGroups = await Promise.map(chapters, _createCycles)
    const memberGroups = await Promise.map(chapters, _createMembers)
    await _createVotes({chapters, cycleGroups, memberGroups})
  })

  describe('migrateVotesToPoolsUp', function () {
    it('creates pools for votes that have none', async function () {
      const voteCount = await voteTable.count()
      const cycleCount = await cycleTable.count()
      expect(await _votesWithCycleId()).to.have.length(voteCount)
      expect(await _votesWithPoolId()).to.have.length(0)

      await migrateVotesToPoolsUp()

      expect(await _pools(), 'pool created for each cycle').to.have.length(cycleCount)
      expect(await _votesWithPoolId(), 'poolId added to votes').to.have.length(voteCount)
      await _membersVotesHaveCorrectPool()
      expect(await _votesWithCycleId(), 'cycleId removed from votes').to.have.length(0)
    })

    it('can be run multiple times without breaking things', async function () {
      await migrateVotesToPoolsUp()
      const votes = await voteTable.orderBy('id')
      const cycles = await cycleTable.orderBy('id')
      const pools = await poolTable.orderBy('id')
      const poolMembers = await poolMembersTable.orderBy('id')

      await migrateVotesToPoolsUp()
      expect(await voteTable.orderBy('id'), 'votes unchanged').to.deep.eq(votes)
      expect(await cycleTable.orderBy('id'), 'cycles unchanged').to.deep.eq(cycles)
      expect(await poolTable.orderBy('id'), 'pools unchanged').to.deep.eq(pools)
      expect(await poolMembersTable.orderBy('id'), 'poolMembers unchanged').to.deep.eq(poolMembers)
    })
  })

  describe('migrateVotesToPoolsDown', function () {
    it('reverses the work done by migrateVotesToPoolsUp', async function () {
      const votesQuery = voteTable.without('updatedAt').orderBy('id')
      const cyclesQuery = cycleTable.without('updatedAt').orderBy('id')
      const votes = await votesQuery
      const cycles = await cyclesQuery

      await migrateVotesToPoolsUp()
      await migrateVotesToPoolsDown()

      expect(await votesQuery, 'votes unchanged').to.deep.eq(votes)
      expect(await cyclesQuery, 'cycles unchanged').to.deep.eq(cycles)
    })
  })
})

async function _membersVotesHaveCorrectPool() {
  const votes = await _votesWithPoolId()
  await Promise.map(votes, async vote => {
    const {memberId, poolId} = vote
    const pool = await poolTable.get(poolId)
    const membersPool = await getPoolByCycleIdAndMemberId(pool.cycleId, memberId)
    expect(membersPool.id).to.eq(poolId)
  })
}

function _createCycles(chapter) {
  return factory.createMany('cycle', {chapterId: chapter.id}, 2)
}

function _createMembers(chapter) {
  return factory.createMany('member', {chapterId: chapter.id}, 4)
}

function _createVotes({chapters, cycleGroups, memberGroups}) {
  return Promise.map(chapters, (chapter, i) => {
    const cycles = cycleGroups[i]
    const members = memberGroups[i]
    return Promise.map(cycles, cycle => _createVotesForCycle(cycle, members))
  })
}

function _createVotesForCycle(cycle, members) {
  const voteAttrs = members.map(member => ({
    cycleId: cycle.id,
    memberId: member.id,
  }))
  return factory.createMany('cycle vote', voteAttrs)
}

function _votesWithCycleId() {
  return voteTable.hasFields('cycleId')
}

function _votesWithPoolId() {
  return voteTable.hasFields('poolId')
}

function _pools() {
  return poolTable
}
