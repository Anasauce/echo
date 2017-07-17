import faker from 'faker'

import {Question} from 'src/server/services/dataService'

const now = new Date()

export default function define(factory) {
  factory.define('question', Question, {
    id: cb => cb(null, faker.random.uuid()),
    body: 'How much did each team member contribute this cycle?',
    responseType: 'relativeContribution',
    subjectType: 'team',
    active: true,
    createdAt: cb => cb(null, now),
    updatedAt: cb => cb(null, now),
  })
  factory.define('configured question', Question, {
    id: cb => cb(null, faker.random.uuid()),
    body: 'How much did each team member contribute this cycle?',
    responseType: 'relativeContribution',
    subjectType: 'team',
    active: true,
  })
}
