import config from 'src/config'
import getPlayerInfo from 'src/server/actions/getPlayerInfo'
import {LGBadRequestError} from 'src/server/util/error'

export default async function sendProjectWelcomeMessages(project, options = {}) {
  const {Phase, Project} = require('src/server/services/dataService')
  const chatService = require('src/server/services/chatService')

  project = typeof project === 'string' ? await Project.get(project).getJoin({phase: true}) : project
  if (!project) {
    throw new LGBadRequestError(`Project ${project} not found; initialization aborted`)
  }

  const phase = project.phase || (project.phaseId ? await Phase.get(project.phaseId) : null)
  if (!phase) {
    console.log(`Project welcome message skipped for ${project.name}; phase not found`)
    return
  }

  const projectMembers = options.members || await getPlayerInfo(project.playerIds)
  const projectMemberHandles = projectMembers.map(u => u.handle)
  const message = phase.hasVoting === true ?
    _buildGoalProjectMessage(project, projectMembers) :
    _buildPhaseProjectMessage(project, phase)

  try {
    await chatService.sendDirectMessage(projectMemberHandles, message)
  } catch (err) {
    console.warn(err)
  }
}

function _buildPhaseProjectMessage(project, phase) {
  return `
🎊 *You're in Phase ${phase.number} this week!* 🎊

You should find everything you need to guide you in your work at the resources below:

• <${config.server.curriculum.baseURL}|Guild Curriculum>
• <${config.server.guide.baseURL}|Learner Guide>
`
}

function _buildGoalProjectMessage(project, projectMembers) {
  const goalLink = `<${project.goal.url}|${project.goal.number}: ${project.goal.title}>`
  const teamMembers = (projectMembers.length > 1 ? `
*Your team is:*
${projectMembers.map(u => `• _${u.name}_ - @${u.handle}`).join('\n  ')}
` : '')

  return `
🎊 *Welcome to the ${project.name} project!* 🎊
${teamMembers}
*Your goal is:* ${goalLink}

*Time to start work on your project!*

>The first step is to create an appropriate project artifact.
>Once you've created the artifact, connect it to your project with the \`/project set-artifact\` command.

Run \`/project set-artifact --help\` for more guidance.`
}
