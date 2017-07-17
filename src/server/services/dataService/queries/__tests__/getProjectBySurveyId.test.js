/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions, max-nested-callbacks */
import {resetDB} from 'src/test/helpers'
import factory from 'src/test/factories'

import r from '../../r'
import getProjectBySurveyId from '../getProjectBySurveyId'

describe(testContext(__filename), function () {
  beforeEach(resetDB)

  it('finds the right project for a given retrospectiveSurveyId', async function () {
    const [otherProject, targetProject] = await factory.createMany('project', 2)
    const [otherSurvey, targetSurvey] = await factory.createMany('survey', 2)

    await r.table('projects').get(targetProject.id).update({retrospectiveSurveyId: targetSurvey.id})
    await r.table('projects').get(otherProject.id).update({retrospectiveSurveyId: otherSurvey.id})

    const returnedProject = await getProjectBySurveyId(targetSurvey.id)
    expect(returnedProject.id).to.eq(targetProject.id)
  })
})
