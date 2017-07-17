/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */
import factory from 'src/test/factories'
import {resetDB, runGraphQLMutation, useFixture} from 'src/test/helpers'
import {Cycle} from 'src/server/services/dataService'
import {COMPLETE, PRACTICE} from 'src/common/models/cycle'

import fields from '../index'

describe(testContext(__filename), function () {
  useFixture.buildOneQuestionSurvey()
  useFixture.buildSurvey()

  beforeEach(resetDB)

  beforeEach(async function () {
    await this.buildOneQuestionSurvey({
      questionAttrs: {subjectType: 'team', type: 'relativeContribution'},
      subjectIds: () => this.project.memberIds
    })
    this.user = await factory.build('user', {id: this.project.memberIds[0]})
    this.respondentId = this.project.memberIds[0]
    this.subjectId = this.project.memberIds[1]

    this.invokeAPI = function (rccScores) {
      const teamSize = this.project.memberIds.length
      rccScores = rccScores || Array(teamSize).fill(100 / teamSize)
      const values = rccScores.map((value, i) => (
        {subjectId: this.project.memberIds[i], value}
      ))

      const response = {
        values,
        questionId: this.question.id,
        surveyId: this.survey.id,
        respondentId: this.respondentId,
      }
      return runGraphQLMutation(
        `mutation($response: SurveyResponseInput!) {
          saveRetrospectiveSurveyResponse(response: $response) {
            createdIds
          }
        }`,
        fields,
        {response},
        {currentUser: this.user},
      )
    }
  })

  it('returns new response ids for all responses created in REFLECTION state', function () {
    return this.invokeAPI()
      .then(result => result.data.saveRetrospectiveSurveyResponse.createdIds)
      .then(createdIds => expect(createdIds).have.length(this.project.memberIds.length))
  })

  it('returns new response ids for all responses created in COMPLETE state', async function () {
    await Cycle.get(this.cycleId).updateWithTimestamp({state: COMPLETE})
    return this.invokeAPI()
      .then(result => result.data.saveRetrospectiveSurveyResponse.createdIds)
      .then(createdIds => expect(createdIds).have.length(this.project.memberIds.length))
  })

  it('returns error message when missing parts', function () {
    return expect(
      this.invokeAPI(Array(2).fill(50))
    ).to.be.rejectedWith('Failed to save responses')
  })

  it('returns helpful error messages for invalid values', function () {
    return expect(
      this.invokeAPI(Array(this.project.memberIds.length).fill(101))
    ).to.be.rejectedWith(/must be less than or equal to 100/)
  })

  it('returns an error when the cycle is in PRACTICE state', async function () {
    await Cycle.get(this.cycleId).updateWithTimestamp({state: PRACTICE})
    return expect(this.invokeAPI())
      .to.be.rejectedWith(/cycle is in the PRACTICE state/)
  })
})
