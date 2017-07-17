import {GraphQLNonNull} from 'graphql'

import {userCan} from 'src/common/util'
import importProject from 'src/server/actions/importProject'
import {Project, ProjectImport} from 'src/server/graphql/schemas'
import {LGNotAuthorizedError} from 'src/server/util/error'

export default {
  type: Project,
  args: {
    values: {type: new GraphQLNonNull(ProjectImport)},
  },
  async resolve(source, {values}, {rootValue: {currentUser}}) {
    if (!userCan(currentUser, 'importProject')) {
      throw new LGNotAuthorizedError()
    }

    return await importProject(values)
  }
}
