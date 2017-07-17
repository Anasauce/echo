import r from '../r'

export default function getPoolSize(poolId) {
  return r.table('poolMembers').filter({poolId}).count()
}
