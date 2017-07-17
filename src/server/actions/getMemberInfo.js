import config from 'src/config'
import graphQLFetcher from 'src/server/util/graphql'

export default function getMemberInfo(memberIds) {
  return graphQLFetcher(config.server.idm.baseURL)({
    query: 'query ($memberIds: [ID]!) { getUsersByIds(ids: $memberIds) { id active handle email name roles profileUrl } }',
    variables: {memberIds},
  }).then(result => result ? result.data.getUsersByIds : null)
}
