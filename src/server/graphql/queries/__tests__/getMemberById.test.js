/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */
import factory from 'src/test/factories'
import {resetDB, runGraphQLQuery} from 'src/test/helpers'

import fields from '../index'

describe(testContext(__filename), function () {
  beforeEach(resetDB)

  before(function () {
    this.graphQLQuery = 'query($id: ID!) { getMemberById(id: $id) {id chapter { id }} }'
  })

  it('returns correct member', async function () {
    const member = await factory.create('member')
    const results = await runGraphQLQuery(
      this.graphQLQuery,
      fields,
      {id: member.id}
    )
    expect(results.data.getMemberById.id).to.equal(member.id)
    expect(results.data.getMemberById.chapter.id).to.equal(member.chapterId)
  })

  it('throws an error if no matching user found', function () {
    const promise = runGraphQLQuery(
      this.graphQLQuery,
      fields,
      {id: 'not.a.real.id'}
    )
    return expect(promise).to.eventually.be.rejectedWith(/no such member/i)
  })

  it('throws an error if user is not signed-in', function () {
    const promise = runGraphQLQuery(
      this.graphQLQuery,
      fields,
      {id: 'not.a.real.id'},
      {currentUser: null}
    )
    return expect(promise).to.eventually.be.rejectedWith(/not authorized/i)
  })
})
