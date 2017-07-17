/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */

import config from 'src/config'
import nock from 'nock'
import factory from 'src/test/factories'
import {APIError} from 'src/server/util/api'
import removeCollaboratorFromApp from '../removeCollaboratorFromApp'

describe(testContext(__filename), function () {
  describe('removeCollaboratorFromApp()', function () {
    beforeEach(async function () {
      this.app = 'MyOrg'
      this.user = await factory.build('user')
    })

    it('returns true on success', async function () {
      nock(config.server.heroku.baseURL)
        .delete(`/apps/${this.app}/collaborators/${this.user.email}`)
        .reply(200, {})

      const result = await removeCollaboratorFromApp(this.user, this.app)
      expect(result).to.be.ok
    })

    it('throws an exception on failure', async function () {
      nock(config.server.heroku.baseURL)
        .delete(`/apps/${this.app}/collaborators/${this.user.email}`)
        .reply(400, {error: 'you broke it :('})

      const promise = removeCollaboratorFromApp(this.user, this.app)
      return expect(promise).to.be.rejectedWith(APIError)
    })
  })
})
