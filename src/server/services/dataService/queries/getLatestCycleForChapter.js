import r from '../r'
import {customQueryError} from '../util'
import findCyclesForChapter from './findCyclesForChapter'

export default function getLatestCycleForChapter(chapterId, options = {}) {
  const defaultValue = typeof options.default !== 'undefined' ?
    options.default :
    customQueryError('No cycles found for chapter.')

  const cycleQuery = findCyclesForChapter(chapterId)
    .nth(0)
    .default(defaultValue)

  if (!options.mergeChapter) {
    return cycleQuery
  }

  return cycleQuery.merge({
    chapter: r.table('chapters')
      .get(r.row('chapterId'))
      .without('inviteCodes')
  }).without('chapterId')
}
