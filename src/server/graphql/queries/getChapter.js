import {GraphQLNonNull, GraphQLString} from 'graphql'

import getChapter from 'src/server/actions/getChapter'
import {Chapter} from 'src/server/graphql/schemas'
import {LGNotAuthorizedError, LGBadRequestError} from 'src/server/util/error'

export default {
  type: Chapter,
  args: {
    identifier: {type: new GraphQLNonNull(GraphQLString), description: 'The chapter ID'}
  },
  async resolve(source, {identifier}, {rootValue: {currentUser}}) {
    if (!currentUser) {
      throw new LGNotAuthorizedError()
    }

    const chapter = await getChapter(identifier)
    if (!chapter) {
      throw new LGBadRequestError(`Chapter not found for identifier ${identifier}`)
    }

    return chapter
  }
}
