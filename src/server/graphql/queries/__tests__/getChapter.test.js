/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */
import factory from 'src/test/factories'
import {resetDB, runGraphQLQuery} from 'src/test/helpers'

import fields from '../index'

const query = `
  query($identifier: String!) {
    getChapter(identifier: $identifier) {
      id
      name
      channelName
    }
  }
`

describe(testContext(__filename), function () {
  beforeEach(resetDB)

  beforeEach('Create current user', async function () {
    this.currentUser = await factory.build('user')
  })

  it('returns correct chapter for identifier', async function () {
    const chapters = await factory.createMany('chapter', 2)
    const chapter = chapters[0]
    const result = await runGraphQLQuery(
      query,
      fields,
      {identifier: chapter.id},
      {currentUser: this.currentUser},
    )
    const returned = result.data.getChapter
    expect(returned.id).to.equal(chapter.id)
    expect(returned.name).to.equal(chapter.name)
    expect(returned.channelName).to.equal(chapter.channelName)
  })

  it('throws an error if chapter is not found', function () {
    const result = runGraphQLQuery(
      query,
      fields,
      {identifier: ''},
      {currentUser: this.currentUser},
    )
    return expect(result).to.eventually.be.rejectedWith(/Chapter not found/i)
  })

  it('throws an error if user is not signed-in', function () {
    const result = runGraphQLQuery(query, fields, {identifier: ''}, {currentUser: null})
    return expect(result).to.eventually.be.rejectedWith(/not authorized/i)
  })
})
