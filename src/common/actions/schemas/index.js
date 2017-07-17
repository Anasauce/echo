import {Schema, arrayOf} from 'normalizr'

const chapter = new Schema('chapters')
const cycle = new Schema('cycles')
const cycleVotingResults = new Schema('cycleVotingResults')
const phase = new Schema('phases')
const member = new Schema('members')
const project = new Schema('projects')
const user = new Schema('users')

const chapters = arrayOf(chapter)
const phases = arrayOf(phase)
const members = arrayOf(member)
const projects = arrayOf(project)
const users = arrayOf(user)

cycle.define({chapter})
cycleVotingResults.define({cycle})
member.define({chapter})

export default {
  chapter,
  chapters,
  cycle,
  cycleVotingResults,
  phase,
  phases,
  member,
  members,
  project,
  projects,
  user,
  users,
}
