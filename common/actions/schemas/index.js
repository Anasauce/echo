import {Schema, arrayOf} from 'normalizr'

const chapter = new Schema('chapters')
const cycle = new Schema('cycles')
const cycleVotingResults = new Schema('cycleVotingResults')
const phase = new Schema('phases')
const player = new Schema('players')
const project = new Schema('projects')
const user = new Schema('users')

const chapters = arrayOf(chapter)
const phases = arrayOf(phase)
const players = arrayOf(player)
const projects = arrayOf(project)
const users = arrayOf(user)

cycle.define({chapter})
cycleVotingResults.define({cycle})
player.define({chapter})

export default {
  chapter,
  chapters,
  cycle,
  cycleVotingResults,
  phase,
  phases,
  player,
  players,
  project,
  projects,
  user,
  users,
}
