import config from 'src/config'

const createOptions = config.server.rethinkdb.tableCreation

export function up(r, conn) {
  return r.tableCreate('surveyBlueprints', createOptions).run(conn)
    .then(() => r.table('surveyBlueprints').indexCreate('descriptor').run(conn))
}

export function down(r, conn) {
  return Promise.all([
    r.tableDrop('surveyBlueprints').run(conn)
  ])
}
