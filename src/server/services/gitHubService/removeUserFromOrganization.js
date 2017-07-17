import {apiFetch} from 'src/server/util/api'
import {apiURL, headers} from './util'

export default function removeUserFromOrganization(username, organization) {
  const removeFromOrganizationURL = apiURL(`/orgs/${organization}/members/${username}`)
  return apiFetch(removeFromOrganizationURL, {method: 'DELETE', headers: headers()})
    .then(() => true)
}
