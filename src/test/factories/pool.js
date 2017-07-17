import faker from 'faker'

import {Pool} from 'src/server/services/dataService'

const now = new Date()

export default function define(factory) {
  factory.define('pool', Pool, {
    id: cb => cb(null, faker.random.uuid()),
    name: factory.sequence(n => `pool${n}`),
    phaseId: factory.assoc('phase', 'id'),
    createdAt: cb => cb(null, now),
    updatedAt: cb => cb(null, now),
  })
}
