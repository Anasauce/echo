export async function up(r, conn) {
  await r.table('questions')
    .update(row => ({
      feedbackTypeId: row('statId'),
    }))
    .run(conn)

  await r.table('questions')
    .replace(row => (
      row.without('statId')
    ))
    .run(conn)
}

export async function down(r, conn) {
  await r.table('questions')
    .update(row => ({
      statId: row('feedbackTypeId'),
    }))
    .run(conn)

  await r.table('questions')
    .replace(row => (
      row.without('feedbackTypeId')
    ))
    .run(conn)
}
