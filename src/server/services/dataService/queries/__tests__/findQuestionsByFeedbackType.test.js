/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */
import factory from 'src/test/factories'
import {resetDB} from 'src/test/helpers'

import findQuestionsByFeedbackType from '../findQuestionsByFeedbackType'

describe(testContext(__filename), function () {
  beforeEach(resetDB)
  beforeEach(async function () {
    this.feedbackType1 = await factory.create('feedbackType')
    this.feedbackType2 = await factory.create('feedbackType')

    this.feedbackType1Questions = await factory.createMany('question', {feedbackTypeId: this.feedbackType1.id}, 3)
    this.feedbackType2Questions = await factory.createMany('question', {feedbackTypeId: this.feedbackType2.id}, 3)
    this.noFeedbackTypeQuestions = await factory.create('question')
  })

  it('returns the matching questions', async function () {
    const foundFeedbackType1QuestionIds = await findQuestionsByFeedbackType(this.feedbackType1.descriptor)
    expect(foundFeedbackType1QuestionIds.map(_ => _.id).sort())
      .to.deep.eq(this.feedbackType1Questions.map(_ => _.id).sort())

    const foundFeedbackType2QuestionIds = await findQuestionsByFeedbackType(this.feedbackType2.descriptor)
    expect(foundFeedbackType2QuestionIds.map(_ => _.id).sort())
      .to.deep.eq(this.feedbackType2Questions.map(_ => _.id).sort())
  })
})
