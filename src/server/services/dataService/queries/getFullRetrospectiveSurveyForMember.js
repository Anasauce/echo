import inflateQuestionRefs from './inflateQuestionRefs'
import getRetrospectiveSurveyForMember from './getRetrospectiveSurveyForMember'

export default function getFullRetrospectiveSurveyForMember(memberId, projectId) {
  const surveyQuery = getRetrospectiveSurveyForMember(memberId, projectId)
  return inflateQuestionRefs(memberId, surveyQuery)
}
