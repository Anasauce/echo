import getChapter from 'src/server/actions/getChapter'
import {Chapter} from 'src/server/services/dataService'

export default async function saveChapter(values) {
  const {id} = values || {}
  if (id) {
    // {conflict: 'update'} option doesn't work when using .save() to update
    // https://github.com/neumino/thinky/issues/454
    if (await getChapter(id)) {
      return Chapter.get(id).updateWithTimestamp(values)
    }
  }
  return Chapter.save(values)
}
