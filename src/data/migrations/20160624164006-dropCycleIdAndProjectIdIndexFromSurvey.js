export function up(r) {
  return migrateDataUp(r)
    .then(() => r.table('surveys').indexDrop('cycleIdAndProjectId'))
    .then(checkForWriteErrors)
}

export function down(r) {
  return r.table('surveys')
    .indexCreate('cycleIdAndProjectId', [r.row('cycleId'), r.row('projectId')])
    .then(checkForWriteErrors)
    .then(() => migrateDataDown(r))
}

function migrateDataUp(r) {
  return setRetroSurveyIdInProjects(r)
  .then(checkForWriteErrors)
  .then(() => removeCycleIdAndProjectIdFromSurveys(r))
  .then(checkForWriteErrors)
}

function setRetroSurveyIdInProjects(r) {
  const getSurveyId = (cycleId, projectId) =>
    r.table('surveys')
      .getAll([cycleId, projectId], {index: 'cycleIdAndProjectId'})
      .nth(0)('id').default(null)

  return r.table('projects').update(project => ({
    history: project('history').map(historyEntry => historyEntry.merge({
      retrospectiveSurveyId: getSurveyId(historyEntry('cycleId'), project('id'))
    }))
  }), {nonAtomic: true, returnChanges: true})
}

function removeCycleIdAndProjectIdFromSurveys(r) {
  return r.table('surveys')
    .replace(r.row.without('cycleId', 'projectId'))
}

function checkForWriteErrors(result) {
  if (result.errors > 0) {
    throw new Error(result.first_error)
  }
  return result
}

function migrateDataDown(r) {
  return r.table('projects').then(projects =>
    Promise.all(projects.map(project =>
      project.history && Promise.all(project.history.map(historyEntry =>
        r.table('surveys')
          .get(historyEntry.retrospectiveSurveyId)
          .update({
            projectId: project.id,
            cycleId: historyEntry.cycleId,
          }).then(checkForWriteErrors)
      ))
    ).filter(result => result))
  )
  .then(() =>
    r.table('projects').replace(r.row.without({history: 'retrospectiveSurveyId'}))
  )
  .then(checkForWriteErrors)
}
