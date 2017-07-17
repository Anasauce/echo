import config from 'src/config'

export function apiURL(path) {
  return `${config.server.goalLibrary.baseURL}/api${path}`
}

export function headers(additional = {}) {
  const defaultHeaders = {
    Accept: 'application/json',
  }
  return {...defaultHeaders, ...additional}
}
