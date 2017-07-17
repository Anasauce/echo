import {GraphQLList} from 'graphql'

import {Chapter} from 'src/server/services/dataService'
import {Chapter as ChapterSchema} from 'src/server/graphql/schemas'
import {LGNotAuthorizedError} from 'src/server/util/error'

export default {
  type: new GraphQLList(ChapterSchema),
  async resolve(source, args, {rootValue: {currentUser}}) {
    if (!currentUser) {
      throw new LGNotAuthorizedError()
    }

    return Chapter.run()
  }
}
