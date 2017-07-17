/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions, max-nested-callbacks */
import config from 'src/config'
import stubs from 'src/test/stubs'
import factory from 'src/test/factories'
import {resetDB, useFixture} from 'src/test/helpers'

describe(testContext(__filename), function () {
  beforeEach(resetDB)

  beforeEach(function () {
    stubs.chatService.enable()
  })

  afterEach(function () {
    stubs.chatService.disable()
  })

  describe('processCycleInitialized()', function () {
    const chatService = require('src/server/services/chatService')
    const {Pool} = require('src/server/services/dataService')

    const {processCycleInitialized} = require('../cycleInitialized')

    describe('when a new cycle is created', function () {
      beforeEach(async function () {
        this.phase = await factory.create('phase', {hasVoting: true})
        this.cycle = await factory.create('cycle', {cycleNumber: 2})
        useFixture.nockClean()
        useFixture.nockIDMGetUsersById([], {times: 10})
      })

      it('sends a message to the phase chat channel', async function () {
        await processCycleInitialized(this.cycle)

        expect(chatService.sendChannelMessage.callCount).to.eq(1)

        expect(chatService.sendChannelMessage).to.have.been
          .calledWithMatch(this.phase.channelName, `Voting is now open for cycle ${this.cycle.cycleNumber}`)

        expect(chatService.sendChannelMessage).to.have.been
          .calledWithMatch(this.phase.channelName, `<${config.server.goalLibrary.baseURL}|the goal library>`)

        expect(chatService.sendChannelMessage).to.have.been
          .calledWithMatch(this.phase.channelName, '/vote --help')
      })

      it('will not recreate pools if they already exist', async function () {
        await processCycleInitialized(this.cycle)
        const poolsAfterFirstRun = await Pool.filter({cycleId: this.cycle.id})

        await processCycleInitialized(this.cycle)
        const poolsAfterSecondRun = await Pool.filter({cycleId: this.cycle.id})

        expect(poolsAfterFirstRun.length).to.eq(poolsAfterSecondRun.length)
      })
    })
  })
})
