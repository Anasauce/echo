import {GraphQLNonNull, GraphQLString} from 'graphql'

import {userCan} from 'src/common/util'
import {getProject} from 'src/server/services/dataService'
import {ProjectSummary} from 'src/server/graphql/schemas'
import {LGNotAuthorizedError, LGBadRequestError} from 'src/server/util/error'

export default {
  type: ProjectSummary,
  args: {
    identifier: {type: new GraphQLNonNull(GraphQLString), description: 'Project id or name'},
  },
  async resolve(source, {identifier}, {rootValue: {currentUser}}) {
    if (!userCan(currentUser, 'viewProjectSummary')) {
      throw new LGNotAuthorizedError()
    }

    const project = await getProject(identifier)
    if (!project) {
      throw new LGBadRequestError(`Project not found for identifier ${identifier}`)
    }

    return {project}
  }
}
