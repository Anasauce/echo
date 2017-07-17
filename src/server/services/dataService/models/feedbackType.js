import Promise from 'bluebird'

import getFeedbackTypeByDescriptor from '../queries/getFeedbackTypeByDescriptor'

require('require-yaml') // eslint-disable-line import/no-unassigned-import

const FEEDBACK_TYPES = require('src/data/feedback-types.yaml')

export default function feedbackTypeModel(thinky) {
  const {r, type: {string, date}} = thinky

  return {
    name: 'FeedbackType',
    table: 'feedbackTypes',
    schema: {
      id: string()
        .uuid(4)
        .allowNull(false),

      descriptor: string()
        .allowNull(false)
        .default(true),

      createdAt: date()
        .allowNull(false)
        .default(r.now()),

      updatedAt: date()
        .allowNull(false)
        .default(r.now()),
    },
    associate: (FeedbackType, models) => {
      FeedbackType.hasMany(models.Question, 'questions', 'id', 'feedbackTypeId', {init: false})
    },
    static: {
      async syncData() {
        return Promise.map(FEEDBACK_TYPES, async feedbackType => {
          // merge by unique descriptors
          if (!feedbackType.id && feedbackType.descriptor) {
            try {
              const existingFeedbackType = await getFeedbackTypeByDescriptor(feedbackType.descriptor)
              if (existingFeedbackType) {
                return this
                  .get(existingFeedbackType.id)
                  .updateWithTimestamp(feedbackType)
              }
            } catch (err) {
              console.warn(err)
            }
          }

          return this.save(feedbackType, {conflict: 'replace'})
        })
      },
    },
  }
}
