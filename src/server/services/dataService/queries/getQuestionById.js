import r from '../r'

export default function getQuestionById(id) {
  return r.table('questions').get(id)
}
