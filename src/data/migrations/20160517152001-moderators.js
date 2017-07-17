import config from 'src/config'

const createOptions = config.server.rethinkdb.tableCreation

export function up(r, conn) {
  return Promise.all([
    r.tableCreate('moderators', createOptions)
      .run(conn)
      .then(() => {
        return r.table('moderators').indexCreate('chapterId').run(conn)
      }),
  ])
}

export function down(r, conn) {
  return Promise.all([
    r.tableDrop('players').run(conn),
  ])
}
