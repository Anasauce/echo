import {r, errors, Cycle} from 'src/server/services/dataService'

export default function getPrevCycleIfExists(cycle) {
  return Cycle
    .filter(_ => _('createdAt').lt(cycle.createdAt))
    .orderBy(r.desc('createdAt'))
    .nth(0)
    .catch(errors.DocumentNotFound, _ => null)
}
