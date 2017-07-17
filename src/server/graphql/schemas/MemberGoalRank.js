import {GraphQLInt, GraphQLNonNull, GraphQLID} from 'graphql'
import {GraphQLObjectType} from 'graphql/type'

export default new GraphQLObjectType({
  name: 'MemberGoalRank',
  description: 'A Member and their rank for a particular Goal',
  fields: () => {
    return {
      memberId: {type: new GraphQLNonNull(GraphQLID), description: 'The Member UUID'},
      goalRank: {type: new GraphQLNonNull(GraphQLInt), description: 'The Member rank for the given Goal'},
    }
  },
})
