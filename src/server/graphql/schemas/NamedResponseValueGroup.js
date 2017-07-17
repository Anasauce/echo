import {GraphQLNonNull, GraphQLString, GraphQLList} from 'graphql'
import {GraphQLObjectType} from 'graphql/type'

export default new GraphQLObjectType({
  name: 'NamedResponseValueGroup',
  description: 'A Survey Response paired with the name of the question it is a response to.',
  fields: () => {
    const {ResponseValue} = require('src/server/graphql/schemas')

    return {
      questionName: {type: new GraphQLNonNull(GraphQLString), description: 'The name of the question in the survey'},
      values: {type: new GraphQLNonNull(new GraphQLList(ResponseValue)), description: 'The a list of response values by subject'},
    }
  },
})
