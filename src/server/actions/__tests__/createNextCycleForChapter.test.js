/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions, max-nested-callbacks */

import {GOAL_SELECTION, COMPLETE} from 'src/common/models/cycle'
import {Cycle} from 'src/server/services/dataService'
import {resetDB, useFixture} from 'src/test/helpers'

import createNextCycleForChapter from '../createNextCycleForChapter'

describe(testContext(__filename), function () {
  useFixture.createChapterWithCycles()

  beforeEach(resetDB)

  describe('createNextCycleForChapter', function () {
    beforeEach(function () {
      return this.createChapterWithCycles()
    })

    function _itCreatesANewCycle() {
      it('creates a new cycle for this chapter', async function () {
        const beginTimestamp = Date.now()
        const cycle = await createNextCycleForChapter(this.chapter.id)
        expect(cycle.state).to.equal(GOAL_SELECTION)
        expect(cycle.chapterId).to.equal(this.chapter.id)
        expect(cycle.cycleNumber).to.equal(
          this.cycles.length ?
            this.cycles[this.cycles.length - 1].cycleNumber + 1 :
            1
        )
        expect(cycle.startTimestamp.getTime()).to.gt(beginTimestamp)
        expect(cycle.createdAt.getTime()).to.gt(beginTimestamp)
        expect(cycle.updatedAt.getTime()).to.gt(beginTimestamp)
      })
    }

    _itCreatesANewCycle()

    it('moves the previous cycle to COMPLETE', async function () {
      const beginTimestamp = Date.now()
      const previousCycle = this.cycles[this.cycles.length - 1]
      expect(previousCycle.state).to.not.eq(COMPLETE)
      expect(previousCycle.endTimestamp).to.not.exist
      expect(previousCycle.updatedAt.getTime()).to.not.gt(beginTimestamp)

      await createNextCycleForChapter(this.chapter.id)

      const updatedPreviousCycle = await Cycle.get(previousCycle.id)
      expect(updatedPreviousCycle.state).to.eq(COMPLETE)
      expect(updatedPreviousCycle.endTimestamp.getTime()).to.gt(beginTimestamp)
      expect(updatedPreviousCycle.updatedAt.getTime()).to.gt(beginTimestamp)
    })

    describe('when there are no prior cycles', function () {
      beforeEach(async function () {
        await Cycle.delete().execute()
        this.cycles = []
      })
      _itCreatesANewCycle()
    })
  })
})
