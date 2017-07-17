import {GraphQLID} from 'graphql'

import getCycleVotingResults from 'src/server/actions/getCycleVotingResults'
import {getUserById} from 'src/server/services/dataService'
import {CycleVotingResults} from 'src/server/graphql/schemas'
import {LGNotAuthorizedError} from 'src/server/util/error'

export default {
  type: CycleVotingResults,
  args: {
    cycleId: {type: GraphQLID}
  },
  async resolve(source, {cycleId}, {rootValue: {currentUser}}) {
    // only signed-in users can view results
    if (!currentUser) {
      throw new LGNotAuthorizedError()
    }

    const user = await getUserById(currentUser.id)
    if (!user) {
      throw new LGNotAuthorizedError()
    }

    return await getCycleVotingResults(user.chapterId, cycleId)
  }
}
