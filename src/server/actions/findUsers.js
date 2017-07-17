import config from 'src/config'
import mergeUsers from 'src/server/actions/mergeUsers'
import graphQLFetcher from 'src/server/util/graphql'

const defaultIdmFields = [
  'id', 'name', 'handle', 'email', 'phone', 'avatarUrl',
  'profileUrl', 'timezone', 'active', 'roles', 'inviteCode'
]

export default function findUsers(identifiers, options) {
  if (Array.isArray(identifiers) && identifiers.length === 0) {
    return []
  }

  const {idmFields = defaultIdmFields, join} = options || {}
  const queryFields = Array.isArray(idmFields) ? idmFields.join(', ') : idmFields

  return graphQLFetcher(config.server.idm.baseURL)({
    query: `query ($identifiers: [String]) {findUsers(identifiers: $identifiers) {${queryFields}}}`,
    variables: {identifiers},
  })
  .then(result => mergeUsers(result.data.findUsers || [], {skipNoMatch: true, join}))
}
