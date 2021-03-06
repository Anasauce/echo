/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions, max-nested-callbacks */
import Promise from 'bluebird'
import {RETROSPECTIVE_DESCRIPTOR} from 'src/common/models/surveyBlueprint'
import {Project, Survey} from 'src/server/services/dataService'
import {resetDB, expectSetEquality} from 'src/test/helpers'
import factory from 'src/test/factories'

import {
  ensureRetrospectiveSurveysExist,
} from '../ensureCycleReflectionSurveysExist'

describe(testContext(__filename), function () {
  beforeEach(resetDB)

  describe('ensureRetrospectiveSurveysExist', function () {
    beforeEach(async function () {
      this.cycle = await factory.create('cycle')
      this.createPlayersAndProjects = async numPlayersPerProject => {
        const numProjects = Math.min(numPlayersPerProject, 2)
        const numPlayersTotal = numProjects * numPlayersPerProject
        this.phase = await factory.create('phase', {hasRetrospective: true})
        this.players = await factory.createMany('player', numPlayersTotal, {chapterId: this.cycle.chapterId, phaseId: this.phase.id})
        this.projects = await Promise.all(Array.from(Array(numProjects).keys()).map(i => {
          return factory.create('project', {
            chapterId: this.cycle.chapterId,
            cycleId: this.cycle.id,
            phaseId: this.phase.id,
            playerIds: this.players
              .slice(i * numPlayersPerProject, i * numPlayersPerProject + numPlayersPerProject)
              .map(p => p.id),
          })
        }))
      }
    })

    describe('when there is a retrospective surveyBlueprint with questions', function () {
      beforeEach(async function () {
        const teamQuestions = [await factory.create('question', {responseType: 'relativeContribution', subjectType: 'team'})]
        const playerQuestions = await factory.createMany('question', {responseType: 'likert7Agreement', subjectType: 'player'}, 2)
        const projectQuestions = await factory.createMany('question', {responseType: 'numeric', subjectType: 'project'}, 2)
        this.questions = teamQuestions.concat(playerQuestions).concat(projectQuestions)
        this.surveyBlueprint = await factory.create('surveyBlueprint', {
          descriptor: RETROSPECTIVE_DESCRIPTOR,
          defaultQuestionRefs: this.questions.map(q => ({questionId: q.id}))
        })
      })

      it('creates a survey for each project team with all of the default retro questions', async function () {
        const numPlayersPerProject = 4
        await this.createPlayersAndProjects(numPlayersPerProject)
        await ensureRetrospectiveSurveysExist(this.cycle)

        await _itBuildsTheSurveyProperly(this.projects, this.questions)
      })

      it('ignores questions with a `responseType` of `relativeContribution` for single-player teams', async function () {
        const numPlayersPerProject = 1
        await this.createPlayersAndProjects(numPlayersPerProject)
        await ensureRetrospectiveSurveysExist(this.cycle)

        await _itBuildsTheSurveyProperly(this.projects, this.questions, {shouldIncludeRelativeContribution: false})
      })

      describe('when there are other projects in the chapter but not in this cycle', function () {
        it('ignores them', async function () {
          const projectFromAnotherCycleBefore = await factory.create('project', {chapterId: this.cycle.chapterId})
          await ensureRetrospectiveSurveysExist(this.cycle)

          const projectFromAnotherCycleAfter = await Project.get(projectFromAnotherCycleBefore.id)
          expect(projectFromAnotherCycleAfter.retrospectiveSurveyId).to.deep.eq(projectFromAnotherCycleBefore.retrospectiveSurveyId)
          expect(projectFromAnotherCycleAfter.updatedAt).to.deep.eq(projectFromAnotherCycleBefore.updatedAt)
        })
      })

      it('creates any missing surveys when run multiple times', async function () {
        const numPlayersPerProject = 4
        await this.createPlayersAndProjects(numPlayersPerProject)
        await ensureRetrospectiveSurveysExist(this.cycle)

        const firstProject = (await Project.filter({chapterId: this.cycle.chapterId, cycleId: this.cycle.id}))[0]
        const {retrospectiveSurveyId} = firstProject
        await Project.get(firstProject.id).update({retrospectiveSurveyId: null})
        await Survey.get(retrospectiveSurveyId).delete().execute()

        await ensureRetrospectiveSurveysExist(this.cycle)
        const replacedProject = await Project.get(firstProject.id)
        expect(replacedProject.retrospectiveSurveyId).to.exist
      })
    })

    describe('when there is no retrospective surveyBlueprint', function () {
      it('rejects the promise', async function () {
        const numPlayersPerProject = 4
        await this.createPlayersAndProjects(numPlayersPerProject)
        return expect(ensureRetrospectiveSurveysExist(this.cycle)).to.be.rejected
      })
    })
  })
})

async function _itBuildsTheSurveyProperly(projects, questions, opts = null) {
  const options = opts || {shouldIncludeRelativeContribution: true}

  const tqFilter = options.shouldIncludeRelativeContribution ?
    question => question.subjectType === 'team' :
    question => question.subjectType === 'team' && question.responseType !== 'relativeContribution'
  const teamQuestions = questions.filter(tqFilter)
  const playerQuestions = questions.filter(_ => _.subjectType === 'player')
  const projectQuestions = questions.filter(_ => _.subjectType === 'project')
  const rcQuestions = questions.filter(_ => _.responseType === 'relativeContribution')

  const surveys = await Survey.run()
  expect(surveys).to.have.length(projects.length)

  const updatedProjects = await Project.getAll(...projects.map(p => p.id))
  updatedProjects.forEach(project => {
    const {playerIds, retrospectiveSurveyId, id: projectId} = project

    const survey = surveys.find(({id}) => id === retrospectiveSurveyId)
    expect(survey).to.exist

    let questionIds = questions.map(({id}) => id)
    questionIds = options.shouldIncludeRelativeContribution ?
      questionIds :
      questionIds.filter(questionId => !rcQuestions.find(rcQuestion => rcQuestion.id === questionId))

    const surveyRefIds = survey.questionRefs.map(({questionId}) => questionId)

    const refOffsets = surveyRefIds.map(refId => questionIds.indexOf(refId))
    expect(refOffsets).to.deep.equal(refOffsets.sort())

    expectSetEquality(questionIds, surveyRefIds)

    teamQuestions.forEach(question => {
      const refs = survey.questionRefs.filter(ref => ref.questionId === question.id)
      expect(refs).to.have.length(1)
      expect(refs[0].subjectIds.sort()).to.deep.eq(playerIds.sort())
    })

    const compareFirstElement = ([a], [b]) => a < b ? -1 : 1
    playerQuestions.forEach(question => {
      const refs = survey.questionRefs.filter(ref => ref.questionId === question.id)
      expect(refs).to.have.length(playerIds.length)
      expect(refs.map(ref => ref.subjectIds).sort(compareFirstElement))
       .to.deep.eq(playerIds.sort().map(id => [id]))
    })

    projectQuestions.forEach(question => {
      const refs = survey.questionRefs.filter(ref => ref.questionId === question.id)
      expect(refs).to.have.length(1)
      expect(refs[0].subjectIds.sort()).to.deep.eq([projectId])
    })

    rcQuestions.forEach(question => {
      const refs = survey.questionRefs.filter(ref => ref.questionId === question.id)
      const expectedNumRCQuestions = options.shouldIncludeRelativeContribution ? 1 : 0
      expect(refs).to.have.length(expectedNumRCQuestions)
      if (expectedNumRCQuestions > 0) {
        expect(refs[0].subjectIds.sort()).to.deep.eq(playerIds.sort())
      }
    })
  })
}
