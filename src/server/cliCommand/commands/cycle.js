import {CYCLE_STATES, PRACTICE, REFLECTION, COMPLETE} from 'src/common/models/cycle'
import {userCan} from 'src/common/util'
import getUser from 'src/server/actions/getUser'

import assertUserIsModerator from 'src/server/actions/assertUserIsModerator'
import createNextCycleForChapter from 'src/server/actions/createNextCycleForChapter'
import {Cycle, getCyclesInStateForChapter, getLatestCycleForChapter} from 'src/server/services/dataService'
import {
  LGCLIUsageError,
  LGNotAuthorizedError,
  LGForbiddenError,
  LGBadRequestError,
} from 'src/server/util/error'

const subcommands = {
  async init(args, {user}) {
    const mergedUser = await getUser(user.id)
    const currentCycle = await getLatestCycleForChapter(mergedUser.chapterId)

    if (currentCycle.state !== REFLECTION && currentCycle.state !== COMPLETE) {
      throw new LGBadRequestError('Failed to initialize a new cycle because the current cycle is still in progress.')
    }

    await _createCycle(user)

    return {
      text: '🔃  Initializing Cycle ... stand by.'
    }
  },

  async launch(args, {user}) {
    await _changeCycleState(user, PRACTICE)

    return {
      text: '🚀  Initiating Launch ... stand by.',
    }
  },

  async reflect(args, {user}) {
    await _changeCycleState(user, REFLECTION)

    return {
      text: '🤔  Initiating Reflection... stand by.',
    }
  },
}

export async function invoke(args, options) {
  if (args._.length >= 1) {
    const subcommand = args._[0]
    return await subcommands[subcommand](args.$[subcommand], options)
  }

  throw new LGCLIUsageError()
}

async function _createCycle(user) {
  if (!userCan(user, 'createCycle')) {
    throw new LGNotAuthorizedError()
  }

  const moderator = await assertUserIsModerator(user.id)
  return await createNextCycleForChapter(moderator.chapterId)
}

async function _changeCycleState(user, newState) {
  const newStateIndex = CYCLE_STATES.indexOf(newState)
  if (!userCan(user, 'updateCycle')) {
    throw new LGNotAuthorizedError()
  }
  if (newStateIndex === -1) {
    throw new LGBadRequestError(`Invalid cycle state ${newState}`)
  }
  if (newStateIndex === 0) {
    throw new LGForbiddenError(`You cannot change the cycle state back to ${newState}`)
  }

  const moderator = await assertUserIsModerator(user.id)

  const validOriginState = CYCLE_STATES[newStateIndex - 1]
  const cycles = await getCyclesInStateForChapter(moderator.chapterId, validOriginState)
  if (cycles.length === 0) {
    throw new LGForbiddenError(`No cycles for the chapter in ${validOriginState} state`)
  }

  return Cycle.get(cycles[0].id).updateWithTimestamp({state: newState})
}
