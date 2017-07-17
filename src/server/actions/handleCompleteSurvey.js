import {Survey} from 'src/server/services/dataService'

export default function handleCompleteSurvey(surveyId, respondentId) {
  return Survey.get(surveyId).updateWithTimestamp(row => {
    return {
      completedBy: row('completedBy').default([]).setInsert(respondentId),
      unlockedFor: row('unlockedFor').default([]).setDifference([respondentId]),
    }
  })
}
