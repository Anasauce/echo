import {apiFetch} from 'src/server/util/api'
import {apiURL, headers} from './util'

export default function removeCollaboratorFromApp(user, app) {
  const removeFromAppURL = apiURL(`/apps/${app}/collaborators/${user.email}`)
  return apiFetch(removeFromAppURL, {
    method: 'DELETE',
    headers: headers({'Content-Type': 'application/json'}),
    body: JSON.stringify({user}),
  })
    .then(() => true)
}
