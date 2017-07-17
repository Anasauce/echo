import {combineReducers} from 'redux'

import {routerReducer} from 'react-router-redux'
import {reducer as formReducer} from 'redux-form'

import app from './app'
import auth from './auth'
import chapters from './chapters'
import cycles from './cycles'
import cycleVotingResults from './cycleVotingResults'
import phases from './phases'
import members from './members'
import projects from './projects'
import projectSummaries from './projectSummaries'
import users from './users'
import userSummaries from './userSummaries'
import surveys from './surveys'

const rootReducer = combineReducers({
  routing: routerReducer,
  form: formReducer,
  app,
  auth,
  chapters,
  cycles,
  cycleVotingResults,
  phases,
  members,
  projects,
  projectSummaries,
  users,
  userSummaries,
  surveys,
})

export default rootReducer
