/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback */
import {resetDB, useFixture} from 'src/test/helpers'
import factory from 'src/test/factories'
import {Response} from 'src/server/services/dataService'

import {resolveSaveRetrospectiveSurveyResponses} from '../index'

describe(testContext(__filename), function () {
  useFixture.buildSurvey()

  beforeEach(resetDB)

  beforeEach(async function () {
    await this.buildSurvey()
    const memberId = this.project.memberIds[0]
    this.currentUser = await factory.build('user', {id: memberId})
    this.ast = {rootValue: {currentUser: this.currentUser}}
  })

  it('saves a response', async function () {
    const args = _buildArgsWithResponse(this)
    const {createdIds: [returnedResponseId]} = await resolveSaveRetrospectiveSurveyResponses(null, args, this.ast)

    const response = await Response.get(returnedResponseId)
    return expect(response).to.exist
  })

  it('returns a rejected promise if a member tries to save responses for another member', async function () {
    const otherMemberId = this.project.memberIds[1]
    const args = _buildArgsWithResponse(this, {respondentId: otherMemberId})

    await expect(
      resolveSaveRetrospectiveSurveyResponses(null, args, this.ast)
    ).to.be.rejectedWith(/You cannot submit responses for other members/)
  })

  it('returns a rejected promise if the user does not have the correct role', async function () {
    this.currentUser.roles = ['notTheRightRole']
    const args = _buildArgsWithResponse(this)

    await expect(
      resolveSaveRetrospectiveSurveyResponses(null, args, this.ast)
    ).to.be.rejectedWith(/not authorized/)
  })
})

function _buildArgsWithResponse(test, responseOverrides) {
  return {
    responses: [
      {
        surveyId: test.survey.id,
        questionId: test.surveyQuestion.id,
        respondentId: test.currentUser.id,
        values: [{subjectId: test.survey.questionRefs[0].subjectIds[0], value: 'response'}],
        ...responseOverrides
      }
    ],
    projectName: test.project.name
  }
}
