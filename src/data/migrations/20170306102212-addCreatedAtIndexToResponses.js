exports.up = function (r) {
  return r.table('responses').indexCreate('createdAt')
}

exports.down = function (r) {
  return r.table('responses').indexDrop('createdAt')
}
