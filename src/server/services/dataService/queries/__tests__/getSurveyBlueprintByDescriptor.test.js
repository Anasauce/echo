/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */
import factory from 'src/test/factories'
import {resetDB} from 'src/test/helpers'

import getSurveyBlueprintByDescriptor from '../getSurveyBlueprintByDescriptor'

describe(testContext(__filename), function () {
  beforeEach(resetDB)

  it('returns the correct surveyBlueprint', async function () {
    const descriptor = 'myDescriptor'
    const surveyBlueprint = await factory.create('surveyBlueprint', {descriptor})
    const surveyBlueprintByDescriptor = await getSurveyBlueprintByDescriptor(surveyBlueprint.descriptor)
    expect(surveyBlueprintByDescriptor.id).to.eq(surveyBlueprint.id)
    expect(surveyBlueprintByDescriptor.descriptor).to.eq(surveyBlueprint.descriptor)
  })
})
