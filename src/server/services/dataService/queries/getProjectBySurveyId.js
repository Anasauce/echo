import r from '../r'

export default async function getProjectBySurveyId(surveyId) {
  const projects = await r.table('projects').filter({
    retrospectiveSurveyId: surveyId,
  })
  if (projects.length !== 1) {
    throw new Error('Unable to find a project for survey')
  }

  return projects[0]
}
