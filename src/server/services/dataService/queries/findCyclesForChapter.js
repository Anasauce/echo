import r from '../r'

export default function findCyclesForChapter(chapterId) {
  return r.table('cycles')
    .between([chapterId, r.minval], [chapterId, r.maxval], {index: 'chapterIdAndState'})
    .orderBy(r.desc('cycleNumber'))
}
