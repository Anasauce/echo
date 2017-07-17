/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */

import stubs from 'src/test/stubs'

describe(testContext(__filename), function () {
  describe('removeUserFromOrganizations()', function () {
    before(function () {
      this.organizations = ['MyOrg', 'YourOrg']
      this.username = 'my-username'
      stubs.gitHubService.enableOne('removeUserFromOrganization')
    })
    after(function () {
      stubs.gitHubService.disableOne('removeUserFromOrganization')
    })

    it('call removeUserFromOrganization N times', async function () {
      const gitHubService = require('src/server/services/gitHubService')
      await gitHubService.removeUserFromOrganizations(this.username, this.organizations)

      expect(gitHubService.removeUserFromOrganization.callCount).to.eq(this.organizations.length)
      this.organizations.forEach(org => {
        expect(gitHubService.removeUserFromOrganization).to.have.been.calledWith(this.username, org)
      })
    })
  })
})
