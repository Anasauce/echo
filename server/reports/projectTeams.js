import {STAT_DESCRIPTORS} from 'src/common/models/stat'
import {getPoolByCycleIdAndPlayerId, r} from 'src/server/services/dataService'
import {
  getChapterId,
  getCycleId,
  writeCSV,
  getPlayerInfoByIds,
  parseCycleReportArgs,
} from './util'

export default function requestHandler(req, res) {
  return runReport(req.query, res)
    .then(result => writeCSV(result, res))
}

export async function runReport(args) {
  const options = parseCycleReportArgs(args)
  const {cycleNumber, chapterName} = options
  let {chapterId} = options

  if (!chapterId) {
    chapterId = await getChapterId(chapterName)
  }
  const cycleId = await getCycleId(chapterId, cycleNumber)

  const playerIds = await r.table('players').filter({chapterId})('id')
  const playerInfo = await getPlayerInfoByIds(playerIds)

  const query = r.expr(playerInfo).do(playerInfoExpr => {
    const getInfo = id => playerInfoExpr(id).default({id, name: '?', email: '?', handle: '?'})
    return r.table('projects')
      .filter({chapterId})
      .merge(row => ({projectName: row('name')}))
      .filter(row => row('cycleId').eq(cycleId))
      .concatMap(row => row('playerIds')
          .map(id => getInfo(id))
          .merge(_mergeStats)
          .merge(_mergePoolName(cycleId))
          .merge({
            cycleNumber,
            cycleId,
            projectName: row('projectName'),
            goalNum: row('goal')('url').split('/').nth(-1),
            goalTitle: row('goal')('title'),
            goalRecommendedTeamSize: row('goal')('teamSize'),
            goalLevel: row('goal')('level')
          })
      )
      .merge(row => {
        const goals = _findVotesForCycle(cycleId, {playerId: row('id')}).nth(0).default({})('goals').default([{url: ''}, {url: ''}])
        return {
          firstVote: goals.nth(0)('url').split('/').nth(-1),
          secondVote: goals.nth(1)('url').split('/').nth(-1).default(null),
        }
      })
      .merge(row => ({
        gotVote: r.branch(
          row('goalNum').eq(row('firstVote')), '1st',
          row('goalNum').eq(row('secondVote')), '2nd',
          'NONE'
        )
      }))
      .merge(row => ({playerId: row('id')})).without('id')
      .orderBy('projectName')
      .execute()
  })

  return await query
}

function _mergePoolName(cycleId) {
  return row => ({
    poolName: getPoolByCycleIdAndPlayerId(cycleId, row('id'), {
      returnNullIfNoneFound: true
    }).default({name: 'n/a'})('name')
  })
}

function _mergeStats(row) {
  const stats = r.table('players').get(row('id'))('stats').default({[STAT_DESCRIPTORS.ELO]: {rating: 0}})
  return {
    elo: stats(STAT_DESCRIPTORS.ELO).default({rating: 0})('rating'),
    xp: stats(STAT_DESCRIPTORS.EXPERIENCE_POINTS).default(0),
    level: stats(STAT_DESCRIPTORS.LEVEL).default(0),
    levelV2: stats(STAT_DESCRIPTORS.LEVEL_V2).default(0),
  }
}

function _findVotesForCycle(cycleId, filters) {
  const poolIdsExpr = r.table('pools')
    .getAll(cycleId, {index: 'cycleId'})('id')
    .coerceTo('array')
  return r.table('votes')
    .getAll(r.args(poolIdsExpr), {index: 'poolId'})
    .filter(filters || {})
}
