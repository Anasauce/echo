import faker from 'faker'

import {Chapter} from 'src/server/services/dataService'

const now = new Date()

export default function define(factory) {
  /* eslint-disable object-shorthand, brace-style */
  factory.define('chapter', Chapter, {
    id: cb => cb(null, faker.random.uuid()),
    name: factory.sequence(n => `Test Chapter ${n}`),
    channelName: function (cb) { cb(null, faker.helpers.slugify(this.name).toLowerCase()) },
    timezone: 'America/Los_Angeles',
    githubTeamId: factory.sequence(n => n),
    inviteCodes: [],
    createdAt: cb => cb(null, now),
    updatedAt: cb => cb(null, now),
  })
}
