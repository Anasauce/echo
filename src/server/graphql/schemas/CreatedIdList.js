import {GraphQLNonNull, GraphQLID} from 'graphql'
import {GraphQLList, GraphQLObjectType} from 'graphql/type'

export default new GraphQLObjectType({
  name: 'CreatedIdList',
  description: 'A list of the IDs created by this request',
  fields: () => {
    return {
      createdIds: {
        type: new GraphQLNonNull(new GraphQLList(GraphQLID))
      }
    }
  },
})
