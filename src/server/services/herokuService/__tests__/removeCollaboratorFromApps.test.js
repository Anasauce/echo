/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */

import factory from 'src/test/factories'
import stubs from 'src/test/stubs'
import removeCollaboratorFromApps from '../removeCollaboratorFromApps'

describe(testContext(__filename), function () {
  describe('removeCollaboratorFromApps()', function () {
    before(function () {
      this.apps = ['test1', 'test2', 'test3']
      stubs.herokuService.enableOne('removeCollaboratorFromApp')
    })
    after(function () {
      stubs.herokuService.disableOne('removeCollaboratorFromApp')
    })

    it('returns an array containing true for each app removed', async function () {
      const user = await factory.build('user')
      const response = await removeCollaboratorFromApps(user, this.apps)

      expect(response.length).to.eql(3)
      expect(response).to.eql([true, true, true])
    })
  })
})
