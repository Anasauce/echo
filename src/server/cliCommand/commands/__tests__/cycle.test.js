/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */
import factory from 'src/test/factories'
import {resetDB, useFixture} from 'src/test/helpers'
import {GOAL_SELECTION, PRACTICE, REFLECTION} from 'src/common/models/cycle'
import {Cycle} from 'src/server/services/dataService/models'

import {getCommand} from 'src/server/cliCommand/util'

import {concatResults} from './helpers'

describe(testContext(__filename), function () {
  useFixture.ensureNoGlobalWindow()

  beforeEach(resetDB)

  beforeEach('create moderator', async function () {
    const {commandSpec, commandImpl} = getCommand('cycle')
    this.commandSpec = commandSpec
    this.commandImpl = commandImpl
    this.moderatorUser = await factory.build('user', {roles: ['admin']})
    this.moderator = await factory.create('moderator', {id: this.moderatorUser.id})
  })

  describe('cycle init', function () {
    beforeEach(async function () {
      this.cycle = await factory.create('cycle', {chapterId: this.moderator.chapterId, state: REFLECTION})
    })

    beforeEach(async function () {
      useFixture.nockClean()
      this.args = this.commandSpec.parse(['init', '32'])
      useFixture.nockIDMGetUser(this.moderatorUser)
    })

    it('throws an LGBadRequestError if the current cycle is still in PRACTICE', async function () {
      this.cycle = await Cycle.get(this.cycle.id).update({state: PRACTICE})
      const promise = this.commandImpl.invoke(this.args, {user: this.moderatorUser})
      return expect(promise).to.be.rejectedWith(/Failed to initialize a new cycle because the current cycle is still in progress./)
    })

    it('returns an Initializing message on success', async function () {
      const result = await this.commandImpl.invoke(this.args, {user: this.moderatorUser})
      expect(concatResults(result)).to.match(/Initializing/i)
    })
  })

  describe('cycle launch', function () {
    beforeEach(async function () {
      this.cycle = await factory.create('cycle', {chapterId: this.moderator.chapterId, state: GOAL_SELECTION})
    })

    it('returns a "Launch" message on success', async function () {
      const args = this.commandSpec.parse(['launch'])
      const result = await this.commandImpl.invoke(args, {user: this.moderatorUser})
      expect(concatResults(result)).to.match(/Launch/)
    })
  })

  describe('cycle reflect', function () {
    beforeEach(async function () {
      this.cycle = await factory.create('cycle', {chapterId: this.moderator.chapterId, state: PRACTICE})
    })

    it('returns a "Reflection" message on success', async function () {
      const args = this.commandSpec.parse(['reflect'])
      const result = await this.commandImpl.invoke(args, {user: this.moderatorUser})
      expect(concatResults(result)).to.match(/Reflection/)
    })
  })
})
