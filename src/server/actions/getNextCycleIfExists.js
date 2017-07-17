import {r, errors, Cycle} from 'src/server/services/dataService'

export default function getNextCycleIfExists(cycle) {
  return Cycle
    .filter(_ => _('createdAt').gt(cycle.createdAt))
    .orderBy(r.asc('createdAt'))
    .nth(0)
    .catch(errors.DocumentNotFound, _ => null)
}
