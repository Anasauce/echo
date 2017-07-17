import {apiFetch} from './util'
import {getUserId} from './cache'

export default async function createDirectMessage(handleOrHandles, text) {
  const handles = Array.isArray(handleOrHandles) ? handleOrHandles : [handleOrHandles]
  const userIds = await Promise.all(handles.map(handle => getUserId(handle)))
  const channel = userIds.length > 1 ?
    (await _openMultiPartyDirectMessage(userIds)).group.id :
    (await _openDirectMessage(userIds[0])).channel.id

  const result = await apiFetch('/api/chat.postMessage', {
    method: 'POST',
    body: {
      channel,
      text,
      as_user: true, // eslint-disable-line camelcase
    },
  })

  return result.ok
}

function _openDirectMessage(userId) {
  return apiFetch('/api/im.open', {
    method: 'POST',
    body: {user: userId},
  })
}

function _openMultiPartyDirectMessage(userIds) {
  return apiFetch('/api/mpim.open', {
    method: 'POST',
    body: {
      users: userIds.join(',')
    }
  })
}
