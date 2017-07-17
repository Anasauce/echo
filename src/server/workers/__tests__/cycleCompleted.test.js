/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions, max-nested-callbacks */
import stubs from 'src/test/stubs'
import factory from 'src/test/factories'
import {resetDB} from 'src/test/helpers'

describe(testContext(__filename), function () {
  beforeEach(resetDB)

  beforeEach(function () {
    stubs.chatService.enable()
  })

  afterEach(function () {
    stubs.chatService.disable()
  })

  describe('processCycleCompleted()', function () {
    const chatService = require('src/server/services/chatService')

    const {processCycleCompleted} = require('../cycleCompleted')

    describe('when a cycle has completed', function () {
      beforeEach(async function () {
        this.phase = await factory.create('phase', {hasVoting: true})
        this.cycle = await factory.create('cycle', {cycleNumber: 3})
      })

      it('sends a message to the chapter chatroom', async function () {
        await processCycleCompleted(this.cycle)
        expect(chatService.sendChannelMessage).to.have.been
          .calledWithMatch(this.phase.channelName, `Cycle ${this.cycle.cycleNumber} is complete`)
      })
    })
  })
})
