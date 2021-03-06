/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */
import Promise from 'bluebird'
import factory from 'src/test/factories'
import {resetDB} from 'src/test/helpers'

import {getPoolByCycleIdAndPlayerId, r} from 'src/server/services/dataService'

import {
  migrateVotesToPoolsUp,
  migrateVotesToPoolsDown,
} from '../migrateVotesToPools'

const cyclesTable = r.table('cycles')
const votesTable = r.table('votes')
const poolsTable = r.table('pools')
const playersPoolsTable = r.table('playersPools')

describe(testContext(__filename), function () {
  beforeEach(resetDB)

  beforeEach(async function () {
    const chapters = await factory.createMany('chapter', 2)
    const cycleGroups = await Promise.map(chapters, _createCycles)
    const playerGroups = await Promise.map(chapters, _createPlayers)
    await _createVotes({chapters, cycleGroups, playerGroups})
  })

  describe('migrateVotesToPoolsUp', function () {
    it('creates pools for votes that have none', async function () {
      const voteCount = await votesTable.count()
      const cycleCount = await cyclesTable.count()
      expect(await _votesWithCycleId()).to.have.length(voteCount)
      expect(await _votesWithPoolId()).to.have.length(0)

      await migrateVotesToPoolsUp()

      expect(await _pools(), 'pool created for each cycle').to.have.length(cycleCount)
      expect(await _votesWithPoolId(), 'poolId added to votes').to.have.length(voteCount)
      await _playersVotesHaveCorrectPool()
      expect(await _votesWithCycleId(), 'cycleId removed from votes').to.have.length(0)
    })

    it('can be run multiple times without breaking things', async function () {
      await migrateVotesToPoolsUp()
      const votes = await votesTable.orderBy('id')
      const cycles = await cyclesTable.orderBy('id')
      const pools = await poolsTable.orderBy('id')
      const playersPools = await playersPoolsTable.orderBy('id')

      await migrateVotesToPoolsUp()
      expect(await votesTable.orderBy('id'), 'votes unchanged').to.deep.eq(votes)
      expect(await cyclesTable.orderBy('id'), 'cycles unchanged').to.deep.eq(cycles)
      expect(await poolsTable.orderBy('id'), 'pools unchanged').to.deep.eq(pools)
      expect(await playersPoolsTable.orderBy('id'), 'playersPools unchanged').to.deep.eq(playersPools)
    })
  })

  describe('migrateVotesToPoolsDown', function () {
    it('reverses the work done by migrateVotesToPoolsUp', async function () {
      const votesQuery = votesTable.without('updatedAt').orderBy('id')
      const cyclesQuery = cyclesTable.without('updatedAt').orderBy('id')
      const votes = await votesQuery
      const cycles = await cyclesQuery

      await migrateVotesToPoolsUp()
      await migrateVotesToPoolsDown()

      expect(await votesQuery, 'votes unchanged').to.deep.eq(votes)
      expect(await cyclesQuery, 'cycles unchanged').to.deep.eq(cycles)
    })
  })
})

async function _playersVotesHaveCorrectPool() {
  const votes = await _votesWithPoolId()
  await Promise.map(votes, async vote => {
    const {playerId, poolId} = vote
    const pool = await poolsTable.get(poolId)
    const playersPool = await getPoolByCycleIdAndPlayerId(pool.cycleId, playerId)
    expect(playersPool.id).to.eq(poolId)
  })
}

function _createCycles(chapter) {
  return factory.createMany('cycle', {chapterId: chapter.id}, 2)
}

function _createPlayers(chapter) {
  return factory.createMany('player', {chapterId: chapter.id}, 4)
}

function _createVotes({chapters, cycleGroups, playerGroups}) {
  return Promise.map(chapters, (chapter, i) => {
    const cycles = cycleGroups[i]
    const players = playerGroups[i]
    return Promise.map(cycles, cycle => _createVotesForCycle(cycle, players))
  })
}

function _createVotesForCycle(cycle, players) {
  const voteAttrs = players.map(player => ({
    cycleId: cycle.id,
    playerId: player.id,
  }))
  return factory.createMany('cycle vote', voteAttrs)
}

function _votesWithCycleId() {
  return votesTable.hasFields('cycleId')
}

function _votesWithPoolId() {
  return votesTable.hasFields('poolId')
}

function _pools() {
  return poolsTable
}
