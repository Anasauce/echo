import faker from 'faker'

import {CYCLE_STATES} from 'src/common/models/cycle'
import {Cycle} from 'src/server/services/dataService'

const now = new Date()

export default function define(factory) {
  factory.define('cycle', Cycle, {
    id: cb => cb(null, faker.random.uuid()),
    chapterId: factory.assoc('chapter', 'id'),
    cycleNumber: factory.sequence(n => n),
    startTimestamp: cb => cb(null, now),
    state: CYCLE_STATES[0],
    createdAt: cb => cb(null, now),
    updatedAt: cb => cb(null, now),
  })
}
