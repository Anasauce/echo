import config from 'src/config'

const createOptions = config.server.rethinkdb.tableCreation

export async function up(r, conn) {
  const reloadDefaultModelData = require('src/server/actions/reloadDefaultModelData')

  await r.tableCreate('feedbackTypes', createOptions).run(conn)
  await r.table('feedbackTypes').indexCreate('descriptor').run(conn)
  return reloadDefaultModelData()
}

export function down(r, conn) {
  return r.tableDrop('feedbackTypes').run(conn)
}
