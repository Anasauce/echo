export default function getOwnerAndRepoFromGitHubURL(ghURL) {
  const matches = ghURL.match(/github\.com\/(.+)\/(.+)/)
  if (!matches || !matches.length >= 2) {
    throw new Error(`Invalid GitHub repository URL: ${ghURL}`)
  }
  const [, owner, repo] = matches
  return {owner, repo}
}
