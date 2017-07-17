import {GraphQLString, GraphQLID} from 'graphql'
import {GraphQLList, GraphQLInputObjectType} from 'graphql/type'

import {Project} from 'src/server/graphql/schemas'
import {userCan} from 'src/common/util'
import {LGNotAuthorizedError} from 'src/server/util/error'
import {resolveFindProjects} from 'src/server/graphql/resolvers'

export default {
  type: new GraphQLList(Project),
  args: {
    identifiers: {type: new GraphQLList(GraphQLString), description: 'A list of project identifiers'},
    page: {
      type: new GraphQLInputObjectType({
        name: 'ProjectPageInput',
        description: 'The details about which page of project results to return',
        fields: () => ({
          cycleId: {
            type: GraphQLID,
            description: 'The name of the question in the survey'
          },
          direction: {
            type: GraphQLString,
            description: 'The direction to go for the next page'
          },
        })
      }),
      description: 'Parameters For requesting certain pages'
    },
  },
  async resolve(source, args = {}, {rootValue: {currentUser}}) {
    if (!userCan(currentUser, 'findProjects')) {
      throw new LGNotAuthorizedError()
    }
    return resolveFindProjects(args, currentUser)
  },
}
