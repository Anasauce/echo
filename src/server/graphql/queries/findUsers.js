import {GraphQLString} from 'graphql'
import {GraphQLList} from 'graphql/type'

import {userCan} from 'src/common/util'
import findUsers from 'src/server/actions/findUsers'
import {UserProfile} from 'src/server/graphql/schemas'
import {LGNotAuthorizedError} from 'src/server/util/error'

export default {
  type: new GraphQLList(UserProfile),
  args: {
    identifiers: {type: new GraphQLList(GraphQLString)},
  },
  async resolve(source, {identifiers}, {rootValue: {currentUser}}) {
    if (!userCan(currentUser, 'findUsers')) {
      throw new LGNotAuthorizedError()
    }

    return await findUsers(identifiers, {skipNoMatch: true, join: {phase: true}})
  }
}
