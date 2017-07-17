/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */

import getOwnerAndRepoFromGitHubURL from 'src/common/util/getOwnerAndRepoFromGitHubURL'

describe(testContext(__filename), function () {
  it('returns object with "owner" and "repo" attributes for valid GitHub repository URL', function () {
    const ghURL = 'https://github.com/LearnersGuild/learning-os-software'
    const {owner, repo} = getOwnerAndRepoFromGitHubURL(ghURL)

    expect(owner).to.equal('LearnersGuild')
    expect(repo).to.equal('learning-os-software')
  })

  it('throws an exception for invalid GitHub repository URL', function () {
    expect(() => {
      const ghURL = 'https://github.com/LearnersGuild'
      getOwnerAndRepoFromGitHubURL(ghURL)
    }).to.throw()

    expect(() => {
      const ghURL = 'https://google.com/abc/def'
      getOwnerAndRepoFromGitHubURL(ghURL)
    }).to.throw()
  })
})
