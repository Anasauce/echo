import {apiFetch} from './util'
import {getChannelId, getUserId} from './cache'

export default function inviteToChannel(channelName, userHandles) {
  const promises = userHandles.map(userHandle => _inviteUserToChannel(channelName, userHandle))
  return Promise.all(promises)
}

async function _inviteUserToChannel(channelName, userHandle) {
  const channelId = await getChannelId(channelName)
  const userId = await getUserId(userHandle)
  const body = {
    channel: channelId,
    user: userId,
  }
  const result = await apiFetch('/api/channels.invite', {
    method: 'POST',
    body,
  }).catch(err => {
    // ignore errors if user is already in channel
    if (!err.message.includes('already_in_channel')) {
      throw err
    }
    return {ok: true, channel: {id: channelId, name: channelName}}
  })
  return result.channel
}
