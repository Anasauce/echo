import {r, findSurveyResponsesForMember} from 'src/server/services/dataService'
import {insertAllIntoTable, updateAllInTable} from 'src/server/services/dataService/util'

const table = r.table('responses')

export default async function saveResponsesForSurveyQuestion(newResponses) {
  const {questionId, respondentId, surveyId} = newResponses[0]
  const subjectIds = newResponses.map(response => response.subjectId)

  const existingResponses = await findSurveyResponsesForMember(respondentId, surveyId, questionId)
    .filter(row => r.expr(subjectIds).contains(row('subjectId'))).run()

  const responsesToUpdate = existingResponses.map(existingResponse => {
    const responseToUpdate = newResponses.find(response => response.subjectId === existingResponse.subjectId)
    return Object.assign({}, responseToUpdate, {id: existingResponse.id, updatedAt: r.now()})
  })

  await updateAllInTable(responsesToUpdate, table)

  const responsesToInsert = newResponses
    .filter(update => !existingResponses.find(existing => existing.subjectId === update.subjectId))
    .map(response => Object.assign({}, response, {createdAt: r.now(), updatedAt: r.now()}))

  /* eslint-disable camelcase */
  const {generated_keys} = await insertAllIntoTable(responsesToInsert, table)
  const responseIds = existingResponses.map(({id}) => id).concat(generated_keys || [])
  /* eslint-enable camelcase */

  return responseIds
}
