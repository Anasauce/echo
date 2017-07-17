export default function moderatorModel(thinky) {
  const {r, type: {string, date}} = thinky

  return {
    name: 'Moderator',
    table: 'moderators',
    schema: {
      id: string()
        .uuid(4)
        .allowNull(false),

      chapterId: string()
        .uuid(4)
        .allowNull(false),

      createdAt: date()
        .allowNull(false)
        .default(r.now()),

      updatedAt: date()
        .allowNull(false)
        .default(r.now()),
    },
    associate: (Moderator, models) => {
      Moderator.belongsTo(models.Chapter, 'chapter', 'chapterId', 'id', {init: false})
    },
  }
}
