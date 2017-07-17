/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */
import {surveyProgress} from 'src/common/models/survey'

describe(testContext(__filename), function () {
  describe('surveyProgress()', function () {
    it('contains the correct progress info for completed surveys', function () {
      const completedSurvey = {
        id: '641216c8-4bb8-4602-87a9-a6b6124b16fd',
        completedBy: [],
        createdAt: '2016-07-18T15:38:58.959Z',
        updatedAt: '2016-07-18T15:38:58.959Z',
        cycleId: '8c95a5f2-2937-4884-995e-06390ebd3a53',
        projectId: 'ec4b9161-7b3c-49bf-9bd8-30b44a9e554c',
        questions: [
          {
            questionId: '679644be-361f-4ae5-bbf5-1138e5a09d2e',
            subjectIds: ['6a955799-b9a3-4034-944f-32288d8d579c'],
            response: {
              values: [{subjectId: '6a955799-b9a3-4034-944f-32288d8d579c', value: 'response'}]
            },
          },
          {
            questionId: '679644be-361f-4ae5-bbf5-1138e5a09d2e',
            subjectIds: ['a1a2fd2c-b522-4d11-aa71-d2a4d471fdaa'],
            response: {
              values: [{subjectId: 'a1a2fd2c-b522-4d11-aa71-d2a4d471fdaa', value: 'response'}]
            },
          },
          {
            questionId: '679644be-361f-4ae5-bbf5-1138e5a09d2e',
            subjectIds: ['2eb9470b-f176-455b-a925-7a6f984114b4'],
            response: {
              values: [{subjectId: '2eb9470b-f176-455b-a925-7a6f984114b4', value: 'response'}]
            },
          }
        ],
      }

      const result = surveyProgress(completedSurvey)
      expect(result.completed).to.be.true
      expect(result.responseCount).to.eq(3)
    })

    it('returns the correct progress info for incomplete surveys', function () {
      const incompleteSurvey = {
        id: '641216c8-4bb8-4602-87a9-a6b6124b16fd',
        completedBy: [],
        createdAt: '2016-07-18T15:38:58.959Z',
        updatedAt: '2016-07-18T15:38:58.959Z',
        cycleId: '8c95a5f2-2937-4884-995e-06390ebd3a53',
        projectId: 'ec4b9161-7b3c-49bf-9bd8-30b44a9e554c',
        questions: [
          {
            questionId: '679644be-361f-4ae5-bbf5-1138e5a09d2e',
            subjectIds: ['6a955799-b9a3-4034-944f-32288d8d579c'],
            response: {
              values: [{subjectId: '6a955799-b9a3-4034-944f-32288d8d579c', value: 'response'}]
            },
          },
          {
            questionId: '679644be-361f-4ae5-bbf5-1138e5a09d2e',
            subjectIds: ['a1a2fd2c-b522-4d11-aa71-d2a4d471fdaa'],
            response: {
              values: [{subjectId: 'a1a2fd2c-b522-4d11-aa71-d2a4d471fdaa', value: 'response'}]
            },
          },
          {
            questionId: '679644be-361f-4ae5-bbf5-1138e5a09d2e',
            subjectIds: ['2eb9470b-f176-455b-a925-7a6f984114b4'],
            response: {
              values: [],
            }
          }
        ],
      }

      const result = surveyProgress(incompleteSurvey)
      expect(result.completed).to.be.false
      expect(result.responseCount).to.eq(2)
    })

    it('throws an error if the survey is invalid', function () {
      const incompleteSurvey = {
        id: '641216c8-4bb8-4602-87a9-a6b6124b16fd',
        completedBy: [],
        cycleId: '8c95a5f2-2937-4884-995e-06390ebd3a53',
        projectId: 'ec4b9161-7b3c-49bf-9bd8-30b44a9e554c',
        questions: [
          {
            questionId: '679644be-361f-4ae5-bbf5-1138e5a09d2e',
            subjectIds: ['6a955799-b9a3-4034-944f-32288d8d579c'],
            response: {},
          },
        ],
      }

      expect(() => surveyProgress(incompleteSurvey)).to.throw
    })
  })
})
