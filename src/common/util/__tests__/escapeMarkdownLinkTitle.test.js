/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */

import escapeMarkdownLinkTitle from '../escapeMarkdownLinkTitle'

describe(testContext(__filename), function () {
  it('converts square brackets to parentheses', function () {
    const linkTitle = 'Core Algorithms [Classic, Numeric, and Set]'
    const escapedTitle = escapeMarkdownLinkTitle(linkTitle)
    expect(escapedTitle).to.not.match(/\[.*\]/)
    expect(escapedTitle).to.match(/\(.*\)/)
  })
})
