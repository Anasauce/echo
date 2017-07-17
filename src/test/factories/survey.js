import faker from 'faker'

import {Survey} from 'src/server/services/dataService'

const now = new Date()

export default function define(factory) {
  factory.define('survey', Survey, {
    id: cb => cb(null, faker.random.uuid()),
    questionRefs: [],
    completedBy: [],
    unlockedFor: [],
    // This doesn't work =(
    // questionRefs: [
    //   {
    //     questionId: factory.assoc('question', 'id'),
    //     subjectIds: factory.assocMany('member', 'id', 4),
    //   }
    // ],
    createdAt: cb => cb(null, now),
    updatedAt: cb => cb(null, now),
  })
}
