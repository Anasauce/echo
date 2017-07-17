import r from '../r'
import {customQueryError} from '../util'

export default function getPoolByCycleIdAndMemberId(cycleId, memberId, {returnNullIfNoneFound = false} = {}) {
  return r.table('pools').filter({cycleId})
    .eqJoin('id', r.table('poolMembers'), {index: 'poolId'})
    .filter(row => row('right')('memberId').eq(memberId))
    .merge(row => row('left'))
    .nth(0)
    .default(
      returnNullIfNoneFound ?
        null :
        customQueryError(`This member (${memberId}) was not in any pools this cycle (${cycleId})`)
    )
}
