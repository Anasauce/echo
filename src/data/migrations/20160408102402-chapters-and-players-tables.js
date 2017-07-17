import config from 'src/config'

const createOptions = config.server.rethinkdb.tableCreation

export function up(r, conn) {
  return Promise.all([
    r.tableCreate('chapters', createOptions)
      .run(conn)
      .then(() => {
        return Promise.all([
          r.table('chapters').indexCreate('channelName').run(conn),
          r.table('chapters').indexCreate('inviteCodes', {multi: true}).run(conn),
        ])
      }),
    r.tableCreate('players', createOptions)
      .run(conn)
      .then(() => {
        return r.table('players').indexCreate('chapterId').run(conn)
      }),
  ])
}

export function down(r, conn) {
  return Promise.all([
    r.tableDrop('players').run(conn),
    r.tableDrop('chapters').run(conn),
  ])
}
