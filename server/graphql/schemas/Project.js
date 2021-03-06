import {GraphQLNonNull, GraphQLID, GraphQLString} from 'graphql'
import {GraphQLURL, GraphQLDateTime} from 'graphql-custom-types'
import {GraphQLObjectType, GraphQLList} from 'graphql/type'

import {
  resolveChapter,
  resolveCycle,
  resolvePhase,
  resolveProjectGoal,
  resolveProjectPlayers,
} from 'src/server/graphql/resolvers'

export default new GraphQLObjectType({
  name: 'Project',
  description: 'A project engaged in by learners to complete some goal',
  fields: () => {
    const {Chapter, Cycle, Goal, Phase, UserProfile} = require('src/server/graphql/schemas')

    return {
      id: {type: new GraphQLNonNull(GraphQLID), description: "The project's UUID"},
      name: {type: new GraphQLNonNull(GraphQLString), description: 'The project name'},
      chapterId: {type: new GraphQLNonNull(GraphQLID), description: "The chapter's UUID"},
      chapter: {type: Chapter, description: 'The chapter', resolve: resolveChapter},
      cycleId: {type: new GraphQLNonNull(GraphQLID), description: "The cycle's UUID"},
      cycle: {type: Cycle, description: 'The cycle', resolve: resolveCycle},
      phaseId: {type: GraphQLID, description: "The phase's UUID"},
      phase: {type: Phase, description: 'The phase', resolve: resolvePhase},
      goal: {type: Goal, description: 'The project goal', resolve: resolveProjectGoal},
      playerIds: {type: new GraphQLList(GraphQLID), description: 'The project member UUIDs'},
      players: {type: new GraphQLList(UserProfile), description: 'The project members', resolve: resolveProjectPlayers},
      artifactURL: {type: GraphQLURL, description: 'The URL pointing to the output of this project'},
      retrospectiveSurveyId: {type: GraphQLID, description: "The retrospective survey's UUID"},
      createdAt: {type: new GraphQLNonNull(GraphQLDateTime), description: 'When this record was created'},
      updatedAt: {type: new GraphQLNonNull(GraphQLDateTime), description: 'When this record was last updated'},
    }
  },
})
