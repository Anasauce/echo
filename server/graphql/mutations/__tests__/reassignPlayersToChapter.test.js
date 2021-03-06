/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */
import factory from 'src/test/factories'
import {resetDB, runGraphQLQuery} from 'src/test/helpers'
import {Player} from 'src/server/services/dataService'
import {ADMIN} from 'src/common/models/user'

import fields from '../index'

describe(testContext(__filename), function () {
  beforeEach(resetDB)

  it('updates players', async function () {
    const chapter = await factory.create('chapter')
    const players = await factory.createMany('player', 2)
    const playerIds = players.map(p => p.id)

    const results = await runGraphQLQuery(
      `
        query($playerIds: [ID]!, $chapterId: ID!) {
          reassignPlayersToChapter(playerIds: $playerIds, chapterId: $chapterId) { id }
        }
      `,
      fields,
      {playerIds: players.map(p => p.id), chapterId: chapter.id},
      {currentUser: {roles: [ADMIN]}},
    )

    expect(
      results.data.reassignPlayersToChapter.map(p => p.id).sort()
    ).to.deep.equal(
      playerIds.sort()
    )

    const updatedPlayers = await Player.getAll(...playerIds)
    updatedPlayers.forEach(p => {
      expect(p.chapterId).to.equal(chapter.id)
    })
  })

  it('unauthorized users recieve an appropriate error')
  it('invalid queries recieve an appropriate error')
})
