import r from '../r'

export default function changefeedForCycleStateChanged() {
  return r.table('cycles').changes()
    .filter(
      r.row('old_val').eq(null)  // new rows
        .or(r.row('new_val')('state').ne(r.row('old_val')('state')))  // state changes
    )
}
