/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */
import {
  default as randomMemorableName,
  FILTERED_WORDS,
} from 'src/server/util/randomMemorableName'

describe(testContext(__filename), function () {
  describe('randomMemorableName', function () {
    it('should return a hyphenated name with at least 2 words', function () {
      expect(randomMemorableName()).to.match(/\w+(-\w+)+/)
    })

    it('should not contain any filtered words', function () {
      let i = 0
      function * _nameGenerator() {
        while (i < FILTERED_WORDS.length) {
          const name = `abc-${FILTERED_WORDS[i++]}-xyz`
          yield name
        }
        yield 'safe-name'
      }
      const generateName = () => _nameGenerator().next().value

      expect(randomMemorableName(generateName)).to.equal('safe-name')
    })
  })
})
