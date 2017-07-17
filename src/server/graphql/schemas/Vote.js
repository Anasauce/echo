import {GraphQLNonNull, GraphQLID} from 'graphql'
import {GraphQLObjectType, GraphQLList} from 'graphql/type'
import {GraphQLDateTime} from 'graphql-custom-types'

export default new GraphQLObjectType({
  name: 'Vote',
  description: 'An expression of interest in working on a certain Goal as a Project in a Cycle',
  fields: () => {
    const {Goal, User, Cycle} = require('src/server/graphql/schemas')

    return {
      id: {type: new GraphQLNonNull(GraphQLID), description: 'The vote UUID'},
      member: {type: User, description: 'The Member who cast the Vote'},
      cycle: {type: Cycle, description: 'The Cycle '},
      goals: {type: new GraphQLList(Goal), description: 'The list of Goals, in order of preference'},
      createdAt: {type: new GraphQLNonNull(GraphQLDateTime), description: 'When this record was created'},
      updatedAt: {type: new GraphQLNonNull(GraphQLDateTime), description: 'When this record was last updated'},
    }
  },
})
