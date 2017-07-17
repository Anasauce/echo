import {GraphQLNonNull, GraphQLID} from 'graphql'

import {resolveSubmitSurvey} from 'src/server/graphql/resolvers'
import {Status} from 'src/server/graphql/schemas'

export default {
  type: Status,
  args: {
    surveyId: {
      description: 'The submitted survey\'s ID',
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  resolve: resolveSubmitSurvey,
}
