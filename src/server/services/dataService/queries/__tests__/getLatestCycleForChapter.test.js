/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions, max-nested-callbacks */
import {resetDB, useFixture} from 'src/test/helpers'

import getLatestCycleForChapter from '../getLatestCycleForChapter'

describe(testContext(__filename), function () {
  useFixture.createChapterWithCycles()

  beforeEach(resetDB)

  beforeEach(function () {
    return this.createChapterWithCycles()
  })

  it('returns the newest cycle for the given chapter', async function () {
    const cycle = await getLatestCycleForChapter(this.chapter.id)
    expect(cycle.id).to.equal(this.cycles[3].id)
    expect(cycle.startTimestamp.getTime()).to.equal(this.cycles[3].startTimestamp.getTime())
  })
})
