export function up(r) {
  return r.table('phases').indexCreate('number')
}

export function down(r) {
  return r.table('phases').indexDrop('number')
}

