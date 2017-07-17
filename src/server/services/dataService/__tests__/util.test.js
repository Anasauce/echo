/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */
import r from '../r'
import {isRethinkDBTerm} from '../util'

describe(testContext(__filename), function () {
  describe('isRethinkDBTerm()', function () {
    const terms = [
      ['row attribute', r.row('a')],
      ['query object', r.object('key', 'val')],
      ['branch', r.branch(r.row('a').eq(r.row('b')), 1, 2)],
      ['table', r.table('foo')],
      ['single-result query', r.table('key').get(1)],
      ['sequence query', r.table('key').filter({a: 1})],
    ]

    terms.forEach(([label, term]) => {
      it(`returns true for rethinkdb terms - ${label}`, function () {
        expect(isRethinkDBTerm(term)).to.be.true
      })
    })

    const nonTerms = [
      ['object', {a: 1}],
      ['function', function () {}],
      ['function with run method', (() => {
        const func = function () {}
        func.run = function () {}
        return func
      })()],
      ['array', []],
      ['string', 'some text'],
      ['number', 1]
    ]

    nonTerms.forEach(([label, term]) => {
      it(`returns false for non-rethinkdb terms - ${label}`, function () {
        expect(isRethinkDBTerm(term)).to.be.false
      })
    })
  })
})
