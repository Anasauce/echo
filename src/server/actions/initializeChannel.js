export default async function initializeChannel(name, {topic, users}) {
  const chatService = require('src/server/services/chatService')

  try {
    await chatService.createChannel(name)

    try {
      await chatService.setChannelTopic(name, topic)
    } catch (err) {
      if (_isNotFoundError(err)) {
        console.log(`New channel ${name} not found; attempting to set topic again`)
        await chatService.setChannelTopic(name, topic)
      } else {
        console.error('Channel set topic error:', err)
        throw err
      }
    }
  } catch (err) {
    if (_isDuplicateChannelError(err)) {
      console.log(`Channel ${name} already exists`)
    } else {
      console.error('Channel create error:', err)
      throw err
    }
  }

  if (Array.isArray(users) && users.length > 0) {
    await chatService.inviteToChannel(name, users)
  }
}

function _isDuplicateChannelError(error) {
  return (error.message || '').includes('name_taken')
}

function _isNotFoundError(error) {
  return (error.message || '').includes('channel_not_found')
}
