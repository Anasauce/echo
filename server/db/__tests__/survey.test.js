/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions, max-nested-callbacks */
import r from '../../../db/connect'
import factory from '../../../test/factories'
import {withDBCleanup, useFixture} from '../../../test/helpers'
import {
  getTeamPlayerIds,
  getLatestCycleId,
  setRetrospectiveSurveyForCycle,
} from '../../../server/db/project'
import {PRACTICE} from '../../../common/models/cycle'
import {parseQueryError} from '../../../server/db/errors'

import {
  getFullRetrospectiveSurveyForPlayer,
  getRetrospectiveSurveyForPlayer,
  mergeSurveyStats,
  getSurveyById,
} from '../survey'

describe(testContext(__filename), function () {
  withDBCleanup()
  useFixture.buildSurvey()
  useFixture.buildOneQuestionSurvey()

  describe('mergeSurveyStats()', function () {
    beforeEach(function () {
      return this.buildSurvey()
        // Complete the Survey as the first player
        .then(() =>
          factory.createMany('response', this.survey.questionRefs.map(ref => ({
            subject: ref.subject,
            surveyId: this.survey.id,
            questionId: ref.questionId,
            respondentId: this.teamPlayerIds[0],
            value: 'some value',
          })), this.survey.questionRefs.length)
        )
        .then(responses => {
          this.responses = responses
        })
        // Start, but do not complete the Survey as the second player
        .then(() =>
          factory.createMany('response', this.survey.questionRefs.map(ref => ({
            subject: ref.subject,
            surveyId: this.survey.id,
            questionId: ref.questionId,
            respondentId: this.teamPlayerIds[1],
            value: 'some value',
          })), this.survey.questionRefs.length - 1)
        )
        .then(responses => {
          this.responses = this.responses.concat(responses)
        })
    })

    it('contains progress info', function () {
      return mergeSurveyStats(getSurveyById(this.survey.id))
        .then(result => {
          const completedPlayerProgress = result.progress
            .find(({respondentId}) => respondentId === this.teamPlayerIds[0])
          expect(completedPlayerProgress.completed).to.be.true
          expect(completedPlayerProgress.responseCount).to.eq(this.survey.questionRefs.length)

          const incompletePlayerProgress = result.progress
            .find(({respondentId}) => respondentId === this.teamPlayerIds[1])
          expect(incompletePlayerProgress.completed).to.be.false
          expect(incompletePlayerProgress.responseCount).to.eq(this.survey.questionRefs.length - 1)
        })
    })
  })

  describe('getRetrospectiveSurveyForPlayer()', function () {
    describe('when the player is only on one project', function () {
      beforeEach(function () {
        return this.buildSurvey()
      })

      it('returns the correct survey', function () {
        return expect(
          getRetrospectiveSurveyForPlayer(this.teamPlayerIds[0])
        ).to.eventually.deep.eq(this.survey)
      })
    })

    describe('when the player is on multiple projects', function () {
      beforeEach(async function () {
        const project1 = await factory.create('project')
        const project2 = await factory.create('project', {cycleHistory: project1.cycleHistory})
        this.projects = [project1, project2]
        this.teamPlayerIds = getTeamPlayerIds(project1, getLatestCycleId(project1))

        const question = await factory.create('question')
        this.surveys = await factory.createMany('survey', 2, {
          questionRefs: [{subject: this.teamPlayerIds[0], questionId: question.id}]
        })
        await setRetrospectiveSurveyForCycle(project1.id, getLatestCycleId(project1), this.surveys[0].id)
        await setRetrospectiveSurveyForCycle(project2.id, getLatestCycleId(project2), this.surveys[1].id)
      })

      it('returns the correct survey', async function () {
        expect(
          await getRetrospectiveSurveyForPlayer(this.teamPlayerIds[0], this.projects[0].id)
        ).to.deep.eq(this.surveys[0])
        expect(
          await getRetrospectiveSurveyForPlayer(this.teamPlayerIds[0], this.projects[1].id)
        ).to.deep.eq(this.surveys[1])
      })

      it('raises an error if no projectId provided', function () {
        return expect(
          getRetrospectiveSurveyForPlayer(this.teamPlayerIds[0])
        ).to.be.rejectedWith('player is in multiple projects')
      })
    })
  })

  describe('getFullRetrospectiveSurveyForPlayer()', function () {
    describe('with no responses', function () {
      beforeEach(function () {
        return this.buildSurvey()
      })

      it('adds a questions array with subjects and responseIntructions', function () {
        return getFullRetrospectiveSurveyForPlayer(this.teamPlayerIds[0])
          .then(result => {
            expect(result).to.have.property('questions').with.length(this.survey.questionRefs.length)
            result.questions.forEach(question => expect(question).to.have.property('subject'))
            result.questions.forEach(question => expect(question).to.have.property('responseIntructions'))
          })
      })
    })

    describe('when a question has a response', function () {
      beforeEach(function () {
        return this.buildOneQuestionSurvey({
          questionAttrs: {subjectType: 'player', responseType: 'text'},
          subject: () => this.teamPlayerIds[0]
        })
        .then(() =>
          factory.create('response', {
            subject: this.teamPlayerIds[0],
            surveyId: this.survey.id,
            questionId: this.survey.questionRefs[0].questionId,
            respondentId: this.teamPlayerIds[0],
            value: 'some value',
          })
        ).then(response => {
          this.response = response
        })
      })

      it('includes the response', function () {
        return getFullRetrospectiveSurveyForPlayer(this.teamPlayerIds[0])
          .then(result => {
            expect(result.questions[0]).to.have.property('response')
              .and.to.have.property('id', this.response.id)
          })
      })
    })

    describe('when a multipart subject question has no responses', function () {
      beforeEach(function () {
        return this.buildOneQuestionSurvey({
          questionAttrs: {subjectType: 'team'},
          subject: () => this.teamPlayerIds
        })
      })

      it('sets response to null, not an empty array', function () {
        return getFullRetrospectiveSurveyForPlayer(this.teamPlayerIds[0])
          .then(result => {
            expect(result.questions[0].response).to.be.null
          })
      })
    })

    describe('when a question has multiple responses', function () {
      beforeEach(function () {
        return this.buildOneQuestionSurvey({
          questionAttrs: {subjectType: 'team'},
          subject: () => this.teamPlayerIds
        })
        .then(() =>
          factory.createMany('response', this.teamPlayerIds.map(subject => ({
            subject,
            surveyId: this.survey.id,
            questionId: this.survey.questionRefs[0].questionId,
            respondentId: this.teamPlayerIds[0],
            value: 'some value',
          })), 2))
        .then(responses => {
          this.responses = responses
        })
      })

      it('includes all response parts', function () {
        return getFullRetrospectiveSurveyForPlayer(this.teamPlayerIds[0])
          .then(result => {
            expect(result.questions[0].response).to.deep.eq(this.responses)
          })
      })
    })

    describe('when no reflection cycle exists', function () {
      beforeEach(function () {
        return this.buildSurvey().then(() =>
          r.table('cycles').get(this.cycleId).update({state: PRACTICE})
        )
      })

      it('rejects the promise with an appropriate error', function () {
        return expect(
          getFullRetrospectiveSurveyForPlayer(this.teamPlayerIds[0])
            .catch(e => parseQueryError(e))
        ).to.eventually
         .have.property('message')
         .and
         .match(/no cycle in the reflection state/i)
      })
    })

    describe('when no project exists', function () {
      beforeEach(function () {
        return this.buildSurvey().then(() =>
          r.table('projects').get(this.project.id).delete()
        )
      })

      it('rejects the promise with an appropriate error', function () {
        return expect(
          getFullRetrospectiveSurveyForPlayer(this.teamPlayerIds[0])
            .catch(e => parseQueryError(e))
        ).to.eventually
         .have.property('message')
         .and
         .match(/player is not in any projects/i)
      })
    })

    describe('when no survey exists', function () {
      beforeEach(function () {
        return this.buildSurvey().then(() =>
          r.table('surveys').get(this.survey.id).delete()
        )
      })

      it('rejects the promise with an appropriate error', function () {
        return expect(
          getFullRetrospectiveSurveyForPlayer(this.teamPlayerIds[0])
            .catch(e => parseQueryError(e))
        ).to.eventually
         .have.property('message')
         .and
         .match(/no retrospective survey/i)
      })
    })
  })
})
