import {GraphQLNonNull} from 'graphql'
import {GraphQLObjectType, GraphQLList} from 'graphql/type'

import {
  resolveProjectUserSummaries,
} from 'src/server/graphql/resolvers'

export default new GraphQLObjectType({
  name: 'ProjectSummary',
  description: 'Summary of project details',
  fields: () => {
    const {Project, ProjectUserSummary} = require('src/server/graphql/schemas')

    return {
      project: {type: new GraphQLNonNull(Project), description: 'The project'},
      projectUserSummaries: {type: new GraphQLList(ProjectUserSummary), resolve: resolveProjectUserSummaries, description: 'The project\'s user summaries'},
    }
  }
})
