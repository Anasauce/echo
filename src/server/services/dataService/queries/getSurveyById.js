import r from '../r'

export default function getSurveyById(id) {
  return r.table('surveys').get(id)
}
