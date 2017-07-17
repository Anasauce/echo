/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions, max-nested-callbacks */

import factory from 'src/test/factories'
import {resetDB} from 'src/test/helpers'

import getUserById from '../getUserById'

describe(testContext(__filename), function () {
  beforeEach(resetDB)

  it('returns a member if present', async function () {
    const member = await factory.create('member')
    const user = await getUserById(member.id)
    expect(user.id).to.eq(member.id)
  })

  it('returns a moderator if present', async function () {
    const moderator = await factory.create('moderator')
    const user = await getUserById(moderator.id)
    expect(user.id).to.eq(moderator.id)
  })

  it('returns null when no user or moderator with the given id', async function () {
    const validUUID = 'e79fd771-6f19-4b35-bfa1-57a1174964f1'
    expect(await getUserById(validUUID)).to.be.null
  })
})
