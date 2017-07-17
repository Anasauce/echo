import faker from 'faker'

import {Response} from 'src/server/services/dataService'

const now = new Date()

export default function define(factory) {
  factory.define('response', Response, {
    id: cb => cb(null, faker.random.uuid()),
    value: 5,
    questionId: factory.assoc('question', 'id'),
    respondentId: factory.assoc('member', 'id'),
    surveyId: factory.assoc('survey', 'id'),
    subjectId: factory.assoc('member', 'id'),
    createdAt: cb => cb(null, now),
    updatedAt: cb => cb(null, now),
  })
}
