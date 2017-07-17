import faker from 'faker'

import {FeedbackType} from 'src/server/services/dataService'

const now = new Date()

export default function define(factory) {
  factory.define('feedbackType', FeedbackType, {
    id: cb => cb(null, faker.random.uuid()),
    descriptor: factory.sequence(n => `feedbackType${n}`),
    createdAt: cb => cb(null, now),
    updatedAt: cb => cb(null, now),
  })
}
