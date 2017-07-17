import Promise from 'bluebird'
import config from 'src/config'
import {Cycle, Phase} from 'src/server/services/dataService'

export default async function sendCycleInitializedAnnouncements(cycleId) {
  const [cycle, phases] = await Promise.all([
    await Cycle.get(cycleId),
    await Phase.filter({hasVoting: true}),
  ])
  await Promise.each(phases, phase => _sendAnnouncementToPhase(cycle, phase))
}

async function _sendAnnouncementToPhase(cycle, phase) {
  const chatService = require('src/server/services/chatService')

  try {
    await chatService.sendChannelMessage(phase.channelName, _buildAnnouncement(cycle))
  } catch (err) {
    console.warn(`Failed to send cycle init announcement to Phase ${phase.number} for cycle ${cycle.cycleNumber}: ${err}`)
  }
}

function _buildAnnouncement(cycle) {
  const banner = `🗳 *Voting is now open for cycle ${cycle.cycleNumber}*.`
  const votingInstructions = `Have a look at <${config.server.goalLibrary.baseURL}|the goal library>, then to get started check out \`/vote --help.\``
  const announcement = [banner, votingInstructions].join('\n')
  return announcement
}
