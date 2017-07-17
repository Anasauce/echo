/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */

import nock from 'nock'

import config from 'src/config'
import getGoalInfo from '../getGoalInfo'

describe(testContext(__filename), function () {
  describe('getGoalInfo()', function () {
    before(function () {
      this.goalNumber = 144
      this.goalAPIPath = `/api/goals/${this.goalNumber}.json`
      this.goalAPIURL = `${config.server.goalLibrary.baseURL}${this.goalAPIPath}`
      this.goalURL = `${config.server.goalLibrary.baseURL}/goals/${this.goalNumber}-15_Coding_Exercises.html`
    })

    it('throws an error if unsuccessful', function () {
      nock(config.server.goalLibrary.baseURL)
        .get(this.goalAPIPath)
        .reply(500, 'Internal Server Error')

      expect(getGoalInfo(this.goalNumber)).to.be.rejected
    })

    it('returns null if there is no such goal', async function () {
      nock(config.server.goalLibrary.baseURL)
        .get(this.goalAPIPath)
        .reply(404, 'Not Found')

      const goalInfo = await getGoalInfo(this.goalURL)

      expect(goalInfo).to.equal(null)
    })

    it('returns the correct goal info if it is found', async function () {
      /* eslint-disable camelcase */
      const mockGoalMetadata = {
        goal_id: this.goalNumber,
        team_size: 1,
        phase: 2,
        url: this.goalURL,
        title: '15 Coding Exercises',
        labels: ['foundational'],
        dynamic: false,
      }
      const mockGoalInfo = {
        number: mockGoalMetadata.goal_id,
        url: mockGoalMetadata.url,
        title: mockGoalMetadata.title,
        teamSize: mockGoalMetadata.team_size,
        phase: mockGoalMetadata.phase,
        dynamic: false,
        goalMetadata: mockGoalMetadata,
      }
      /* eslint-enable camelcase */
      nock(config.server.goalLibrary.baseURL)
        .get(this.goalAPIPath)
        .reply(200, mockGoalMetadata)

      const goalInfo = await getGoalInfo(this.goalURL)

      expect(goalInfo).to.deep.equal(mockGoalInfo)
    })
  })
})
