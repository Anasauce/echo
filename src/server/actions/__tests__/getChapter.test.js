/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */
import factory from 'src/test/factories'
import {resetDB} from 'src/test/helpers'

import getChapter from '../getChapter'

describe(testContext(__filename), function () {
  beforeEach(resetDB)

  it('returns correct chapter for UUID', async function () {
    const chapter = await factory.create('chapter')
    const result = await getChapter(chapter.id)
    expect(result.id).to.equal(chapter.id)
    expect(result.name).to.equal(chapter.name)
  })

  it('returns null if chapter does not exist', async function () {
    const result = await getChapter('fake.id')
    return expect(result).to.eq(null)
  })
})
