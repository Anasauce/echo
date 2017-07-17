import r from '../r'

const table = r.table('projects')

export default function findProjects(filter) {
  if (!filter) {
    return table
  }
  if (Array.isArray(filter)) {
    return table
      .getAll(...filter)
      .union(
        table.getAll(...filter, {index: 'name'})
      )
      .distinct()
  }
  return table.filter(filter)
}
