import {GraphQLError} from 'graphql/error'
import config from 'src/config'

import {parseQueryError} from 'src/server/util/error'

export {default as GraphQLPhoneNumber} from './GraphQLPhoneNumber'

export function handleError(unparsedError, defaultMsg) {
  const err = parseQueryError(unparsedError)
  if (err.name === 'LGBadRequestError' || err.name === 'LGCustomQueryError') {
    throw err
  }
  throw new GraphQLError(defaultMsg || err.message || err)
}

export function pruneAutoLoad(loadedModules) {
  if (!loadedModules) {
    return
  }
  return Object.keys(loadedModules).reduce((result, name) => {
    if (!name.startsWith('_') && name !== 'index') {
      result[name] = loadedModules[name]
    }
    return result
  }, {})
}

export function instrumentResolvers(fields, prefix) {
  if (!config.server.newrelic.enabled) {
    return fields
  }
  const newrelic = require('newrelic')

  return Object.entries(fields).map(([queryName, schema]) => {
    const originalResolver = schema.resolve
    return {
      [queryName]: {
        ...schema,
        resolve: (...args) => {
          newrelic.setTransactionName(`graphql ${prefix} ${queryName}`)
          return originalResolver(...args)
        }
      }
    }
  }).reduce((result, next) => ({...result, ...next}), {})
}
