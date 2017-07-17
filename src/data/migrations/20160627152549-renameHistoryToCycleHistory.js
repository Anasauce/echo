export function up(r, conn) {
  return r.table('projects').replace(
    r.row.merge(row => ({
      cycleHistory: row('history')
    })).without('history')
  ).run(conn)
}

export function down(r, conn) {
  return r.table('projects').replace(
    r.row.merge(row => ({
      history: row('cycleHistory')
    })).without('cycleHistory')
  ).run(conn)
}
