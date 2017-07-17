import {apiGet} from './util'

export default function getChannelList() {
  return apiGet('/api/channels.list')
}
