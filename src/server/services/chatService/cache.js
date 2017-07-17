import cacheManager from 'cache-manager'

import getChannelList from './getChannelList'
import getUserList from './getUserList'
import {usernameFor} from './util'

const memoryCache = cacheManager.caching({
  store: 'memory',
  ttl: 5 * 60, // seconds
})

export async function getUserId(userHandle) {
  const userIdMap = await _getUserIdMap()
  return userIdMap.get(usernameFor(userHandle))
}

export async function getChannelId(channelName) {
  const channelIdMap = await _getChannelIdMap()
  return channelIdMap.get(channelName)
}

function _getUserIdMap() {
  return memoryCache.wrap('userIdMap', () => {
    return _getUserIdMapUncached()
  })
}

function _getChannelIdMap() {
  return memoryCache.wrap('channelIdMap', () => {
    return _getChannelIdMapUncached()
  })
}

async function _getUserIdMapUncached() {
  return await _getIdMapUncached(getUserList, 'members')
}

async function _getChannelIdMapUncached() {
  return await _getIdMapUncached(getChannelList, 'channels')
}

async function _getIdMapUncached(getListFromAPI, attrName) {
  const apiResult = await getListFromAPI()
  const list = apiResult[attrName]
  const map = list.reduce((result, {id, name}) => {
    result.set(name, id)
    return result
  }, new Map())
  return map
}
