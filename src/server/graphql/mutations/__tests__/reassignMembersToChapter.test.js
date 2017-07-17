/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */
import factory from 'src/test/factories'
import {resetDB, runGraphQLQuery} from 'src/test/helpers'
import {Member} from 'src/server/services/dataService'
import {ADMIN} from 'src/common/models/user'

import fields from '../index'

describe(testContext(__filename), function () {
  beforeEach(resetDB)

  it('updates members', async function () {
    const chapter = await factory.create('chapter')
    const members = await factory.createMany('member', 2)
    const memberIds = members.map(p => p.id)

    const results = await runGraphQLQuery(
      `
        query($memberIds: [ID]!, $chapterId: ID!) {
          reassignMembersToChapter(memberIds: $memberIds, chapterId: $chapterId) { id }
        }
      `,
      fields,
      {memberIds: members.map(p => p.id), chapterId: chapter.id},
      {currentUser: {roles: [ADMIN]}},
    )

    expect(
      results.data.reassignMembersToChapter.map(p => p.id).sort()
    ).to.deep.equal(
      memberIds.sort()
    )

    const updatedMembers = await Member.getAll(...memberIds)
    updatedMembers.forEach(p => {
      expect(p.chapterId).to.equal(chapter.id)
    })
  })

  it('unauthorized users recieve an appropriate error')
  it('invalid queries recieve an appropriate error')
})
