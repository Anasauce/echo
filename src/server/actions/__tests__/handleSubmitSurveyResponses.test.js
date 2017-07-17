/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback */
import {resetDB, useFixture} from 'src/test/helpers'
import factory from 'src/test/factories'
import {Response} from 'src/server/services/dataService'

import handleSubmitSurveyResponses from '../handleSubmitSurveyResponses'

describe(testContext(__filename), function () {
  useFixture.buildSurvey()

  beforeEach(resetDB)

  beforeEach(async function () {
    await this.buildSurvey()
    const respondentId = this.project.memberIds[0]
    this.currentUser = await factory.build('user', {id: respondentId})
    this.response = {
      respondentId,
      surveyId: this.survey.id,
      questionId: this.surveyQuestion.id,
      values: [{
        subjectId: this.survey.questionRefs[0].subjectIds[0],
        value: 'response'
      }]
    }
  })

  it('saves a response', async function () {
    const {createdIds: [savedResponseId]} = await handleSubmitSurveyResponses([this.response])
    const response = await Response.get(savedResponseId)
    return expect(response).to.exist
  })

  it('returns a rejected promise if responses are invalid', async function () {
    await expect(
      handleSubmitSurveyResponses([])
    ).to.be.rejectedWith(/must be a non-empty array/)
  })
})
