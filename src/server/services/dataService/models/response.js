export default function responseModel(thinky) {
  const {r, type: {string, date, any}} = thinky

  return {
    name: 'Response',
    table: 'responses',
    schema: {
      id: string()
        .uuid(4)
        .allowNull(false),

      surveyId: string()
        .uuid(4)
        .allowNull(false),

      questionId: string()
        .uuid(4)
        .allowNull(false),

      subjectId: string()
        .uuid(4)
        .allowNull(false),

      respondentId: string()
        .uuid(4)
        .allowNull(false),

      value: any(),

      active: any()
        .allowNull(false),

      createdAt: date()
        .allowNull(false)
        .default(r.now()),

      updatedAt: date()
        .allowNull(false)
        .default(r.now()),
    },
    associate: (Response, models) => {
      Response.belongsTo(models.Question, 'question', 'questionId', 'id', {init: false})
      Response.belongsTo(models.Survey, 'survey', 'surveyId', 'id', {init: false})
    },
  }
}
