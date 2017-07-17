import {GraphQLNonNull, GraphQLString} from 'graphql'

import {userCan} from 'src/common/util'
import {resolveUser} from 'src/server/graphql/resolvers'
import {UserSummary} from 'src/server/graphql/schemas'
import {LGNotAuthorizedError} from 'src/server/util/error'

export default {
  type: UserSummary,
  args: {
    identifier: {type: new GraphQLNonNull(GraphQLString), description: 'The user ID or handle'},
  },
  async resolve(source, args, ast) {
    if (!userCan(ast.rootValue.currentUser, 'viewUserSummary')) {
      throw new LGNotAuthorizedError()
    }

    return {
      user: await resolveUser(source, args, ast),
    }
  }
}
