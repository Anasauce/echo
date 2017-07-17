import {Moderator, errors} from 'src/server/services/dataService'
import {LGNotAuthorizedError, LGForbiddenError} from 'src/server/util/error'

export default function assertUserIsModerator(userId) {
  return Moderator.get(userId)
    .then(moderator => {
      if (!moderator.chapterId) {
        throw new LGForbiddenError('Moderators must be assigned to a chapter')
      }
      return moderator
    })
    .catch(errors.DocumentNotFound, () => {
      throw new LGNotAuthorizedError('Must be a moderator')
    })
}
