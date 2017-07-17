import {GraphQLEnumType} from 'graphql/type'

export default new GraphQLEnumType({
  name: 'ResponseTypeEnum',
  values: {
    relativeContribution: {description: 'A multipart response whose values must add up to 100%'},
    text: {description: 'A free form text response'},
    likert7Agreement: {description: 'A 0-7 Likert Agreement Scale Response'},
    numeric: {description: 'An numeric response.'},
    percentage: {description: 'An percentage response.'},
  }
})
