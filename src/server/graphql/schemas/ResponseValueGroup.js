import {GraphQLNonNull, GraphQLList} from 'graphql'
import {GraphQLObjectType} from 'graphql/type'

export default new GraphQLObjectType({
  name: 'ResponseValueGroup',
  description: 'The grouped response values for a question',
  fields: () => {
    const {ResponseValue} = require('src/server/graphql/schemas')

    return {
      values: {
        type: new GraphQLNonNull(new GraphQLList(ResponseValue)),
        description: 'The a list of response values by subject',
      },
    }
  },
})
