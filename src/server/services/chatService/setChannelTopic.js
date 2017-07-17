import {apiFetch} from './util'
import {getChannelId} from './cache'

export default async function setChannelTopic(channelName, topic = '') {
  const channelId = await getChannelId(channelName)
  return apiFetch('/api/channels.setTopic', {
    method: 'POST',
    body: {
      channel: channelId,
      topic,
    },
  })
}
