/* eslint-disable no-console */
import socketClusterServer from 'socketcluster-server'

export default function configureSocketCluster(httpServer) {
  const scServer = socketClusterServer.attach(httpServer)

  scServer.on('connection', socket => {
    const clientId = socket.remoteAddress ? socket.remoteAddress : 'client'
    console.log(`${clientId} connected to socket`)
  })

  return scServer
}
