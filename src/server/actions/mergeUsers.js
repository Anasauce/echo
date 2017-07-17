import {Moderator, Member} from 'src/server/services/dataService'
import {mapById} from 'src/server/util'
import {LGBadRequestError} from 'src/server/util/error'

export default async function mergeUsers(users, options) {
  if (!Array.isArray(users)) {
    throw new LGBadRequestError('Invalid users input:', users)
  }
  if (users.length === 0) {
    return []
  }

  const {skipNoMatch, join} = options || {}
  const userIds = users.map(u => u.id)
  const members = mapById(await _getAll(Member, userIds, {join}))
  const moderators = mapById(await _getAll(Moderator, userIds))

  return Object.values(users.reduce((result, user) => {
    const echoUser = members.get(user.id) || moderators.get(user.id)
    if (echoUser) {
      // only return in results if user has an echo account
      result[user.id] = Object.assign({}, user, echoUser)
    } else if (!skipNoMatch) {
      throw new LGBadRequestError(`User not found for id ${user.id}, user merge aborted`)
    }
    return result
  }, {}))
}

function _getAll(Model, ids, options = {}) {
  return options.join ?
    Model.getAll(...ids).getJoin(options.join) :
    Model.getAll(...ids)
}
