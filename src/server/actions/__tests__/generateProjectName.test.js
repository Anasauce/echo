/* eslint-env mocha */
/* global testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions, max-nested-callbacks */
import {assert} from 'chai'

import generateProjectName from '../generateProjectName'

describe(testContext(__filename), function () {
  describe('generateProjectName()', function () {
    it('generates a valid project name', function () {
      return generateProjectName().then(function (projectName) {
        assert.match(projectName, /^\w+(-\w+)+(-\d)?$/)
      })
    })
  })
})
