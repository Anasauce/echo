import {GraphQLString, GraphQLNonNull, GraphQLID, GraphQLInt} from 'graphql'
import {GraphQLObjectType, GraphQLList} from 'graphql/type'
import {GraphQLDateTime} from 'graphql-custom-types'

import {
  resolveChapterLatestCycle,
  resolveChapterActiveProjectCount,
  resolveChapterActiveMemberCount,
} from 'src/server/graphql/resolvers'

export default new GraphQLObjectType({
  name: 'Chapter',
  description: 'A group of members in the same location',
  fields: () => {
    const {Cycle} = require('src/server/graphql/schemas')

    return {
      id: {type: new GraphQLNonNull(GraphQLID), description: 'The chapter UUID'},
      name: {type: new GraphQLNonNull(GraphQLString), description: 'The chapter name'},
      channelName: {type: new GraphQLNonNull(GraphQLString), description: 'The chat channel name'},
      timezone: {type: new GraphQLNonNull(GraphQLString), description: 'The user timezone'},
      githubTeamId: {type: GraphQLInt, description: 'The GitHub team id'},
      inviteCodes: {type: new GraphQLList(GraphQLString), description: 'The invite codes associated with this chapter'},
      latestCycle: {type: Cycle, resolve: resolveChapterLatestCycle, description: 'The latest cycle in the chapter'},
      activeProjectCount: {type: GraphQLInt, resolve: resolveChapterActiveProjectCount, description: 'The number of active projects associated with this chapter'},
      activeMemberCount: {type: GraphQLInt, resolve: resolveChapterActiveMemberCount, description: 'The number of active members associated with this chapter'},
      createdAt: {type: new GraphQLNonNull(GraphQLDateTime), description: 'When this record was created'},
      updatedAt: {type: new GraphQLNonNull(GraphQLDateTime), description: 'When this record was last updated'},
    }
  },
})
