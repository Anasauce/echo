/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions, max-nested-callbacks */
import {stub} from 'sinon'

import stubs from 'src/test/stubs'
import factory from 'src/test/factories'
import {resetDB, mockIdmUsersById, useFixture} from 'src/test/helpers'

describe(testContext(__filename), function () {
  beforeEach(resetDB)

  beforeEach(function () {
    stubs.chatService.enable()
  })

  afterEach(function () {
    stubs.chatService.disable()
  })

  describe('initializeProject()', function () {
    const chatService = require('src/server/services/chatService')
    const initializeProject = require('../initializeProject')

    describe('for voting goals', function () {
      beforeEach('setup data & mocks', async function () {
        useFixture.nockClean()
        this.phase = await factory.create('phase', {hasVoting: true})
        this.project = await factory.create('project', {phaseId: this.phase.id})
        this.users = await mockIdmUsersById(this.project.memberIds)
      })

      describe('when there is no goal channel', function () {
        it('creates the goal channel', async function () {
          const memberHandles = this.users.map(u => u.handle)
          await initializeProject(this.project)
          expect(chatService.createChannel).to.have.been.calledWith(String(this.project.goal.number))
          expect(chatService.setChannelTopic).to.have.been.calledWith(String(this.project.goal.number), `${this.project.goal.title} (${this.project.goal.url})`)
          expect(chatService.inviteToChannel).to.have.been.calledWith(String(this.project.goal.number), memberHandles)
          expect(chatService.sendDirectMessage).to.have.been.calledWithMatch(memberHandles, /Your goal is/)
        })
      })

      describe('when the channel is not found when setting topic', function () {
        beforeEach('alter the setChannelTopic stub', async function () {
          useFixture.nockChatServiceCache([this.project.goal.number])
          chatService.setChannelTopic.restore()
          stub(chatService, 'setChannelTopic', () => {
            throw new Error('channel_not_found')
          })
        })

        it('attempts to set the topic a 2nd time', async function () {
          try {
            await initializeProject(this.project)
          } catch (err) {
            expect(chatService.createChannel.callCount).to.eq(1)
            expect(chatService.setChannelTopic.callCount).to.eq(2)
            expect(chatService.inviteToChannel.callCount).to.eq(0)
          }
        })
      })

      describe('when there is already a goal channel', function () {
        beforeEach('alter the createChannel stub', async function () {
          useFixture.nockChatServiceCache([this.project.goal.number])
          chatService.createChannel.restore()
          stub(chatService, 'createChannel', () => {
            throw new Error('name_taken')
          })
        })

        it('adds the new project\'s members to the goal channel', async function () {
          await initializeProject(this.project)

          useFixture.nockClean()
          const secondTeamProject = await factory.create('project', {goal: this.project.goal, phaseId: this.phase.id})
          const secondTeamUsers = await mockIdmUsersById(secondTeamProject.memberIds)
          const secondTeamHandles = secondTeamUsers.map(u => u.handle)

          await initializeProject(secondTeamProject)

          expect(chatService.inviteToChannel.callCount).to.eq(2)
          expect(chatService.inviteToChannel).to.have.been.calledWith(String(secondTeamProject.goal.number), secondTeamHandles)

          expect(chatService.sendDirectMessage.callCount).to.eq(2)
          expect(chatService.sendDirectMessage).to.have.been.calledWithMatch(secondTeamHandles, /Your goal is/)
        })
      })
    })

    describe('for non-voting goals', function () {
      beforeEach('setup data & mocks', async function () {
        useFixture.nockClean()
        this.phase = await factory.create('phase', {hasVoting: false})
        this.project = await factory.create('project', {phaseId: this.phase.id})
        this.users = await mockIdmUsersById(this.project.memberIds)
      })

      it('sends the phase project welcome message', async function () {
        const memberHandles = this.users.map(u => u.handle)
        await initializeProject(this.project)
        expect(chatService.sendDirectMessage).to.have.been.calledWithMatch(memberHandles, /You're in Phase/)
      })

      it('should not create a goal channel', async function () {
        await initializeProject(this.project)
        expect(chatService.createChannel.callCount).to.eq(0)
        expect(chatService.inviteToChannel.callCount).to.eq(0)
      })
    })
  })
})
