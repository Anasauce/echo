import sendCycleCompleteAnnouncements from 'src/server/actions/sendCycleCompleteAnnouncements'

export function start() {
  const jobService = require('src/server/services/jobService')
  jobService.processJobs('cycleCompleted', processCycleCompleted)
}

export async function processCycleCompleted(cycle) {
  console.log(`Completing cycle ${cycle.cycleNumber} of chapter ${cycle.chapterId}`)
  await sendCycleCompleteAnnouncements(cycle.id)
}
