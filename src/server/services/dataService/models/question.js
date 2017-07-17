import {QUESTION_SUBJECT_TYPES, QUESTION_RESPONSE_TYPES} from 'src/common/models/survey'

require('require-yaml') // eslint-disable-line import/no-unassigned-import

const QUESTIONS = require('src/data/questions.yaml')

export default function questionModel(thinky) {
  const {r, type: {string, date, boolean, object}} = thinky

  return {
    name: 'Question',
    table: 'questions',
    schema: {
      id: string()
        .uuid(4)
        .allowNull(false),

      feedbackTypeId: string()
        .uuid(4)
        .allowNull(false),

      body: string()
        .allowNull(false)
        .default(true),

      subjectType: string()
        .enum(Object.values(QUESTION_SUBJECT_TYPES))
        .allowNull(false),

      responseType: string()
        .enum(Object.values(QUESTION_RESPONSE_TYPES))
        .allowNull(false),

      validationOptions: object()
        .allowNull(false)
        .allowExtra(true)
        .default({}),

      active: boolean()
        .allowNull(false)
        .default(true),

      createdAt: date()
        .allowNull(false)
        .default(r.now()),

      updatedAt: date()
        .allowNull(false)
        .default(r.now()),
    },
    associate: (Question, models) => {
      Question.belongsTo(models.FeedbackType, 'feedbackType', 'feedbackTypeId', 'id', {init: false})
    },
    static: {
      async syncData() {
        return this.save(QUESTIONS, {conflict: 'replace'})
      },
    },
  }
}
