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
    await this.buildSurvey()
    this.user = await factory.build('user', {id: this.project.memberIds[0]})
    this.respondentId = this.project.memberIds[0]

    this.invokeAPI = function () {
      const responses = this.project.memberIds.slice(1).map(memberId => ({
        values: [{subjectId: memberId, value: 'foo'}],
        questionId: this.surveyQuestion.id,
        surveyId: this.survey.id,
        respondentId: this.respondentId,
      }))
      return runGraphQLMutation(
        `mutation($responses: [SurveyResponseInput]!) {
          saveRetrospectiveSurveyResponses(responses: $responses) {
            createdIds
          }
        }`,
        fields,
        {responses},
        {currentUser: this.user},
      )
    }
  })

  it('returns new response ids for all responses created in REFLECTION state', function () {
    return this.invokeAPI()
      .then(result => result.data.saveRetrospectiveSurveyResponses.createdIds)
      .then(createdIds => expect(createdIds).have.length(this.project.memberIds.length - 1))
  })

  it('returns new response ids for all responses created in COMPLETE state', async function () {
    await Cycle.get(this.cycleId).updateWithTimestamp({state: COMPLETE})
    return this.invokeAPI()
      .then(result => result.data.saveRetrospectiveSurveyResponses.createdIds)
      .then(createdIds => expect(createdIds).have.length(this.project.memberIds.length - 1))
  })

  it('returns an error when in PRACTICE state', async function () {
    await Cycle.get(this.cycleId).updateWithTimestamp({state: PRACTICE})
    return expect(this.invokeAPI())
      .to.be.rejectedWith(/cycle is in the PRACTICE state/)
  })
})
