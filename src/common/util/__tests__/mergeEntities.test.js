/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */

import mergeEntities from 'src/common/util/mergeEntities'

describe(testContext(__filename), function () {
  before(function () {
    this.original = {
      a: 1,
      b: {
        c: 3,
        d: 4,
      },
    }
  })

  it('returns the original entities unchanged if there are no updates', function () {
    const updated = mergeEntities(this.original)
    expect(updated).to.deep.equal(this.original)
  })

  it('merges each individual object', function () {
    const updated = mergeEntities(this.original, {b: {d: 'four', e: 5}, f: 6})
    expect(updated).to.deep.equal({a: 1, b: {c: 3, d: 'four', e: 5}, f: 6})
  })
})
