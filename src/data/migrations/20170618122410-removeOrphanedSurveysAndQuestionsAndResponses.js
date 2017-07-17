import Promise from 'bluebird'

export async function up(r, conn) {
  const reloadDefaultModelData = require('src/server/actions/reloadDefaultModelData')

  const now = new Date()

  // completely reset feedbackTypes, questions, surveyBlueprints
  await Promise.all([
    r.table('feedbackTypes').delete().run(conn),
    r.table('questions').delete().run(conn),
    r.table('surveyBlueprints').delete().run(conn),
  ])
  await reloadDefaultModelData()

  // delete any orphaned surveys
  await r.table('surveys')
    .filter(survey => {
      return r.table('projects')
        .filter({retrospectiveSurveyId: survey('id')})
        .count()
        .eq(0)
    })
    .delete()
    .run(conn)

  // delete orphaned question refs in remaining surveys
  await r.table('surveys')
    .update({
      questionRefs: r.row('questionRefs').filter(questionRef => {
        return r.table('questions')('id').contains(questionRef('questionId'))
      }),
      updatedAt: now,
    }, {nonAtomic: true})
    .run(conn)

  // delete all survey responses not linked to a survey and question
  await r.table('responses')
    .filter(response => {
      return r.or(
        r.table('surveys')
          .filter({id: response('surveyId')})
          .count()
          .eq(0),

        r.table('questions')
          .filter({id: response('questionId')})
          .count()
          .eq(0),
      )
    })
    .delete()
    .run(conn)
}

export function down() {
  // irreversible; cannot recover data
}
