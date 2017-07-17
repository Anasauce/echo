import r from '../r'

export default function changefeedForVoteSubmitted() {
  return r.table('votes').changes()
    .filter(r.row('new_val')('pendingValidation').eq(true))
}
