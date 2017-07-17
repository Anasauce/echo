/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */

import nock from 'nock'

import config from 'src/config'
import {APIError} from 'src/server/util/api'
import removeUserFromOrganization from '../removeUserFromOrganization'

describe(testContext(__filename), function () {
  describe('removeUserFromOrganization()', function () {
    before(function () {
      this.organization = 'MyOrg'
      this.username = 'my-username'
    })

    it('returns true on success', async function () {
      nock(config.server.github.baseURL)
        .delete(`/orgs/${this.organization}/members/${this.username}`)
        .reply(204)

      const result = await removeUserFromOrganization(this.username, this.organization)

      expect(result).to.be.ok
    })

    it('throws an exception on failure', function () {
      nock(config.server.github.baseURL)
        .delete(`/orgs/${this.organization}/members/${this.username}`)
        .reply(400, {error: 'y-u-no-work'})

      const promise = removeUserFromOrganization(this.username, this.organization)
      return expect(promise).to.be.rejectedWith(APIError)
    })
  })
})
