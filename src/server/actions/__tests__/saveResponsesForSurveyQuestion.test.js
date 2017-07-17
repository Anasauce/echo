/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */

import factory from 'src/test/factories'
import {resetDB, expectArraysToContainTheSameElements} from 'src/test/helpers'
import {Response, Survey} from 'src/server/services/dataService'

import saveResponsesForSurveyQuestion from '../saveResponsesForSurveyQuestion'

describe(testContext(__filename), function () {
  beforeEach(resetDB)

  beforeEach(function () {
    this.buildResponse = async function ({value, subjectId}) {
      const now = new Date()
      const response = await factory.build('response', {
        value,
        subjectId,
        questionId: this.question.id,
        respondentId: this.project.memberIds[0],
        surveyId: this.survey.id,
        createdAt: now,
        updatedAt: now,
      })
      delete response.id
      return response
    }
  })

  describe('single-part subject questions', function () {
    beforeEach(async function () {
      this.project = await factory.create('project')
      this.question = await factory.create('question', {subjectType: 'member', responseType: 'text'})
      this.survey = await Survey.save(await factory.build('survey', {
        questionRefs: [{
          questionId: this.question.id,
          subjectIds: this.project.memberIds,
        }]
      }))
    })

    it('saves the response', async function () {
      const responseToSave = await this.buildResponse({value: 'response value', subjectId: this.project.memberIds[1]})

      const [responseId] = await saveResponsesForSurveyQuestion([responseToSave])

      const savedResponseCount = await Response.count().execute()
      expect(savedResponseCount).to.eq(1)

      const savedResponse = await Response.get(responseId)
      expect(savedResponse).to.have.property('createdAt').and.to.exist
      expect(savedResponse).to.have.property('updatedAt').and.to.exist

      expect(savedResponse).to.have.property('value', 'response value')
      expect(savedResponse).to.have.property('subjectId', this.project.memberIds[1])
    })

    it('overwrites previous responses for the same question + subject + survey + respondent', async function () {
      const responseForSubject1 = await this.buildResponse({value: 'response value', subjectId: this.project.memberIds[1]})
      const responseForSubject2 = await this.buildResponse({value: 'response value', subjectId: this.project.memberIds[2]})

      await saveResponsesForSurveyQuestion([responseForSubject2]) // <- this response should not get overriden

      const [responseId1AfterFirstSave] = await saveResponsesForSurveyQuestion([responseForSubject1]) // <- this one will be
      responseForSubject1.value = 'new value'

      const [responseId1AfterUpdate] = await saveResponsesForSurveyQuestion([responseForSubject1])
      expect(responseId1AfterFirstSave).to.eq(responseId1AfterUpdate)

      const savedResponseCount = await Response.count().execute()
      expect(savedResponseCount).to.eq(2)

      const savedResponse = await Response.get(responseId1AfterFirstSave)
      expect(savedResponse).to.have.property('value', 'new value')
    })
  })

  describe('multi-part subject questions', function () {
    beforeEach(async function () {
      this.project = await factory.create('project')
      this.question = await factory.create('question', {subjectType: 'team', responseType: 'percentage'})
      const survey = await factory.build('survey', {
        questionRefs: [{questionId: this.question.id, subjectIds: this.project.memberIds}]
      })
      this.survey = await Survey.save(survey)

      this.buildResponses = function (values) {
        return Promise.all(
          values.map((value, i) => {
            const subjectId = this.project.memberIds[i]
            return this.buildResponse({value, subjectId})
          })
        )
      }
    })

    it('saves multiple responses for the same question', async function () {
      const responsesToSave = await this.buildResponses([25, 25, 40, 10])

      const responseIds = await saveResponsesForSurveyQuestion(responsesToSave)

      const savedResponseCount = await Response.count().execute()
      expect(savedResponseCount).to.eq(4)

      const savedResponses = await Response.getAll(...responseIds)
      savedResponses.forEach(response => {
        expect(response).to.have.property('createdAt').and.to.exist
        expect(response).to.have.property('updatedAt').and.to.exist
      })
      expectArraysToContainTheSameElements(savedResponses.map(r => r.value), [10, 25, 25, 40])
      expectArraysToContainTheSameElements(savedResponses.map(r => r.subjectId), this.project.memberIds)
    })

    it('overwrites previous responses for the same question', async function () {
      const responsesToSave = await this.buildResponses([25, 25, 40, 10])

      await saveResponsesForSurveyQuestion(responsesToSave)
      await saveResponsesForSurveyQuestion(responsesToSave)

      const savedResponseCount = await Response.count().execute()
      expect(savedResponseCount).to.eq(4)
    })
  })
})
