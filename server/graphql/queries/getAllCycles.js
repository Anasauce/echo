import {GraphQLList} from 'graphql/type'
import {GraphQLError} from 'graphql/error'

import {connect} from 'src/db'
import {Cycle} from 'src/server/graphql/schemas'

const r = connect()

export default {
  type: new GraphQLList(Cycle),
  async resolve(source, args, {rootValue: {currentUser}}) {
    if (!currentUser) {
      throw new GraphQLError('You are not authorized to do that.')
    }

    const result = await r.table('cycles')
      .eqJoin('chapterId', r.table('chapters'))
      .without({left: 'chapterId'}, {right: 'inviteCodes'})
      .map(doc => doc('left').merge({chapter: doc('right')}))
      .run()

    return result
  },
}