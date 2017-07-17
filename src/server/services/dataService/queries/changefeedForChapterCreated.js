import r from '../r'

export default function changefeedForChapterCreated() {
  return r.table('chapters').changes()
    .filter(r.row('old_val').eq(null))
}
