import {REFLECTION, PRACTICE} from 'src/common/models/cycle'
import {r, getLatestCycleForChapter} from 'src/server/services/dataService'

export default async function findActiveProjectsForChapter(chapterId, options = {}) {
  const latestCycle = await getLatestCycleForChapter(chapterId, {default: null})
  const activeProjects = latestCycle && (latestCycle.state === PRACTICE || latestCycle.state === REFLECTION) ?
    r.table('projects').filter({chapterId, cycleId: latestCycle.id}) :
    null

  if (options.count) {
    return activeProjects ? activeProjects.count() : null
  }
  return activeProjects || []
}
