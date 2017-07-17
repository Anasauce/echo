import config from 'src/config'

const createOptions = config.server.rethinkdb.tableCreation

export function up(r, conn) {
  return r.tableCreate('projects', createOptions)
    .run(conn)
    .then(() => r.table('projects').indexCreate('chapterId').run(conn))
    .then(() => r.table('projects').indexCreate('name').run(conn))
}

export function down(r, conn) {
  return Promise.all([
    r.tableDrop('projects').run(conn),
  ])
}
