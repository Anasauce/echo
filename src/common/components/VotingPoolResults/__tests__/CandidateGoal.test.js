/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */

import React from 'react'
import {shallow, mount} from 'enzyme'

import config from 'src/config'
import CandidateGoal from 'src/common/components/VotingPoolResults/CandidateGoal'
import styles from 'src/common/components/VotingPoolResults/CandidateGoal.css'
import factory from 'src/test/factories'

describe(testContext(__filename), function () {
  before(async function () {
    const goalRankOverwrites = Array.from(Array(3).keys()).map(i => ({goalRank: i}))
    this.mockCandidateGoal = {
      memberGoalRanks: await factory.buildMany('memberGoalRank', goalRankOverwrites, goalRankOverwrites.length),
      goal: {
        url: `${config.server.goalLibrary.baseURL}/goals/40`,
        title: 'the goal title (#40)',
      },
    }
    this.currentUser = await factory.build('user')
    this.createElement = (candidateGoal = this.mockCandidateGoal) => {
      return React.createElement(CandidateGoal, {candidateGoal, currentUser: this.currentUser})
    }
  })

  describe('rendering', function () {
    it('renders the goal name', function () {
      const root = shallow(this.createElement())

      expect(root.html()).to.include(this.mockCandidateGoal.goal.title)
    })

    it('renders the number of votes', function () {
      const root = shallow(this.createElement())

      expect(root.html()).to.include(`${this.mockCandidateGoal.memberGoalRanks.length}`)
    })

    it('renders a link to the goal', function () {
      const root = mount(this.createElement())
      const link = root.find('a').first()

      expect(link.props().href || '').to.equal(this.mockCandidateGoal.goal.url)
    })

    it('provides an indication that the current member voted for the given goal', function () {
      const goal = {...this.mockCandidateGoal}
      goal.memberGoalRanks[0].memberId = this.currentUser.id

      const root = shallow(this.createElement(goal))
      const votedEls = root.findWhere(node => node.hasClass(styles.voted))

      expect(votedEls.length).to.be.above(0)
    })
  })
})
