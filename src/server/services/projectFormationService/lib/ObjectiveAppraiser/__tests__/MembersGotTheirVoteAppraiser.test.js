/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions, max-nested-callbacks */

import MembersGotTheirVoteAppraiser from '../MembersGotTheirVoteAppraiser'

const SECOND_CHOICE_VALUE = MembersGotTheirVoteAppraiser.SECOND_CHOICE_VALUE

describe(testContext(__filename), function () {
  const MEMBER_1ST_CHOICE = 'g1'
  const MEMBER_2ND_CHOICE = 'g2'
  const GOAL_WITH_NO_VOTES = 'g3'
  const pool = {
    votes: [
      {memberId: 'p0', votes: [MEMBER_1ST_CHOICE, MEMBER_2ND_CHOICE]},
      {memberId: 'p1', votes: [MEMBER_1ST_CHOICE, MEMBER_2ND_CHOICE]},
      {memberId: 'p2', votes: [MEMBER_1ST_CHOICE, MEMBER_2ND_CHOICE]},
      {memberId: 'p3', votes: [MEMBER_1ST_CHOICE, MEMBER_2ND_CHOICE]},
      {memberId: 'p4', votes: [MEMBER_1ST_CHOICE, MEMBER_2ND_CHOICE]},
      {memberId: 'p5', votes: [MEMBER_1ST_CHOICE, MEMBER_2ND_CHOICE]},
      {memberId: 'p6', votes: [MEMBER_1ST_CHOICE, MEMBER_2ND_CHOICE]},
      {memberId: 'p7', votes: [MEMBER_1ST_CHOICE, MEMBER_2ND_CHOICE]},
      {memberId: 'p8', votes: [MEMBER_1ST_CHOICE, MEMBER_2ND_CHOICE]},
      {memberId: 'p9', votes: [MEMBER_1ST_CHOICE, MEMBER_2ND_CHOICE]},
    ],
    goals: [
      {goalDescriptor: MEMBER_1ST_CHOICE, teamSize: 4},
      {goalDescriptor: MEMBER_2ND_CHOICE, teamSize: 4},
      {goalDescriptor: GOAL_WITH_NO_VOTES, teamSize: 4},
    ],
  }

  describe('with complete teams', function () {
    it('returns the percentage of members who got their first vote', function () {
      const teamFormationPlan = {
        seatCount: 10,
        teams: [
          {
            goalDescriptor: MEMBER_1ST_CHOICE,
            teamSize: 5,
            memberIds: ['p0', 'p1', 'p2', 'p3', 'p4'],
          },
          {
            goalDescriptor: GOAL_WITH_NO_VOTES,
            teamSize: 5,
            memberIds: ['p5', 'p6', 'p7', 'p8', 'p9'],
          },
        ]
      }

      const appriaser = new MembersGotTheirVoteAppraiser(pool)
      const score = appriaser.score(teamFormationPlan)
      expect(score).to.eq(1 / 2)
    })

    it(`gives getting your second vote ${SECOND_CHOICE_VALUE * 100}% of the value of getting your first`, function () {
      const teamFormationPlan = {
        seatCount: 10,
        teams: [
          {
            goalDescriptor: MEMBER_2ND_CHOICE,
            teamSize: 5,
            memberIds: ['p0', 'p1', 'p2', 'p3', 'p4'],
          },
          {
            goalDescriptor: GOAL_WITH_NO_VOTES,
            teamSize: 5,
            memberIds: ['p5', 'p6', 'p7', 'p8', 'p9'],
          },
        ]
      }

      const appriaser = new MembersGotTheirVoteAppraiser(pool)
      const score = appriaser.score(teamFormationPlan)
      expect(score).to.eq(SECOND_CHOICE_VALUE / 2)
    })
  })

  describe('with incomplete teams', function () {
    it('correctly handles teamFormationPlans without all of the goals selected', function () {
      const pool = {
        votes: [
          {memberId: 'p0', votes: ['g0', 'g1']},
          {memberId: 'p1', votes: ['g1', 'g0']},
          {memberId: 'p2', votes: ['g0', 'g1']},
          {memberId: 'p3', votes: ['g1', 'g0']},
          {memberId: 'p4', votes: ['g0', 'g1']},
          {memberId: 'p5', votes: ['g1', 'g0']},
          {memberId: 'p6', votes: ['g0', 'g1']},
          {memberId: 'p7', votes: ['g1', 'g0']},
        ],
        goals: [
          {goalDescriptor: 'g0', teamSize: 3},
          {goalDescriptor: 'g1', teamSize: 3},
        ],
      }
      const teamFormationPlan = {
        seatCount: 9,
        teams: [
          {
            goalDescriptor: 'g0',
            teamSize: 3,
            memberIds: [],
          },
        ]
      }

      const appriaser = new MembersGotTheirVoteAppraiser(pool)
      const score = appriaser.score(teamFormationPlan)

      expect(score).to.eq(1)
    })

    it('works when no members have been assigned at all', function () {
      const teamFormationPlan = {
        seatCount: 10,
        teams: [
          {
            goalDescriptor: MEMBER_1ST_CHOICE,
            teamSize: 5,
            memberIds: [],
          },
          {
            goalDescriptor: GOAL_WITH_NO_VOTES,
            teamSize: 5,
            memberIds: [],
          },
        ]
      }

      const appriaser = new MembersGotTheirVoteAppraiser(pool)
      const score = appriaser.score(teamFormationPlan)

      expect(score).to.eq(0.5)
    })

    it('returns the percentage of members who can get their vote', function () {
      const teamFormationPlan = {
        seatCount: 10,
        teams: [
          {
            goalDescriptor: MEMBER_1ST_CHOICE,
            teamSize: 5,
            memberIds: ['p0', 'p1', 'p2', 'p3', 'p4'],
          },
          {
            goalDescriptor: GOAL_WITH_NO_VOTES,
            teamSize: 5,
            memberIds: [],
          },
        ]
      }

      const appriaser = new MembersGotTheirVoteAppraiser(pool)
      const score = appriaser.score(teamFormationPlan)

      expect(score).to.eq(0.5)
    })

    it(`gives getting your second vote ${SECOND_CHOICE_VALUE * 100}% of the value of getting your first`, function () {
      const teamFormationPlan = {
        seatCount: 10,
        teams: [
          {
            goalDescriptor: MEMBER_2ND_CHOICE,
            teamSize: 5,
            memberIds: ['p0', 'p1', 'p2', 'p3', 'p4'],
          },
          {
            goalDescriptor: MEMBER_1ST_CHOICE,
            teamSize: 5,
            memberIds: [],
          },
        ]
      }

      const appriaser = new MembersGotTheirVoteAppraiser(pool)
      const score = appriaser.score(teamFormationPlan)
      expect(score).to.eq(
        // half already have their first choice
        0.5 +
        // everyone else can get their 2nd choice
        (SECOND_CHOICE_VALUE / 2)
      )
    })

    it('considers unassigned members votes and what goals have already been chosen', function () {
      const teamFormationPlan = {
        seatCount: 10,
        teams: [
          {
            goalDescriptor: MEMBER_1ST_CHOICE,
            teamSize: 5,
            memberIds: ['p0', 'p1', 'p2', 'p3', 'p4'],
          },
          {
            goalDescriptor: GOAL_WITH_NO_VOTES,
            teamSize: 5,
            memberIds: [],
          },
        ]
      }

      const appriaser = new MembersGotTheirVoteAppraiser(pool)
      const score = appriaser.score(teamFormationPlan)
      expect(score).to.eq(0.5)
    })

    it('considers unassigned members votes and what goals have already been chosen 2', function () {
      const teamFormationPlan = {
        seatCount: 10,
        teams: [
          {
            goalDescriptor: MEMBER_2ND_CHOICE,
            teamSize: 5,
            memberIds: ['p0', 'p1', 'p2', 'p3', 'p4'],
          },
          {
            goalDescriptor: MEMBER_2ND_CHOICE,
            teamSize: 5,
            memberIds: [],
          },
        ]
      }

      const appriaser = new MembersGotTheirVoteAppraiser(pool)
      const score = appriaser.score(teamFormationPlan)
      expect(score).to.eq(SECOND_CHOICE_VALUE)
    })

    it('takes into consideration that if a goal has been chosen some members MUST fill those seats', function () {
      const pool = {
        votes: [
          {memberId: 'p0', votes: ['g0', 'g3']},
          {memberId: 'p1', votes: ['g0', 'g3']},
          {memberId: 'p2', votes: ['g2', 'g3']},
          {memberId: 'p3', votes: ['g2', 'g3']},
          {memberId: 'p4', votes: ['g2', 'g3']},
          {memberId: 'p5', votes: ['g2', 'g3']},
          {memberId: 'p6', votes: ['g2', 'g3']},
          {memberId: 'p7', votes: ['g2', 'g3']},
        ],
        goals: [
          {goalDescriptor: 'g0', teamSize: 3},
          {goalDescriptor: 'g1', teamSize: 3},
          {goalDescriptor: 'g2', teamSize: 3},
          {goalDescriptor: 'g3', teamSize: 3},
        ],
      }
      const teamFormationPlan = {
        seatCount: 8,
        teams: [
          {
            goalDescriptor: 'g0',
            teamSize: 4,
            memberIds: [],
          },
        ]
      }

      const appriaser = new MembersGotTheirVoteAppraiser(pool)
      const score = appriaser.score(teamFormationPlan)
      expect(score).to.eq(6 / 8)
    })
  })
})
