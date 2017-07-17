import r from '../r'

export default function changefeedForSurveySubmitted() {
  return r.table('surveys').changes()
    .filter(
      r.and(
        r.row('old_val').eq(null).not(),
        r.row('new_val')('completedBy').default([]).count().default(0)
          .gt(r.row('old_val')('completedBy').default([]).count().default(0))
      )
    )
}
