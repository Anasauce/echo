import r from '../r'
import getFeedbackTypeByDescriptor from './getFeedbackTypeByDescriptor'

export default function findQuestionsByFeedbackType(feedbackTypeDescriptor) {
  return r.table('questions').filter({
    feedbackTypeId: getFeedbackTypeByDescriptor(feedbackTypeDescriptor)('id')
  })
}
