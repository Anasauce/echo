import {normalize} from 'normalizr'

import {getGraphQLFetcher} from 'src/common/util'
import types from './types'
import schemas from './schemas'
import queries from './queries'

export function findUsers(identifiers) {
  return {
    types: [
      types.FIND_USERS_REQUEST,
      types.FIND_USERS_SUCCESS,
      types.FIND_USERS_FAILURE,
    ],
    shouldCallAPI: () => true,
    callAPI: (dispatch, getState) => {
      const query = queries.findUsers(identifiers)
      return getGraphQLFetcher(dispatch, getState().auth)(query)
        .then(graphQLResponse => graphQLResponse.data.findUsers)
        .then(users => normalize(users, schemas.users))
    },
    payload: {},
  }
}

export function deactivateUser(id) {
  return {
    types: [
      types.DEACTIVATE_USER_REQUEST,
      types.DEACTIVATE_USER_SUCCESS,
      types.DEACTIVATE_USER_FAILURE,
    ],
    shouldCallAPI: () => true,
    callAPI: (dispatch, getState) => {
      const query = {
        query: 'mutation ($memberId: ID!) { deactivateUser(identifier: $memberId) { id active handle } }',
        variables: {memberId: id},
      }
      return getGraphQLFetcher(dispatch, getState().auth)(query)
        .then(graphQLResponse => graphQLResponse.data.deactivateUser)
    },
    payload: {},
  }
}

export function findMembers(options = {}) {
  return (dispatch, getState) => {
    const action = {
      types: [
        types.FIND_MEMBERS_REQUEST,
        types.FIND_MEMBERS_SUCCESS,
        types.FIND_MEMBERS_FAILURE,
      ],
      shouldCallAPI: () => true,
      callAPI: (dispatch, getState) => {
        const query = queries.findMembers()
        return getGraphQLFetcher(dispatch, getState().auth)(query)
          .then(graphQLResponse => graphQLResponse.data.findMembers)
          .then(members => normalize(members, schemas.members))
      },
      payload: {},
    }

    return dispatch(action)
      .then(() => {
        if (options.withUsers) {
          const memberIds = Object.keys(getState().members.members)
          return dispatch(findUsers(memberIds))
        }
      })
  }
}

export function getUserSummary(identifier) {
  return {
    types: [
      types.GET_USER_SUMMARY_REQUEST,
      types.GET_USER_SUMMARY_SUCCESS,
      types.GET_USER_SUMMARY_FAILURE,
    ],
    shouldCallAPI: () => true,
    callAPI: (dispatch, getState) => {
      const query = queries.getUserSummary(identifier)
      return getGraphQLFetcher(dispatch, getState().auth)(query)
        .then(graphQLResponse => graphQLResponse.data.getUserSummary)
    },
    payload: {},
  }
}

export function reassignMembersToChapter(memberIds, chapterId) {
  return {
    types: [
      types.REASSIGN_MEMBERS_TO_CHAPTER_REQUEST,
      types.REASSIGN_MEMBERS_TO_CHAPTER_SUCCESS,
      types.REASSIGN_MEMBERS_TO_CHAPTER_FAILURE,
    ],
    shouldCallAPI: () => true,
    callAPI: (dispatch, getState) => {
      const mutation = queries.reassignMembersToChapter(memberIds, chapterId)
      return getGraphQLFetcher(dispatch, getState().auth)(mutation)
        .then(graphQLResponse => graphQLResponse.data.reassignMembersToChapter)
        .then(members => normalize(members, schemas.members))
    },
    redirect: '/members',
    payload: {memberIds, chapterId},
  }
}

export function updateUser(values) {
  return {
    types: [
      types.UPDATE_USER_REQUEST,
      types.UPDATE_USER_SUCCESS,
      types.UPDATE_USER_FAILURE,
    ],
    shouldCallAPI: () => true,
    callAPI: (dispatch, getState) => {
      const mutation = queries.updateUser(values)
      return getGraphQLFetcher(dispatch, getState().auth)(mutation)
        .then(graphQLResponse => graphQLResponse.data.updateUser)
    },
    redirect: user => (user && user.handle ? `/users/${user.handle}` : '/users'),
    payload: {},
  }
}
