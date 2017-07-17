export default function memberModel(thinky) {
  const {r, type: {string, date, array}} = thinky

  return {
    name: 'Member',
    table: 'members',
    schema: {
      id: string()
        .uuid(4)
        .allowNull(false),

      chapterId: string()
        .uuid(4)
        .allowNull(false),

      phaseId: string()
        .uuid(4)
        .allowNull(true),

      chapterHistory: array()
        .default([]),

      createdAt: date()
        .allowNull(false)
        .default(r.now()),

      updatedAt: date()
        .allowNull(false)
        .default(r.now()),
    },
    associate: (Member, models) => {
      Member.belongsTo(models.Chapter, 'chapter', 'chapterId', 'id', {init: false})
      Member.belongsTo(models.Phase, 'phase', 'phaseId', 'id', {init: false})
    },
  }
}
