/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */
import factory from 'src/test/factories'
import {resetDB} from 'src/test/helpers'
import getChapter from 'src/server/actions/getChapter'

import saveChapter from '../saveChapter'

describe(testContext(__filename), function () {
  beforeEach(resetDB)

  it('updates existing record when id provided', async function () {
    const chapter = await factory.create('chapter')
    const values = Object.assign({}, chapter, {name: 'newname'})
    await saveChapter(values)
    const updatedChapter = await getChapter(values.id)
    expect(updatedChapter.name).to.eq(values.name)
    expect(updatedChapter.channelName).to.eq(values.channelName)
  })

  it('creates a new chapter with provided id', async function () {
    const values = await factory.build('chapter')
    const notFoundChapter = await getChapter(values.id)
    expect(notFoundChapter).to.eq(null)

    await saveChapter(values)
    const newChapter = await getChapter(values.id)
    expect(newChapter.id).to.eq(values.id)
  })

  it('updates an existing chapter without changing unspecified attrs', async function () {
    const {
      id,
      name,
      channelName,
      githubTeamId,
      timezone,
      inviteCodes,
    } = await factory.create('chapter')

    const newInviteCodes = [...inviteCodes, 'newCode']

    await saveChapter({
      id,
      name,
      channelName,
      timezone,
      inviteCodes: newInviteCodes,
    })

    const updatedChapter = await getChapter(id)
    expect(updatedChapter.githubTeamId).to.eq(githubTeamId)
    expect(updatedChapter.inviteCodes).to.deep.eq(newInviteCodes)
  })
})
