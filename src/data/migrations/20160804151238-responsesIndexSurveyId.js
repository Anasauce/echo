export function up(r, conn) {
  return r.table('responses')
    .indexCreate('surveyId')
    .run(conn)
}

export function down(r, conn) {
  return r.table('responses')
    .indexDrop('surveyId')
    .run(conn)
}
