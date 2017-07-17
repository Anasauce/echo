import r from '../r'

export default function geFeedbackTypeById(id) {
  return r.table('feedbackTypes').get(id)
}
