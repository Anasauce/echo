import {apiFetch} from './util'

export default function createChannel(channelName) {
  return apiFetch('/api/channels.create', {
    method: 'POST',
    body: {name: channelName},
  })
}
