import {Project, getProject} from 'src/server/services/dataService'
import {LGBadRequestError, LGForbiddenError} from 'src/server/util/error'

export default async function deleteProject(identifier) {
  const project = await getProject(identifier)
  if (!project) {
    throw new LGBadRequestError('Project not found')
  }

  if (project.retrospectiveSurveyId) {
    throw new LGForbiddenError('Projects with a retro survey cannot be deleted')
  }

  await Project.get(project.id).delete().execute()
  return true
}
