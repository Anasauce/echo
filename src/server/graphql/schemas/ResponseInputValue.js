import {GraphQLNonNull, GraphQLString, GraphQLID} from 'graphql'
import {GraphQLInputObjectType} from 'graphql/type'

export default new GraphQLInputObjectType({
  name: 'ResponseInputValue',
  description: 'A response value for a question',
  fields: () => {
    return {
      subjectId: {type: new GraphQLNonNull(GraphQLID), description: 'The subjectId this response pertains to'},
      value: {type: new GraphQLNonNull(GraphQLString), description: 'The response value'}, // workaround for polymorphic input types
    }
  },
})
