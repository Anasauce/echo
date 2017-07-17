import {Project} from 'src/server/services/dataService'
import generateProjectName from 'src/server/actions/generateProjectName'

export default async function saveProject(values) {
  const name = values.name || await generateProjectName()
  return Project.upsert({...values, name})
}
