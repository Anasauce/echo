import {GraphQLNonNull, GraphQLList, GraphQLID} from 'graphql'
import {GraphQLInputObjectType} from 'graphql/type'

export default new GraphQLInputObjectType({
  name: 'SurveyResponseInput',
  description: 'A response to a question on a survey',
  fields: () => {
    const {ResponseInputValue} = require('src/server/graphql/schemas')

    return {
      questionId: {type: new GraphQLNonNull(GraphQLID), description: 'The the UUID of the question this is a repsonse to'},
      respondentId: {type: GraphQLID, description: 'The the UUID of the user authoring this response. Defaults to currentUser'},
      surveyId: {type: new GraphQLNonNull(GraphQLID), description: 'The survey this response is associated with'},
      values: {type: new GraphQLList(ResponseInputValue), description: 'The value(s) of the response'},
    }
  },
})
