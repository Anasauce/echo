import r from '../r'

export default function findProjectsForUser(userId) {
  return r.table('projects').filter(project => (project('playerIds').contains(userId)))
}
