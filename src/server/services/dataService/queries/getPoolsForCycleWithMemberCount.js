import r from '../r'

export default function getPoolsForCycleWithMemberCount(cycleId) {
  return r.table('pools').getAll(cycleId, {index: 'cycleId'})
    .map(pool => pool.merge({
      count: r.table('poolMembers').getAll(pool('id'), {index: 'poolId'}).count()
    }))
}
