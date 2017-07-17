export function up(r, conn) {
  return Promise.all([
    r.table('votes').indexCreate('cycleId').run(conn),
  ])
}

export function down(r, conn) {
  return Promise.all([
    r.table('votes').indexDrop('cycleId').run(conn),
  ])
}
