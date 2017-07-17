import initializeProject from 'src/server/actions/initializeProject'

export function start() {
  const jobService = require('src/server/services/jobService')
  jobService.processJobs('projectCreated', processProjectCreated)
}

export async function processProjectCreated(project) {
  await initializeProject(project)
}
