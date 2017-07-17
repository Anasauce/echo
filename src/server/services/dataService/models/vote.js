export default function voteModel(thinky) {
  const {r, type: {string, date, array, boolean}} = thinky

  return {
    name: 'Vote',
    table: 'votes',
    schema: {
      id: string()
        .uuid(4)
        .allowNull(false),

      poolId: string()
        .uuid(4)
        .allowNull(false),

      memberId: string()
        .uuid(4)
        .allowNull(false),

      goals: array()
        .allowNull(false),

      pendingValidation: boolean()
        .allowNull(false),

      notYetValidatedGoalDescriptors: array()
        .allowNull(true)
        .default(null),

      responseURL: string()
        .allowNull(true)
        .default(null),

      createdAt: date()
        .allowNull(false)
        .default(r.now()),

      updatedAt: date()
        .allowNull(false)
        .default(r.now()),
    },
    associate: (Vote, models) => {
      Vote.belongsTo(models.Pool, 'pool', 'poolId', 'id', {init: false})
      Vote.belongsTo(models.Member, 'member', 'memberId', 'id', {init: false})
    },
  }
}
