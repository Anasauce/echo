exports.up = function (r) {
  return r.table('responses').indexCreate('subjectId')
}

exports.down = function (r) {
  return r.table('responses').indexDrop('subjectId')
}
