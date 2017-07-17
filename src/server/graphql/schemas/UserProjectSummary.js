import {GraphQLNonNull} from 'graphql'
import {GraphQLObjectType, GraphQLList} from 'graphql/type'

export default new GraphQLObjectType({
  name: 'UserProjectSummary',
  description: 'User project summary',
  fields: () => {
    const {Project, UserProjectEvaluation} = require('src/server/graphql/schemas')

    return {
      project: {type: new GraphQLNonNull(Project), description: 'The project'},
      userProjectEvaluations: {type: new GraphQLList(UserProjectEvaluation), description: 'The user\'s project evaluations'},
    }
  }
})
