/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */
import factory from 'src/test/factories'
import {resetDB} from 'src/test/helpers'
import {Project} from 'src/server/services/dataService'

import deleteProject from '../deleteProject'

describe(testContext(__filename), function () {
  beforeEach(resetDB)

  it('resolves successfully the 1st time and throws an error if attempted a 2nd time', async function () {
    const project = await factory.create('project')
    const result = await deleteProject(project.id)
    expect(result).to.eq(true)

    const deletedProject = Project.get(project.id)
    return expect(deletedProject).to.eventually.be.rejectedWith(/returned null/i)
  })

  it('throws an error if project not found', async function () {
    const result = deleteProject('fake.id')
    return expect(result).to.eventually.be.rejectedWith(/not found/i)
  })
})
