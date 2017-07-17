/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */
import factory from 'src/test/factories'
import {resetDB} from 'src/test/helpers'

import getFeedbackTypeByDescriptor from '../getFeedbackTypeByDescriptor'

describe(testContext(__filename), function () {
  beforeEach(resetDB)

  it('returns the correct feedback type', async function () {
    const feedbackTypeDescriptor = 'myDescriptor'
    const feedbackType = await factory.create('feedbackType', {descriptor: feedbackTypeDescriptor})
    const feedbackTypeByDescriptor = await getFeedbackTypeByDescriptor('myDescriptor')
    expect(feedbackTypeByDescriptor.id).to.eq(feedbackType.id)
    expect(feedbackTypeByDescriptor.descriptor).to.eq(feedbackTypeDescriptor)
  })
})
