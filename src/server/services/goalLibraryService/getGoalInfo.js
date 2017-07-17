import url from 'url'

import config from 'src/config'
import {goalFromMetadata} from 'src/common/models/goal'
import {apiFetchRaw, APIError} from 'src/server/util/api'

import {apiURL, headers} from './util'

export default function getGoalInfo(goalDescriptor) {
  const goalMetadataURL = _goalMetadataURL(goalDescriptor)
  if (!goalMetadataURL) {
    return Promise.resolve(null)
  }

  return apiFetchRaw(goalMetadataURL, {headers: headers()})
    .then(resp => {
      if (!resp.ok) {
        // if no goal metadata is found at the given URL, return null
        if (resp.status === 404) {
          return null
        }
        throw new APIError(resp.status, resp.statusText, goalMetadataURL)
      }
      return resp.json()
    })
    // if no goal metadata is found at the given URL, return null
    .then(goalMetadata => goalMetadata ? goalFromMetadata(goalMetadata) : null)
}

function _goalMetadataURL(goalDescriptor) {
  goalDescriptor = String(goalDescriptor)
  const goalURLParts = url.parse(goalDescriptor)
  if (goalURLParts.protocol) {
    // see: http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
    const escapedGoalLibraryURL = config.server.goalLibrary.baseURL.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&')
    const goalURLRegex = new RegExp(`^${escapedGoalLibraryURL}/goals/(\\d+)`)
    const descriptorParts = goalDescriptor.match(goalURLRegex)
    const goalNumber = descriptorParts ? descriptorParts[1] : null
    if (goalNumber) {
      return apiURL(`/goals/${goalNumber}.json`)
    }
  } else if (goalDescriptor.match(/^\d+$/)) {
    return apiURL(`/goals/${goalDescriptor}.json`)
  }
}
