import {Project, Survey} from 'src/server/services/dataService'
import {LGBadRequestError} from 'src/server/util/error'

export async function unlockRetroSurveyForUser(memberId, projectId) {
  const survey = await _getCompletedRetrospectiveSurvey(memberId, projectId)
  const unlockedFor = _without(survey.unlockedFor, memberId)
  unlockedFor.push(memberId)
  await Survey.get(survey.id).updateWithTimestamp({unlockedFor})
}

export async function lockRetroSurveyForUser(memberId, projectId) {
  const survey = await _getCompletedRetrospectiveSurvey(memberId, projectId)
  await Survey
    .get(survey.id)
    .updateWithTimestamp({
      unlockedFor: _without(survey.unlockedFor, memberId)
    })
}

async function _getCompletedRetrospectiveSurvey(memberId, projectId) {
  const {retrospectiveSurvey} = await Project.get(projectId).getJoin({retrospectiveSurvey: true})
  if (!retrospectiveSurvey.completedBy.includes(memberId)) {
    throw new LGBadRequestError('Cannot lock or unlock an incomplete survey')
  }
  return retrospectiveSurvey
}

function _without(values, excludedValue) {
  return (values || []).filter(value => value !== excludedValue)
}
