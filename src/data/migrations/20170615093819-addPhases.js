import config from 'src/config'

const createOptions = config.server.rethinkdb.tableCreation

export function up(r) {
  return r.tableCreate('phases', createOptions)
}

export function down(r) {
  return r.tableDrop('phases')
}
