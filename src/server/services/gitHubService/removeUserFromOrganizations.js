export default function removeUserFromOrganizations(username, organizations) {
  const gitHubService = require('src/server/services/gitHubService')
  return Promise.all(
    organizations.map(organization =>
      gitHubService.removeUserFromOrganization(username, organization)
    )
  )
}
