import {Member} from 'src/server/services/dataService'
import {mapById} from 'src/server/util'
import {userCan} from 'src/common/util'
import getMemberInfo from 'src/server/actions/getMemberInfo'

export default async function findActiveVotingMembersInChapter(chapterId) {
  const members = await Member.filter({chapterId}).getJoin({phase: true})
  const memberIds = members.map(_ => _.id)
  const idmUsers = await getMemberInfo(memberIds)
  const idmUserMap = mapById(idmUsers)
  return members.filter(member => {
    const idmUser = idmUserMap.get(member.id)
    return member.phase && member.phase.hasVoting && idmUser.active && !userCan(idmUser, 'beExcludedFromVoting')
  })
}
