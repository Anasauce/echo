/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions, max-nested-callbacks */

import Promise from 'bluebird'
import {Member} from 'src/server/services/dataService'
import factory from 'src/test/factories'
import {resetDB} from 'src/test/helpers'

import reassignMembersToChapter from '../reassignMembersToChapter'

describe(testContext(__filename), function () {
  beforeEach(resetDB)

  beforeEach(function () {
    return Promise.all([
      factory.createMany('member', 2).then(members => {
        this.members = members
        this.membersById = members.reduce((obj, member) => Object.assign(obj, {[member.id]: member}), {})
      }),
      factory.create('chapter').then(c => {
        this.newChapter = c
      }),
    ])
  })

  it('changes the members chapterId & chapterHistory', async function () {
    const memberIds = Object.keys(this.membersById)
    await reassignMembersToChapter(memberIds, this.newChapter.id)
    const members = await Member.getAll(...memberIds)
    members.forEach(member => {
      const oldChapterId = this.membersById[member.id].chapterId
      expect(member.chapterId).to.equal(this.newChapter.id)
      expect(member.chapterHistory).to.have.length(1)
      expect(member.chapterHistory[0].chapterId).to.equal(oldChapterId)
    })
  })

  it('returns the new members', async function () {
    const memberIds = this.members.map(p => p.id)
    const result = await reassignMembersToChapter(memberIds, this.newChapter.id)
    const members = await Member.getAll(...memberIds)
    expect(result.length).to.equal(members.length)
    members.forEach((member, i) => {
      expect(result[i].id).to.equal(member.id)
      expect(result[i].chapterId).to.equal(member.chapterId)
      expect(result[i].createdAt.getTime()).to.deep.equal(member.createdAt.getTime())
      expect(result[i].updatedAt.getTime()).to.equal(member.updatedAt.getTime())
      expect(result[i].chapterHistory).to.deep.equal(member.chapterHistory)
    })
  })

  it('ignores members already in the given chapter', function () {
    const memberIds = this.members.map(p => p.id)
    const result = reassignMembersToChapter(memberIds, this.members[0].chapterId)
    return expect(result).to.eventually.have.length(1)
  })

  it('resolve promise with empty array when no matches', function () {
    const result = reassignMembersToChapter(['not-a-member-id'], this.newChapter.id)
    return expect(result).to.eventually.deep.equal([])
  })
})
