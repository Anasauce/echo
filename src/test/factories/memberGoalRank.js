import faker from 'faker'

export default function define(factory) {
  factory.define('memberGoalRank', null, {
    memberId: cb => cb(null, faker.random.uuid()),
    goalRank: 1,
  })
}
