import formEncode from 'form-urlencoded'

import config from 'src/config'
import {apiFetch as utilApiFetch, APIError} from 'src/server/util/api'

export function usernameFor(handle) {
  return handle.toLowerCase().slice(0, 21)
}

export function apiURL(path) {
  return `${config.server.chat.baseURL}${path}`
}

export function scimApiURL(path) {
  return `${config.server.chat.scimApiURL}${path}`
}

export function headers(additional = {}) {
  const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
  }
  return {...defaultHeaders, ...additional}
}

export function apiGet(path, options = {}) {
  const url = `${apiURL(path)}?token=${config.server.chat.token}`
  const allHeaders = headers(options.headers)
  const allOptions = {
    ...options,
    headers: allHeaders,
  }
  return _apiFetch(url, allOptions)
}

export function apiFetch(path, options = {}) {
  const url = apiURL(path)
  const body = formEncode({
    ...options.body,
    token: config.server.chat.token,
  })
  const allHeaders = headers(options.headers)
  const allOptions = {
    ...options,
    headers: allHeaders,
    body,
  }
  return _apiFetch(url, allOptions)
}

function _apiFetch(url, options) {
  return utilApiFetch(url, options)
    .then(result => {
      if (!result.ok) {
        throw new APIError(500, result.error, url, result)
      }
      return result
    })
}
