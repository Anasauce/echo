import {Member, r} from 'src/server/services/dataService'

export default function reassignMembersToChapter(memberIds, chapterId) {
  const now = r.now()
  return Member
    .getAll(...memberIds)
    .filter(r.row('chapterId').ne(chapterId))
    .update({
      chapterId,
      chapterHistory: r.row('chapterHistory')
        .default([])
        .insertAt(0, {
          chapterId: r.row('chapterId'),
          until: now,
        }),
      updatedAt: now,
    })
}
