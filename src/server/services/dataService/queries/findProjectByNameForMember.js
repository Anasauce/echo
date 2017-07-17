import r from '../r'
import {customQueryError} from '../util'

export default function findProjectByNameForMember(name, memberId) {
  const filter = project => r.and(
    project('name').eq(name),
    project('memberIds').contains(memberId)
  )
  return r.table('projects').filter(filter)
    .nth(0)
    .default(customQueryError(`Project ${name} not found`))
}
