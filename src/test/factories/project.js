import faker from 'faker'

import {REFLECTION} from 'src/common/models/cycle'
import {Project} from 'src/server/services/dataService'

const now = new Date()

export default function define(factory) {
  const commonAttrs = {
    id: cb => cb(null, faker.random.uuid()),
    name: factory.sequence(n => `funky-falcon-${n}`),
    chapterId: factory.assoc('chapter', 'id'),
    cycleId(cb) {
      const {chapterId} = this
      const createCycles = factory.assocMany('cycle', 'id', 1, [{chapterId, state: REFLECTION}])
      createCycles((err, cycleIds) => cb(err, cycleIds[0]))
    },
    goal: factory.sequence(n => {
      const url = `https://jsdev.example.com/goals/${n}`
      const title = `Goal #${n}`
      const teamSize = 2
      const phase = 1
      const dynamic = false
      return {
        number: n,
        url,
        title,
        teamSize,
        phase,
        dynamic,
        goalMetadata: {
          url,
          title,
          goal_id: n, // eslint-disable-line camelcase
          team_size: teamSize, // eslint-disable-line camelcase
          phase,
          dynamic,
        },
      }
    }),
    artifactURL: factory.sequence(n => `http://artifact.example.com/${n}`),
    createdAt: cb => cb(null, now),
    updatedAt: cb => cb(null, now),
  }

  factory.define('project', Project, {
    ...commonAttrs,
    memberIds(cb) {
      const {chapterId} = this
      const createMembers = factory.assocMany('member', 'id', 4, {chapterId})
      createMembers((err, memberIds) => {
        cb(err, memberIds.slice(0, 4))
      })
    },
  })

  factory.define('single member project', Project, {
    ...commonAttrs,
    memberIds(cb) {
      const {chapterId} = this
      const createMembers = factory.assocMany('member', 'id', 1, {chapterId})
      createMembers((err, memberIds) => {
        cb(err, memberIds.slice(0, 1))
      })
    },
  })
}
