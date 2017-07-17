import {COMPLETE} from 'src/common/models/cycle'
import {r, Member, Project, getLatestCycleForChapter} from 'src/server/services/dataService'

export default async function findActiveProjectsForMember(memberId) {
  const member = await Member.get(memberId)
  const latestCycle = await getLatestCycleForChapter(member.chapterId, {default: null})
  if (!latestCycle || latestCycle.state === COMPLETE) {
    return []
  }
  return Project.filter(project => r.and(
    project('cycleId').eq(latestCycle.id),
    project('memberIds').contains(member.id)
  ))
}
