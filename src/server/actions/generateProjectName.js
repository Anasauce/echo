import {Project} from 'src/server/services/dataService'
import randomMemorableName from 'src/server/util/randomMemorableName'

export default async function generateProjectName() {
  const projectName = randomMemorableName()
  const existingProjects = await Project.filter({name: projectName})
  return existingProjects.length > 0 ? generateProjectName() : projectName
}
