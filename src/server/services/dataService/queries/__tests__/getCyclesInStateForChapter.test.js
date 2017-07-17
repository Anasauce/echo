/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions, max-nested-callbacks */
import {GOAL_SELECTION} from 'src/common/models/cycle'
import {resetDB, useFixture} from 'src/test/helpers'

import getCyclesInStateForChapter from '../getCyclesInStateForChapter'

describe(testContext(__filename), function () {
  useFixture.createChapterWithCycles()

  beforeEach(resetDB)

  beforeEach(function () {
    return this.createChapterWithCycles({state: GOAL_SELECTION})
  })

  it('returns the list of cycles in a given state with most recent first', function () {
    return getCyclesInStateForChapter(this.chapter.id, GOAL_SELECTION)
      .then(cycles => {
        expect(cycles.length).to.equal(4)
        expect(cycles[0].startTimestamp).to.be.above(cycles[1].startTimestamp)
      })
  })
})
