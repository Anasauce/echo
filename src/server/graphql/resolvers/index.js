import Promise from 'bluebird'

import {surveyCompletedBy, surveyLockedFor} from 'src/common/models/survey'
import findActiveMembersInChapter from 'src/server/actions/findActiveMembersInChapter'
import findActiveProjectsForChapter from 'src/server/actions/findActiveProjectsForChapter'
import getUser from 'src/server/actions/getUser'
import findUsers from 'src/server/actions/findUsers'
import findUserProjectEvaluations from 'src/server/actions/findUserProjectEvaluations'
import handleSubmitSurvey from 'src/server/actions/handleSubmitSurvey'
import handleSubmitSurveyResponses from 'src/server/actions/handleSubmitSurveyResponses'
import getNextCycleIfExists from 'src/server/actions/getNextCycleIfExists'
import getPrevCycleIfExists from 'src/server/actions/getPrevCycleIfExists'
import {
  Chapter, Cycle, Project, Survey, Phase,
  findProjectsForUser,
  getLatestCycleForChapter,
  findProjects,
} from 'src/server/services/dataService'
import {LGBadRequestError, LGNotAuthorizedError} from 'src/server/util/error'
import {mapById, userCan} from 'src/common/util'

export function resolveChapter(parent) {
  return parent.chapter ||
    (parent.chapterId ? _safeResolveAsync(Chapter.get(parent.chapterId)) : null)
}

export function resolvePhase(parent) {
  return parent.phase ||
    (parent.phaseId ? _safeResolveAsync(Phase.get(parent.phaseId)) : null)
}

export function resolveChapterLatestCycle(chapter) {
  return chapter.latestCycle || _safeResolveAsync(
    getLatestCycleForChapter(chapter.id, {default: null})
  )
}

export function resolveChapterActiveProjectCount(chapter) {
  return isNaN(chapter.activeProjectCount) ?
    _safeResolveAsync(
      findActiveProjectsForChapter(chapter.id, {count: true})
    ) : chapter.activeProjectCount
}

export async function resolveChapterActiveMemberCount(chapter) {
  return isNaN(chapter.activeMemberCount) ?
    (await _safeResolveAsync(
      findActiveMembersInChapter(chapter.id)
    ) || []).length : chapter.activeMemberCount
}

export function resolveCycle(parent) {
  return parent.cycle || _safeResolveAsync(
    Cycle.get(parent.cycleId || '')
  )
}

export async function resolveFindProjects(args, currentUser) {
  const {
    identifiers,
    page: {
      direction = null,
      cycleId = null,
    } = {}
  } = args

  if (identifiers) {
    return findProjects(identifiers)
  }

  const currentCycle = cycleId ?
    await Cycle.get(cycleId) :
    await getUser(currentUser.id).then(_ => getLatestCycleForChapter(_.chapterId))

  const cycle = (
    direction === 'next' ? await getNextCycleIfExists(currentCycle) :
    direction === 'prev' ? await getPrevCycleIfExists(currentCycle) :
    currentCycle
  )

  return cycle ? Project.filter({cycleId: cycle.id}) : []
}

export function resolveProject(parent) {
  return parent.project ||
    parent.projectId ? _safeResolveAsync(Project.get(parent.projectId)) : null
}

export function resolveProjectGoal(project) {
  if (!project.goal) {
    return null
  }
  return project.goal
}

export function resolveProjectMembers(project) {
  if (project.members) {
    return project.members
  }
  return findUsers(project.memberIds)
}

export async function resolveProjectUserSummaries(projectSummary, args, {rootValue: {currentUser}}) {
  const {project} = projectSummary
  if (!project) {
    throw new Error('Invalid project for user summaries')
  }

  if (projectSummary.projectUserSummaries) {
    return projectSummary.projectUserSummaries
  }

  const projectUsers = await findUsers(project.memberIds)

  const projectUserMap = mapById(projectUsers)

  return Promise.map(projectUsers, async user => {
    const canViewSummary = user.id === currentUser.id || userCan(currentUser, 'viewProjectUserSummary')
    const summary = canViewSummary ? await getUserProjectSummary(user, project, projectUserMap, currentUser) : {}
    return {user, ...summary}
  })
}

export async function resolveUser(source, {identifier}, {rootValue: {currentUser}}) {
  if (!userCan(currentUser, 'viewUser')) {
    throw new LGNotAuthorizedError()
  }
  const user = await getUser(identifier)
  if (!user) {
    throw new LGBadRequestError(`User not found for identifier ${identifier}`)
  }
  return user
}

export async function resolveUserProjectSummaries(userSummary, args, {rootValue: {currentUser}}) {
  const {user} = userSummary
  if (!user) {
    throw new Error('Invalid user for project summaries')
  }
  if (userSummary.userProjectSummaries) {
    return userSummary.userProjectSummaries
  }

  const projects = await findProjectsForUser(user.id)
  const projectUserIds = projects.reduce((result, project) => {
    if (project.memberIds && project.memberIds.length > 0) {
      result.push(...project.memberIds)
    }
    return result
  }, [])

  const projectUserMap = mapById(await findUsers(projectUserIds))

  const sortedProjects = projects.sort((a, b) => a.createdAt - b.createdAt).reverse()
  return Promise.map(sortedProjects, async project => {
    const summary = await getUserProjectSummary(user, project, projectUserMap, currentUser)
    return {project, ...summary}
  })
}

async function getUserProjectSummary(user, project, projectUserMap, currentUser) {
  if (user.id !== currentUser.id && !userCan(currentUser, 'viewUserFeedback')) {
    return null
  }
  const userProjectEvaluations = await findUserProjectEvaluations(user, project)
  userProjectEvaluations.forEach(evaluation => {
    evaluation.submittedBy = projectUserMap.get(evaluation.submittedById)
  })

  let userRetrospectiveComplete
  let userRetrospectiveUnlocked

  if (project.retrospectiveSurveyId) {
    const survey = await Survey.get(project.retrospectiveSurveyId)
    userRetrospectiveComplete = surveyCompletedBy(survey, user.id)
    userRetrospectiveUnlocked = !surveyLockedFor(survey, user.id)
  }

  return {
    userProjectEvaluations,
    userRetrospectiveComplete,
    userRetrospectiveUnlocked,
  }
}

export async function resolveSubmitSurvey(source, {surveyId}, {rootValue: {currentUser}}) {
  await handleSubmitSurvey(surveyId, currentUser.id)
  return {success: true}
}

export async function resolveSaveRetrospectiveSurveyResponses(source, {responses}, {rootValue: {currentUser}}) {
  _assertUserAuthorized(currentUser, 'saveResponse')
  await _assertCurrentUserCanSubmitResponsesForRespondent(currentUser, responses)
  return handleSubmitSurveyResponses(responses)
}

function _assertUserAuthorized(user, action) {
  if (!user || !userCan(user, action)) {
    throw new LGNotAuthorizedError()
  }
}

function _assertCurrentUserCanSubmitResponsesForRespondent(currentUser, responses) {
  responses.forEach(response => {
    if (currentUser.id !== response.respondentId) {
      throw new LGBadRequestError('You cannot submit responses for other members.')
    }
  })
}

async function _safeResolveAsync(query) {
  try {
    return await query
  } catch (err) {
    console.error(err)
    return null
  }
}
