/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */

import nock from 'nock'

import config from 'src/config'
import stubs from 'src/test/stubs'
import {useFixture} from 'src/test/helpers'

describe(testContext(__filename), function () {
  beforeEach(function () {
    useFixture.nockClean()
    this.apiScope = nock(config.server.chat.baseURL)
    stubs.jobService.enable()
  })
  afterEach(function () {
    stubs.jobService.disable()
  })

  describe('chatService', function () {
    const {createChannel} = require('../index')

    describe('createChannel()', function () {
      beforeEach(function () {
        this.name = 'perfect-penguin'
        this.createChannelResponse = {
          ok: true,
          id: 'BFWXgKacy8e4vjXJL',
          name: this.name,
        }
        this.apiScope
          .post('/api/channels.create')
          .reply(200, this.createChannelResponse)
      })

      it('returns the parsed response on success', function () {
        const result = createChannel(this.name)
        return expect(result).to.eventually.deep.equal(this.createChannelResponse)
      })
    })
  })
})
