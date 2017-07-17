/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions, max-nested-callbacks */
import {Cycle} from 'src/server/services/dataService'
import {GOAL_SELECTION, PRACTICE, REFLECTION, COMPLETE} from 'src/common/models/cycle'
import {resetDB} from 'src/test/helpers'
import {expectArraysToContainTheSameElements} from 'src/test/helpers/expectations'
import factory from 'src/test/factories'

import findActiveProjectsForMember from '../findActiveProjectsForMember'

describe(testContext(__filename), function () {
  beforeEach(resetDB)

  beforeEach('set up chapter, cycle, project', async function () {
    this.chapter = await factory.create('chapter')
    this.cycle = await factory.create('cycle', {chapterId: this.chapter.id})
    this.member = await factory.create('member', {chapterId: this.chapter.id})
    this.projects = await factory.createMany('project', {
      chapterId: this.chapter.id,
      cycleId: this.cycle.id,
      memberIds: [this.member.id],
    }, 3)
  })

  it('returns projects if in GOAL_SELECTION state', async function () {
    await Cycle.get(this.cycle.id).updateWithTimestamp({state: GOAL_SELECTION})
    const activeProjects = await findActiveProjectsForMember(this.member.id)
    expectArraysToContainTheSameElements(
      activeProjects.map(p => p.id),
      this.projects.map(p => p.id),
    )
  })

  it('returns projects if in PRACTICE state', async function () {
    await Cycle.get(this.cycle.id).updateWithTimestamp({state: PRACTICE})
    const activeProjects = await findActiveProjectsForMember(this.member.id)
    expectArraysToContainTheSameElements(
      activeProjects.map(p => p.id),
      this.projects.map(p => p.id),
    )
  })

  it('returns projects if in REFLECTION state', async function () {
    await Cycle.get(this.cycle.id).updateWithTimestamp({state: REFLECTION})
    const activeProjects = await findActiveProjectsForMember(this.member.id)
    expectArraysToContainTheSameElements(
      activeProjects.map(p => p.id),
      this.projects.map(p => p.id),
    )
  })

  it('does not return projects if in COMPLETE state', async function () {
    await Cycle.get(this.cycle.id).updateWithTimestamp({state: COMPLETE})
    const activeProjects = await findActiveProjectsForMember(this.member.id)
    expect(activeProjects.length).to.eq(0)
  })
})
