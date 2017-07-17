import {Pool} from 'src/server/services/dataService'
import createPoolsForCycle from 'src/server/actions/createPoolsForCycle'
import sendCycleInitializedAnnouncements from 'src/server/actions/sendCycleInitializedAnnouncements'

export function start() {
  const jobService = require('src/server/services/jobService')
  jobService.processJobs('cycleInitialized', processCycleInitialized)
}

export async function processCycleInitialized(cycle) {
  console.log(`Initializing cycle ${cycle.cycleNumber} of chapter ${cycle.chapterId}`)
  await _ensurePoolsExistForCycle(cycle)
  await sendCycleInitializedAnnouncements(cycle.id)
}

async function _ensurePoolsExistForCycle(cycle) {
  const cyclePools = await Pool.filter({cycleId: cycle.id})
  if (cyclePools.length === 0) {
    await createPoolsForCycle(cycle)
  }
}
