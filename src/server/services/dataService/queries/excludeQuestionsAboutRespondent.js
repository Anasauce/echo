import r from '../r'

export default function excludeQuestionsAboutRespondent(surveyQuery, respondentId) {
  const questionRefIsAboutRespondent = ref => r.and(
    ref('subjectIds').count().eq(1),
    ref('subjectIds').nth(0).eq(respondentId)
  )
  const filteredQuestionRefs = row => row('questionRefs').filter(
    ref => r.not(questionRefIsAboutRespondent(ref))
  )
  return surveyQuery.merge(row => ({
    questionRefs: filteredQuestionRefs(row)
  }))
}
