import {GraphQLNonNull, GraphQLString, GraphQLList} from 'graphql'
import {GraphQLInputObjectType} from 'graphql/type'

export default new GraphQLInputObjectType({
  name: 'CLINamedSurveyResponse',
  description: 'A CLI Response to a named question on a survey',
  fields: () => ({
    questionName: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The name of the question in the survey'
    },
    responseParams: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLString)),
      description: 'The positional parameters as parsed by the CLI'
    },
  })
})
