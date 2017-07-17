import {GraphQLNonNull, GraphQLID, GraphQLString} from 'graphql'
import {GraphQLObjectType, GraphQLList} from 'graphql/type'

export default new GraphQLObjectType({
  name: 'SurveyQuestion',
  description: 'A survey question',
  fields: () => {
    const {
      MemberSubject,
      SubjectTypeEnum,
      ResponseValueGroup,
      ResponseTypeEnum,
      SurveyQuestionValidationOptions,
    } = require('src/server/graphql/schemas')

    return {
      id: {type: new GraphQLNonNull(GraphQLID), description: 'The id of the question'},
      subjectType: {type: new GraphQLNonNull(SubjectTypeEnum), description: 'The type of the subject '},
      responseType: {type: new GraphQLNonNull(ResponseTypeEnum), description: 'The expected type of the response'},
      responseInstructions: {type: GraphQLString, description: 'Instructions for answering the question'},
      body: {type: new GraphQLNonNull(GraphQLString), description: 'The body of the question'},
      subjects: {type: new GraphQLNonNull(new GraphQLList(MemberSubject)), description: 'The list of subjects this question is asking about'},
      response: {type: new GraphQLNonNull(ResponseValueGroup), description: 'The response to this question'},
      validationOptions: {type: SurveyQuestionValidationOptions, description: 'The validation options for this question'},
    }
  },
})
