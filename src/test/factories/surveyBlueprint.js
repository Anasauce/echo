import faker from 'faker'

import {SurveyBlueprint} from 'src/server/services/dataService'

const now = new Date()

export default function define(factory) {
  factory.define('surveyBlueprint', SurveyBlueprint, {
    id: cb => cb(null, faker.random.uuid()),
    descriptor: factory.sequence(n => `surveyBlueprint${n}`),
    defaultQuestionRefs: [],
    createdAt: cb => cb(null, now),
    updatedAt: cb => cb(null, now),
  })
}
