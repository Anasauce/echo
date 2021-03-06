import {GraphQLNonNull, GraphQLID} from 'graphql'

import {Player, errors} from 'src/server/services/dataService'
import {User} from 'src/server/graphql/schemas'
import {LGNotAuthorizedError, LGBadRequestError} from 'src/server/util/error'

export default {
  type: User,
  args: {
    id: {type: new GraphQLNonNull(GraphQLID)}
  },
  async resolve(source, args, {rootValue: {currentUser}}) {
    if (!currentUser) {
      throw new LGNotAuthorizedError()
    }

    return Player.get(args.id)
      .getJoin({chapter: true})
      .catch(errors.DocumentNotFound, () => {
        throw new LGBadRequestError('No such player')
      })
  },
}
