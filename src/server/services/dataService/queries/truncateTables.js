import r from '../r'

export default function truncateTables() {
  return r.tableList()
    .then(tables => tables.filter(table => !table.startsWith('_')))
    .then(tablesToTruncate => Promise.all(tablesToTruncate.map(table => r.table(table).delete().run())))
}
