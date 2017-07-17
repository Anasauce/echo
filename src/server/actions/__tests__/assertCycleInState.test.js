/* eslint-env mocha */
/* global expect testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions, max-nested-callbacks */
import {GOAL_SELECTION, PRACTICE, REFLECTION} from 'src/common/models/cycle'
import factory from 'src/test/factories'

import assertCycleInState from '../assertCycleInState'

describe(testContext(__filename), function () {
  beforeEach(async function () {
    this.cycle = await factory.create('cycle', {state: GOAL_SELECTION})
  })

  it('throws an error for an unmatched single state', function () {
    return expect(
      assertCycleInState(this.cycle.id, PRACTICE)
    ).to.be.rejectedWith(/cycle is in the GOAL_SELECTION state/)
  })

  it('throws an error for an unmatched state array', function () {
    return expect(
      assertCycleInState(this.cycle, [PRACTICE, REFLECTION])
    ).to.be.rejectedWith(/cycle is in the GOAL_SELECTION state/)
  })
})
