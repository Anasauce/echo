/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions, max-nested-callbacks */
import factory from 'src/test/factories'
import {resetDB, useFixture} from 'src/test/helpers'
import {Survey} from 'src/server/services/dataService'

import handleSubmitSurvey from '../handleSubmitSurvey'

describe(testContext(__filename), function () {
  useFixture.buildOneQuestionSurvey()

  beforeEach(resetDB)

  beforeEach('setup test data', async function () {
    await this.buildOneQuestionSurvey({
      questionAttrs: {responseType: 'text', subjectType: 'member'},
      subjectIds: () => [this.project.memberIds[1]]
    })
  })

  describe('when the survey has been completed', function () {
    beforeEach(function () {
      return factory.create('response', {
        questionId: this.survey.questionRefs[0].questionId,
        surveyId: this.survey.id,
        subjectId: this.project.memberIds[1],
        respondentId: this.project.memberIds[0],
        value: 'value',
      })
    })

    it('marks the survey as completed and locked by the respondent', async function () {
      const respondentId = this.project.memberIds[0]
      await handleSubmitSurvey(this.survey.id, respondentId)
      const survey = await Survey.get(this.survey.id)
      expect(survey.completedBy.includes(respondentId)).to.eq(true)
      expect(survey.unlockedFor.includes(respondentId)).to.eq(false)
    })

    it('processes then re-locks the survey when UNLOCKED and resubmitted', async function () {
      const respondentId = this.project.memberIds[0]
      await handleSubmitSurvey(this.survey.id, respondentId)
      const lockedSurvey = await Survey.get(this.survey.id)
      const unlockedFor = (lockedSurvey.unlockedFor || [])
      unlockedFor.push(respondentId)
      await Survey.get(this.survey.id).updateWithTimestamp({unlockedFor})
      await handleSubmitSurvey(this.survey.id, respondentId)
      const survey = await Survey.get(this.survey.id)
      expect(survey.completedBy.includes(respondentId)).to.eq(true)
      expect(survey.unlockedFor.includes(respondentId)).to.eq(false)
    })

    it('throws an error when the survey is LOCKED and resubmitted', async function () {
      const respondentId = this.project.memberIds[0]
      await handleSubmitSurvey(this.survey.id, respondentId)
      return expect(
        handleSubmitSurvey(this.survey.id, this.project.memberIds[0])
      ).to.be.rejectedWith(/Survey has already been submitted and is locked/)
    })
  })

  describe('when the survey has NOT been completed', function () {
    it('throws an error', async function () {
      return expect(
        handleSubmitSurvey(this.survey.id, this.project.memberIds[0])
      ).to.be.rejectedWith(/Missing survey responses/)
    })
  })
})
