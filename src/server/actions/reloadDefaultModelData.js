import {FeedbackType, Question, Phase, SurveyBlueprint} from 'src/server/services/dataService'

export default function reloadDefaultModelData() {
  return Promise.all([
    FeedbackType.syncData(),
    Question.syncData(),
    Phase.syncData(),
    SurveyBlueprint.syncData(),
  ])
}
