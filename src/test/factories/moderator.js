import faker from 'faker'

import {Moderator} from 'src/server/services/dataService'

const now = new Date()

export default function define(factory) {
  factory.define('moderator', Moderator, {
    id: cb => cb(null, faker.random.uuid()),
    chapterId: factory.assoc('chapter', 'id'),
    createdAt: cb => cb(null, now),
    updatedAt: cb => cb(null, now),
  })
}
