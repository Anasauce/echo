import {COMPLETE} from 'src/common/models/cycle'
import logger from 'src/server/util/logger'
import getPlayerInfo from 'src/server/actions/getPlayerInfo'
import initializeChannel from 'src/server/actions/initializeChannel'
import sendProjectWelcomeMessages from 'src/server/actions/sendProjectWelcomeMessages'
import {LGBadRequestError} from 'src/server/util/error'

export default async function initializeProject(project) {
  const {Cycle, Phase, Project} = require('src/server/services/dataService')

  project = typeof project === 'string' ? await Project.get(project).getJoin({cycle: true, phase: true}) : project
  if (!project) {
    throw new LGBadRequestError(`Project ${project} not found; initialization aborted`)
  }

  const cycle = project.cycle || (await Cycle.get(project.cycleId))
  if (cycle.state === COMPLETE) {
    console.log(`Project initialization skipped for ${project.name}; cycle ${cycle.cycleNumber} is complete.`)
  }

  const phase = project.phase || (project.phaseId ? await Phase.get(project.phaseId) : null)
  if (!phase) {
    console.log(`Project initialization skipped for ${project.name}; no phase found`)
    return
  }

  logger.log(`Initializing project #${project.name}`)

  const members = await getPlayerInfo(project.playerIds)
  const memberHandles = members.map(p => p.handle)
  const channelName = String(project.goal.number)
  const channelTopic = project.goal.url

  await initializeChannel(channelName, {topic: channelTopic, users: memberHandles})
  await sendProjectWelcomeMessages(project, {members})
}
