import {GraphQLNonNull} from 'graphql'
import {GraphQLObjectType, GraphQLList} from 'graphql/type'

export default new GraphQLObjectType({
  name: 'CandidateGoal',
  description: 'A potential Goal that may become a Project in the next Cycle',
  fields: () => {
    const {Goal, MemberGoalRank} = require('src/server/graphql/schemas')

    return {
      goal: {type: new GraphQLNonNull(Goal), description: 'The Goal'},
      memberGoalRanks: {type: new GraphQLList(MemberGoalRank), description: 'Members and their ranks for a particular Goal'},
    }
  },
})
