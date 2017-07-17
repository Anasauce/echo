import faker from 'faker'

import {Member} from 'src/server/services/dataService'

const now = new Date()

export default function define(factory) {
  factory.define('member', Member, {
    id: cb => cb(null, faker.random.uuid()),
    chapterId: factory.assoc('chapter', 'id'),
    phaseId: factory.assoc('phase', 'id'),
    chapterHistory: [],
    createdAt: cb => cb(null, now),
    updatedAt: cb => cb(null, now),
  })
}
