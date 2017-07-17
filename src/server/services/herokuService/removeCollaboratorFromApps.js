export default function removeCollaboratorFromApps(user, apps) {
  const herokuService = require('src/server/services/herokuService')
  return Promise.all(
    apps.map(app => herokuService.removeCollaboratorFromApp(user, app))
  )
}
