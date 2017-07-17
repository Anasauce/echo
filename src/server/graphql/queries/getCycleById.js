import {GraphQLNonNull, GraphQLID} from 'graphql'

import {Cycle} from 'src/server/services/dataService'
import {Cycle as CycleSchema} from 'src/server/graphql/schemas'
import {LGNotAuthorizedError} from 'src/server/util/error'

export default {
  type: CycleSchema,
  args: {
    id: {type: new GraphQLNonNull(GraphQLID)}
  },
  async resolve(source, args, {rootValue: {currentUser}}) {
    if (!currentUser) {
      throw new LGNotAuthorizedError()
    }

    return Cycle.get(args.id).getJoin({chapter: true})
  },
}
