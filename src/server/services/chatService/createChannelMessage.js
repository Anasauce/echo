import {apiFetch} from './util'
import {getChannelId} from './cache'

export default async function createChannelMessage(channelName, msg) {
  const channelId = await getChannelId(channelName)

  const result = await apiFetch('/api/chat.postMessage', {
    method: 'POST',
    body: {
      channel: channelId,
      text: msg,
      as_user: true, // eslint-disable-line camelcase
    },
  })

  return result.channel
}
