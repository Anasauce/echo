import {Member} from 'src/server/services/dataService'
import {mapById} from 'src/server/util'
import getMemberInfo from './getMemberInfo'

export default async function findActiveMembersInChapter(chapterId) {
  const members = await Member.filter({chapterId})
  const memberIds = members.map(_ => _.id)
  const idmActiveUsers = (await getMemberInfo(memberIds)).filter(_ => _.active)
  const idmActiveUserMap = mapById(idmActiveUsers)
  return members.filter(member => Boolean(idmActiveUserMap.get(member.id)))
}
