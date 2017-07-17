import RethinkDBTerm from 'rethinkdbdash/lib/term'

import r from './r'

export function customQueryError(msg) {
  return r.error(`<LGCustomQueryError>${msg}</LGCustomQueryError>`)
}

export function isRethinkDBTerm(arg) {
  return arg instanceof RethinkDBTerm
}

export function updateInTable(record, table, options = {}) {
  const recordWithTimestamps = addTimestamps(record, 'updatedAt')
  return table
      .get(recordWithTimestamps.id)
      .update(recordWithTimestamps, options)
      .then(result => checkForWriteErrors(result))
}

export function updateAllInTable(records, table, options = {}) {
  return Promise.all(
    records.map(record => updateInTable(record, table, options))
  )
}

export function insertIntoTable(record, table, options = {}) {
  return insertAllIntoTable([record], table, options)
}

export function insertAllIntoTable(records, table, options = {}) {
  const recordsWithTimestamps = records.map(record => addTimestamps(record, ['createdAt', 'updatedAt']))
  return table.insert(recordsWithTimestamps, options)
    .then(result => checkForWriteErrors(result))
}

export function replaceInTable(record, table, options = {}) {
  const recordWithTimestamps = record.createdAt ?
    addTimestamps(record, 'updatedAt') :
    addTimestamps(record, ['createdAt', 'updatedAt'])

  return table.get(record.id)
    .replace(recordWithTimestamps, options)
    .then(result => checkForWriteErrors(result))
}

export function checkForWriteErrors(result) {
  if (result.errors > 0) {
    throw new Error(result.first_error)
  }
  return result
}

export function addTimestamps(obj = {}, fields) {
  const now = new Date()
  const timestampFields = Array.isArray(fields) ? fields : [fields]
  return timestampFields.reduce((result, field) => {
    result[field] = result[field] || now
    return result
  }, {...(obj || {})})
}
