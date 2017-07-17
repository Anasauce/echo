export async function up(r, conn) {
  await r.table('playersPools')
    .config()
    .update({name: 'poolMembers'})
    .run(conn)

  await r.table('poolMembers')
    .indexDrop('playerId')
    .run(conn)

  await r.table('poolMembers')
    .update(row => ({memberId: row('playerId')}))
    .run(conn)

  await r.table('poolMembers')
    .replace(row => row.without('playerId'))
    .run(conn)

  await r.table('poolMembers')
    .indexCreate('memberId')
}

export async function down(r, conn) {
  await r.table('poolMembers')
    .config()
    .update({name: 'playersPools'})
    .run(conn)

  await r.table('playersPools')
    .indexDrop('memberId')
    .run(conn)

  await r.table('playersPools')
    .update(row => ({playerId: row('memberId')}))
    .run(conn)

  await r.table('playersPools')
    .replace(row => row.without('playerId'))
    .run(conn)

  await r.table('playersPools')
    .indexCreate('playerId')
    .run(conn)
}
