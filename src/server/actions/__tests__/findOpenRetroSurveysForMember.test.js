/* eslint-env mocha */
/* global expect testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions, max-nested-callbacks */
import nock from 'nock'

import factory from 'src/test/factories'
import {resetDB, mockIdmUsersById} from 'src/test/helpers'
import {expectArraysToContainTheSameElements} from 'src/test/helpers/expectations'
import {REFLECTION} from 'src/common/models/cycle'

import findOpenRetroSurveysForMember from '../findOpenRetroSurveysForMember'

describe(testContext(__filename), function () {
  beforeEach(resetDB)

  beforeEach(async function () {
    nock.cleanAll()
    this.chapter = await factory.create('chapter')
    this.members = await factory.createMany('member', {chapterId: this.chapter.id}, 3)
    await mockIdmUsersById(this.members.map(p => p.id), null, {times: 100})
  })

  it('throws an error if member identifier is invalid', function () {
    const result = findOpenRetroSurveysForMember('fake.id')
    return expect(result).to.be.rejectedWith(/Member not found/)
  })

  it('returns empty array if member has no active projects (member obj as identifier)', async function () {
    const retroSurveys = await findOpenRetroSurveysForMember(this.members[0])
    expect(retroSurveys.length).to.eq(0)
  })

  it('returns open, unlocked surveys for projects (member ID as identifier)', async function () {
    const chapterId = this.chapter.id
    const memberIds = this.members.map(p => p.id)
    const respondent = this.members[0]

    const cycle = await factory.create('cycle', {chapterId, state: REFLECTION})
    const surveyQuestion = await factory.create('question', {subjectType: 'member', responseType: 'text'})
    const questionRefs = memberIds.map(memberId => ({subjectIds: [memberId], questionId: surveyQuestion.id}))

    const incompleteSurvey = await factory.create('survey', {questionRefs})
    const lockedSurvey = await factory.create('survey', {questionRefs, completedBy: [respondent.id]})
    const unlockedSurvey = await factory.create('survey', {questionRefs, completedBy: [respondent.id], unlockedFor: [respondent.id]})

    const incompleteSurveyProject = await factory.create('project', {
      memberIds,
      chapterId,
      cycleId: cycle.id,
      retrospectiveSurveyId: incompleteSurvey.id,
    })
    const unlockedSurveyProject = await factory.create('project', {
      memberIds,
      chapterId,
      cycleId: cycle.id,
      retrospectiveSurveyId: unlockedSurvey.id,
    })
    await factory.create('project', {
      memberIds,
      chapterId,
      cycleId: cycle.id,
      retrospectiveSurveyId: lockedSurvey.id,
    }) // locked survey project

    await factory.createMany('member', 5) // extra members
    await factory.createMany('project', 5) // extra projects

    const retroSurveys = await findOpenRetroSurveysForMember(respondent)
    const openProjects = [incompleteSurveyProject, unlockedSurveyProject]

    expectArraysToContainTheSameElements(
      retroSurveys.map(s => s.projectId),
      openProjects.map(p => p.id)
    )
  })
})
