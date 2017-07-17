import {GraphQLNonNull, GraphQLID, GraphQLString} from 'graphql'
import {GraphQLObjectType} from 'graphql/type'

export default new GraphQLObjectType({
  name: 'MemberSubject',
  description: 'A member that is the subject of a question',
  fields: () => {
    return {
      id: {type: new GraphQLNonNull(GraphQLID), description: 'The member\'s UUID'},
      name: {type: new GraphQLNonNull(GraphQLString), description: 'The member\'s name'},
      handle: {type: new GraphQLNonNull(GraphQLString), description: 'The member\'s handle'},
      profileUrl: {type: GraphQLString, description: 'The member\'s profile URL'},
      avatarUrl: {type: GraphQLString, description: 'The member\'s avatar URL'},
    }
  },
})
