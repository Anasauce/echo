/* eslint-env mocha */
/* global expect, assert, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions, max-nested-callbacks */
import nock from 'nock'

import config from 'src/config'
import factory from 'src/test/factories'
import {useFixture, resetDB} from 'src/test/helpers'
import {getUserById} from 'src/server/services/dataService'

import {processUserCreated} from '../userCreated'

describe(testContext(__filename), function () {
  beforeEach(resetDB)

  describe('processUserCreated', function () {
    describe('when there is a new user', function () {
      beforeEach(async function () {
        this.chapter = await factory.create('chapter', {
          inviteCodes: ['test']
        })
        this.cycle = await factory.create('cycle', {
          chapterId: this.chapter.id,
          cycleNumber: 3,
        })
        this.user = await factory.build('user')
        this.nockGitHub = (user, replyCallback = () => ({})) => {
          useFixture.nockClean()
          nock(config.server.github.baseURL)
            .persist()
            .put(`/teams/${this.chapter.githubTeamId}/memberships/${user.handle}`)
            .reply(200, replyCallback)
        }
      })

      describe('creates a new player', function () {
        it('initializes the player', async function () {
          this.nockGitHub(this.user)
          await processUserCreated(this.user)
        })

        it('adds the player to the github team', async function () {
          const replyCallback = arg => {
            expect(arg).to.eql(`/teams/${this.chapter.githubTeamId}/memberships/${this.user.handle}`)
            return JSON.stringify({})
          }
          this.nockGitHub(this.user, replyCallback)
          await processUserCreated(this.user)
        })

        it('inserts the new player into the database', async function () {
          this.nockGitHub(this.user)
          await processUserCreated(this.user)
          const user = await getUserById(this.user.id)

          expect(user).to.not.be.null
        })

        it('does not replace the given player if their account already exists', async function () {
          this.nockGitHub(this.user)
          await processUserCreated(this.user)
          const oldUser = await getUserById(this.user.id)

          assert.doesNotThrow(async function () {
            await processUserCreated(this.user)
          }, Error)

          await processUserCreated({...this.user, name: 'new name'})
          const updatedUser = await getUserById(this.user.id)

          expect(updatedUser.createdAt).to.eql(oldUser.createdAt)
        })
      })
    })
  })
})
