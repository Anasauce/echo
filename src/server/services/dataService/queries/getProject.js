import r from '../r'

export default function getProject(identifier) {
  const identifierLower = String(identifier).toLowerCase()
  return r.table('projects').filter(row => r.or(
    row('id').eq(identifier),
    row('name').downcase().eq(identifierLower)
  ))
  .nth(0)
  .default(null)
}
