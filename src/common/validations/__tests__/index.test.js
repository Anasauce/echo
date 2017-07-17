/* eslint-env mocha */
/* global testContext */
/* eslint-disable prefer-arrow-callback */
import {assert} from 'chai'

import {
  validateText,
  validateNumber,
  validateNumberGroup,
} from '../index'

describe(testContext(__filename), function () {
  describe('validateText', function () {
    it('returns undefined for valid string', function () {
      assert.isUndefined(validateText('blergh'))
    })

    it('returns undefined for valid string with options', function () {
      assert.isUndefined(validateText('bb', {required: true, min: 1, max: 10}))
    })

    it('returns an error if required but missing', function () {
      const result = validateText(null, {required: true})
      assert.match(result, /can't be blank/)
    })

    it('returns an error if not correct length', function () {
      const result = validateText('oops', {length: 5})
      assert.match(result, /^is the wrong length/)
    })

    it('returns an error if too short', function () {
      const result = validateText('oops', {min: 5})
      assert.match(result, /is too short/)
    })

    it('returns an error if too long', function () {
      const result = validateText('oooooooops', {max: 5})
      assert.match(result, /is too long/)
    })
  })

  describe('validateNumber', function () {
    it('returns undefined for valid number', function () {
      assert.isUndefined(validateNumber(5))
    })

    it('returns undefined for valid string with options', function () {
      assert.isUndefined(validateNumber(5, {required: true, min: 4, max: 6}))
    })

    it('returns an error if required but missing', function () {
      const result = validateNumber(null, {required: true})
      assert.match(result, /can't be blank/)
    })

    it('returns an error if too small', function () {
      const result = validateNumber(3, {min: 5})
      assert.match(result, /must be greater than or equal to 5/)
    })

    it('returns an error if too great', function () {
      const result = validateNumber(100, {max: 5})
      assert.match(result, /must be less than or equal to 5/)
    })

    it('returns an error if integer required but not an integer', function () {
      const result = validateNumber(1.3, {integer: true})
      assert.match(result, /must be an integer/)
    })
  })

  describe('validateNumberGroup', function () {
    it('returns undefined for valid number group', function () {
      assert.isUndefined(validateNumberGroup([0, 0, 4]))
    })

    it('returns undefined for valid number group with options', function () {
      assert.isUndefined(validateNumberGroup([33, 33, 34], {sum: 100}))
    })

    it('returns an error if required but missing', function () {
      const result = validateNumberGroup(null, {required: true})
      assert.match(result, /can't be blank/)
    })

    it('returns an error if not equal to specified sum', function () {
      const result = validateNumberGroup([32, 10, 12], {sum: 100})
      assert.match(result, /sum must be equal to 100/)
    })
  })
})
