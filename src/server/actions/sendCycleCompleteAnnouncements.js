import Promise from 'bluebird'
import {Cycle, Phase} from 'src/server/services/dataService'

export default async function sendCycleCompleteAnnouncements(cycleId) {
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
    console.warn(`Failed to send cycle complete announcement to Phase ${phase.number} for cycle ${cycle.cycleNumber}: ${err}`)
  }
}

function _buildAnnouncement(cycle) {
  return `✅ *Cycle ${cycle.cycleNumber} is complete*.`
}
