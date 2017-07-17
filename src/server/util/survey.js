export function groupResponsesBySubject(surveyResponses) {
  return surveyResponses.reduce((result, response) => {
    const {subjectId} = response

    if (!result.has(subjectId)) {
      result.set(subjectId, [])
    }
    result.get(subjectId).push(response)

    return result
  }, new Map())
}

export function assertValidSurvey(survey) {
  const {id, questionRefs} = survey
  if (!questionRefs || questionRefs.length === 0) {
    throw new Error(`No questions found in survey ${id}`)
  }
}
