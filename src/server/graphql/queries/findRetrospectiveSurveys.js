import {GraphQLList} from 'graphql'

import {userCan} from 'src/common/util'
import findOpenRetroSurveysForMember from 'src/server/actions/findOpenRetroSurveysForMember'
import {Survey} from 'src/server/graphql/schemas'
import {LGNotAuthorizedError} from 'src/server/util/error'

export default {
  type: new GraphQLList(Survey),
  async resolve(source, args, {rootValue: {currentUser}}) {
    if (!currentUser || !userCan(currentUser, 'findRetrospectiveSurveys')) {
      throw new LGNotAuthorizedError()
    }

    return findOpenRetroSurveysForMember(currentUser.id)
  },
}
