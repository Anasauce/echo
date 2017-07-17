import {apiFetch} from './util'
import {getChannelId} from './cache'

export default async function deleteChannel(channel) {
  const channelId = await getChannelId(channel)
  const result = await apiFetch('/api/channels.archive', {
    method: 'POST',
    body: {channel: channelId},
  })
  return result.ok
}
