import r from '../r'

export default function findMembersInPool(poolId) {
  return r.table('poolMembers').filter({poolId})
    .eqJoin('memberId', r.table('members'))
    .map(join => join('right'))
}
