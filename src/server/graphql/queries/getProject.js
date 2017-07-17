import {GraphQLNonNull, GraphQLString} from 'graphql'

import {userCan} from 'src/common/util'
import {getProject} from 'src/server/services/dataService'
import {Project} from 'src/server/graphql/schemas'
import {LGNotAuthorizedError, LGBadRequestError} from 'src/server/util/error'

export default {
  type: Project,
  args: {
    identifier: {type: new GraphQLNonNull(GraphQLString), description: 'The project ID or name'}
  },
  async resolve(source, {identifier}, {rootValue: {currentUser}}) {
    if (!userCan(currentUser, 'viewProject')) {
      throw new LGNotAuthorizedError()
    }

    const project = await getProject(identifier)
    if (!project) {
      throw new LGBadRequestError(`Project not found for identifier ${identifier}`)
    }

    return project
  },
}
