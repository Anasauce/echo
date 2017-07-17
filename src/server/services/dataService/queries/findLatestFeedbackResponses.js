import r from '../r'
import getFeedbackTypeById from './getFeedbackTypeById'
import getQuestionById from './getQuestionById'

export default async function findLatestFeedbackResponses({respondentId, subjectId}) {
  return r.table('responses')
    .filter({subjectId, respondentId})
    .merge(_mergeFeedbackTypeDescriptor)
    .filter(_hasFeedbackTypeDescriptor)
    .group('surveyId').ungroup()
    .map(group => ({
      surveyId: group('group'),
      responses: group('reduction'),
    }))
    .do(_sortBySurveyCreationDate)
    .nth(0).default({})('responses').default([])
}

function _mergeFeedbackTypeDescriptor(row) {
  return {feedbackTypeDescriptor: _getFeedbackTypeDescriptorForQuestion(row('questionId'))}
}

function _hasFeedbackTypeDescriptor(row) {
  return row.hasFields('feedbackTypeDescriptor')
}

function _sortBySurveyCreationDate(expr) {
  return expr.merge(row => ({
    surveyCreatedAt: r.table('surveys').get(row('surveyId'))('createdAt')
  }))
  .orderBy(r.desc('surveyCreatedAt'))
}

function _getFeedbackTypeDescriptorForQuestion(questionId) {
  return getFeedbackTypeById(_getFeedbackTypeIdForQuestion(questionId))('descriptor').default(null)
}

function _getFeedbackTypeIdForQuestion(questionId) {
  return getQuestionById(questionId)('feedbackTypeId').default(null)
}
