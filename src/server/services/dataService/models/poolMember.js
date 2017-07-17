export default function poolMember(thinky) {
  const {r, type: {string, date}} = thinky

  return {
    name: 'PoolMember',
    table: 'poolMembers',
    schema: {
      id: string()
        .uuid(4)
        .allowNull(false),

      memberId: string()
        .uuid(4)
        .allowNull(false),

      poolId: string()
        .uuid(4)
        .allowNull(false),

      createdAt: date()
        .allowNull(false)
        .default(r.now()),

      updatedAt: date()
        .allowNull(false)
        .default(r.now()),
    },
    associate: (PoolMember, models) => {
      PoolMember.belongsTo(models.Member, 'member', 'memberId', 'id', {init: false})
      PoolMember.belongsTo(models.Pool, 'pool', 'poolId', 'id', {init: false})
    },
  }
}
