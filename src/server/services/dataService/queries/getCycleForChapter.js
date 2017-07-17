import r from '../r'

export default function getCycleForChapter(chapterId, cycleIdentifier) {
  const cycleNumber = parseInt(cycleIdentifier, 10)
  return r.table('cycles').filter(row => r.and(
    row('chapterId').eq(chapterId),
    r.or(
      row('id').eq(cycleIdentifier),
      row('cycleNumber').eq(cycleNumber)
    )
  ))
  .nth(0)
  .default(null)
}
