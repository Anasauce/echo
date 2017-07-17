import {GraphQLNonNull, GraphQLID} from 'graphql'

import {getUserById} from 'src/server/services/dataService'
import {User} from 'src/server/graphql/schemas'
import {LGNotAuthorizedError, LGBadRequestError} from 'src/server/util/error'

export default {
  type: User,
  args: {
    id: {type: new GraphQLNonNull(GraphQLID)},
  },
  async resolve(source, {id}, {rootValue: {currentUser}}) {
    if (!currentUser) {
      throw new LGNotAuthorizedError()
    }

    const result = await getUserById(id, {mergeChapter: true})
    if (result) {
      return result
    }
    throw new LGBadRequestError('No such user')
  }
}
