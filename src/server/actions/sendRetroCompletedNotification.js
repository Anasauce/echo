import config from 'src/config'
import getMemberInfo from 'src/server/actions/getMemberInfo'
import {Member} from 'src/server/services/dataService'

export default async function sendRetroCompletedNotification(project) {
  const chatService = require('src/server/services/chatService')

  const projectMembers = await Member.getAll(...project.memberIds)
  const projectMemberUsers = await getMemberInfo(project.memberIds)
  const members = _mergeMemberUsers(projectMembers, projectMemberUsers)

  return Promise.all(members.map(member => {
    const retroNotificationMessage = _compileMemberNotificationMessage(member, project)

    return chatService.sendDirectMessage(member.handle, retroNotificationMessage).catch(err => {
      console.error(`\n\nThere was a problem while sending a retro notification to member @${member.handle}`)
      console.error('Error:', err, err.stack)
      console.error(`Message: "${retroNotificationMessage}"`)
    })
  }))
}

function _mergeMemberUsers(members, users) {
  const combined = new Map()

  members.forEach(member => combined.set(member.id, Object.assign({}, member)))

  users.forEach(user => {
    const values = combined.get(user.id)
    if (values) {
      combined.set(user.id, Object.assign({}, values, user))
    }
  })

  return Array.from(combined.values())
}

function _compileMemberNotificationMessage(member, project) {
  return (
    `**RETROSPECTIVE COMPLETE:**

    [View Project: ${project.name}](${config.app.baseURL}/projects/${project.name})`
  )
}
