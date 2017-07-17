import faker from 'faker'

import {PoolMember} from 'src/server/services/dataService'

const now = new Date()

export default function define(factory) {
  factory.define('poolMember', PoolMember, {
    id: cb => cb(null, faker.random.uuid()),
    memberId: cb => cb(null, faker.random.uuid()),
    poolId: cb => cb(null, faker.random.uuid()),
    createdAt: cb => cb(null, now),
    updatedAt: cb => cb(null, now),
  })
}
