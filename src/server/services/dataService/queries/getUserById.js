import r from '../r'

export default function getUserById(id, options = {}) {
  return r.or(
    _getUser(r.table('members'), id, options),
    _getUser(r.table('moderators'), id, options)
  )
}

function _getUser(table, id, queryOptions) {
  const options = Object.assign({
    mergeChapter: false,
  }, queryOptions || {})
  const user = table.get(id)
  return r.branch(
    user.eq(null),
    user,
    options.mergeChapter ?
      user
        .merge({chapter: r.table('chapters').get(r.row('chapterId'))})
        .without('chapterId') :
      user
  )
}
