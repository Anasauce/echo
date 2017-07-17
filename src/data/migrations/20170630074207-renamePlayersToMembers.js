export async function up(r, conn) {
  await r.table('players')
    .config()
    .update({name: 'members'})

  await r.table('projects')
    .update(row => ({memberIds: row('playerIds')}))
    .run(conn)

  await r.table('projects')
    .replace(row => row.without('playerIds'))
    .run(conn)

  await r.table('votes')
    .indexDrop('playerIdAndPoolId')
    .run(conn)

  await r.table('votes')
    .indexCreate('memberIdAndPoolId', [r.row('memberId'), r.row('poolId')])
    .run(conn)

  await r.table('votes')
    .update(row => ({memberId: row('playerId')}))
    .run(conn)

  await r.table('votes')
    .replace(row => row.without('playerId'))
    .run(conn)
}

export async function down(r, conn) {
  await r.table('members')
    .config()
    .update({name: 'players'})

  await r.table('projects')
    .update(row => ({playerIds: row('memberIds')}))
    .run(conn)

  await r.table('projects')
    .replace(row => row.without('memberIds'))
    .run(conn)

  await r.table('votes')
    .indexDrop('memberIdAndPoolId')
    .run(conn)

  await r.table('votes')
    .indexCreate('playerIdAndPoolId', [r.row('playerId'), r.row('poolId')])
    .run(conn)

  await r.table('votes')
    .update(row => ({playerId: row('memberId')}))
    .run(conn)

  await r.table('votes')
    .replace(row => row.without('memberId'))
    .run(conn)
}
