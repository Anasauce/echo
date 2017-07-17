/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */
import {
  teamPlay,
  technicalComprehension,
} from 'src/server/util/feedback'

describe(testContext(__filename), function () {
  describe('technicalComprehension()', function () {
    it('none', function () {
      const technicalComprehensionScore = technicalComprehension([])
      expect(technicalComprehensionScore).to.eq(0)
    })

    it('round down', function () {
      const technicalComprehensionScore = technicalComprehension([5, 6, 7])
      expect(technicalComprehensionScore).to.eq(83)
    })

    it('round up', function () {
      const technicalComprehensionScore = technicalComprehension([5, 7, 7])
      expect(technicalComprehensionScore).to.eq(89)
    })
  })

  describe('teamPlay()', function () {
    it('none', function () {
      const teamPlayScore = teamPlay([])
      expect(teamPlayScore).to.eq(0)
    })

    it('round down', function () {
      const teamPlayScore = teamPlay([5, 6, 7])
      expect(teamPlayScore).to.eq(83)
    })

    it('round up', function () {
      const teamPlayScore = teamPlay([5, 7, 7])
      expect(teamPlayScore).to.eq(89)
    })
  })
})
