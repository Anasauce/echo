import config from 'src/config'

const createOptions = config.server.rethinkdb.tableCreation

export function up(r, conn) {
  return Promise.all([
    r.tableCreate('questions', createOptions).run(conn),
    r.tableCreate('surveys', createOptions).run(conn)
      .then(() => r.table('surveys')
                   .indexCreate('cycleIdAndProjectId', [r.row('cycleId'), r.row('projectId')])
                   .run(conn)),
    r.tableCreate('responses', createOptions).run(conn)
      .then(() => Promise.all([
        r.table('responses').indexCreate('questionIdAndSubjectIdAndSurveyId', [
          r.row('questionId'),
          r.row('subject'),
          r.row('surveyId'),
        ]).run(conn),
        r.table('responses').indexCreate('playerId').run(conn),
      ])),
  ])
}

export function down(r, conn) {
  return Promise.all([
    r.tableDrop('questions').run(conn),
    r.tableDrop('surveys').run(conn),
    r.tableDrop('responses').run(conn),
  ])
}
