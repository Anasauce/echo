import {GraphQLNonNull, GraphQLID} from 'graphql'
import {GraphQLObjectType, GraphQLList} from 'graphql/type'

export default new GraphQLObjectType({
  name: 'CycleVotingResults',
  description: 'Results on goal voting for a given cycle',
  fields: () => {
    const {Cycle, VotingPoolResults} = require('src/server/graphql/schemas')

    return {
      id: {type: new GraphQLNonNull(GraphQLID), description: 'The id for these results, currently just the string CURRENT'},
      cycle: {type: Cycle, description: 'The cycle'},
      pools: {type: new GraphQLList(VotingPoolResults), description: 'The voting results for each pool in the given cycle'},
    }
  },
})
