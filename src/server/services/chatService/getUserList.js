import {apiGet} from './util'

export default function getUserList() {
  return apiGet('/api/users.list')
}
