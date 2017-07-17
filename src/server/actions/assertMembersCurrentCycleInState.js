import {Member, getLatestCycleForChapter} from 'src/server/services/dataService'
import {LGForbiddenError} from 'src/server/util/error'

export default async function assertMembersCurrentCycleInState(currentUser, state) {
  const member = await Member.get(currentUser.id).getJoin({chapter: true})
  const cycleInReflection = await getLatestCycleForChapter(member.chapter.id)('state').eq(state)
  if (!cycleInReflection) {
    throw new LGForbiddenError(`This action is not allowed when the cycle is not in the ${state} state`)
  }
}
