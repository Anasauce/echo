import getSurveyById from './getSurveyById'
import excludeQuestionsAboutRespondent from './excludeQuestionsAboutRespondent'
import inflateQuestionRefs from './inflateQuestionRefs'

export default function getFullSurveyForMemberById(memberId, surveyId) {
  const surveyQuery = excludeQuestionsAboutRespondent(getSurveyById(surveyId), memberId)
  return inflateQuestionRefs(memberId, surveyQuery)
}
