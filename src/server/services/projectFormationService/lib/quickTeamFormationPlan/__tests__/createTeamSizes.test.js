/* eslint-env mocha */
/* global testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions, max-nested-callbacks */
import {assert} from 'chai'

import createTeamSizes from '../createTeamSizes'

describe(testContext(__filename), function () {
  context('createTeamSizes()', function () {
    context('determines optimal team sizes for input', function () {
      const tests = [
        {
          message: 'perfect teams',
          input: {recommended: 4, teamSize: 16},
          expected: [4, 4, 4, 4]
        },

        {
          message: 'rec size + 1',
          input: {recommended: 5, teamSize: 12},
          expected: [6, 6]
        },

        {
          message: 'one team rec + 1',
          input: {recommended: 4, teamSize: 17},
          expected: [5, 4, 4, 4]
        },

        {
          message: 'rec size - 1',
          input: {recommended: 4, teamSize: 15},
          expected: [4, 4, 4, 3]
        },

      ]

      tests.forEach(test => {
        const {recommended, teamSize} = test.input
        const result = createTeamSizes(recommended, teamSize)
        it(test.message, function () {
          assert.deepEqual(result, test.expected, `recommended (${recommended}), teamSize (${teamSize})`)
        })
      })
    })
  })
})
