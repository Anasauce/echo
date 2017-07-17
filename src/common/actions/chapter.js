import {normalize} from 'normalizr'

import {getGraphQLFetcher} from 'src/common/util'
import types from './types'
import schemas from './schemas'
import queries from './queries'

export function findChapters() {
  return {
    types: [
      types.FIND_CHAPTERS_REQUEST,
      types.FIND_CHAPTERS_SUCCESS,
      types.FIND_CHAPTERS_FAILURE,
    ],
    shouldCallAPI: () => true,
    callAPI: (dispatch, getState) => {
      const query = queries.findChapters()
      return getGraphQLFetcher(dispatch, getState().auth)(query)
        .then(graphQLResponse => graphQLResponse.data.findChapters)
        .then(chapters => normalize(chapters, schemas.chapters))
    },
    payload: {},
  }
}

export function getChapter(identifier) {
  return {
    types: [
      types.GET_CHAPTER_REQUEST,
      types.GET_CHAPTER_SUCCESS,
      types.GET_CHAPTER_FAILURE,
    ],
    shouldCallAPI: () => true,
    callAPI: (dispatch, getState) => {
      const query = queries.getChapter(identifier)
      return getGraphQLFetcher(dispatch, getState().auth)(query)
        .then(graphQLResponse => graphQLResponse.data.getChapter)
        .then(chapter => normalize(chapter, schemas.chapter))
    },
    payload: {identifier},
  }
}

export function saveChapter(chapter) {
  return {
    types: [
      types.SAVE_CHAPTER_REQUEST,
      types.SAVE_CHAPTER_SUCCESS,
      types.SAVE_CHAPTER_FAILURE,
    ],
    shouldCallAPI: () => true,
    callAPI: (dispatch, getState) => {
      const mutation = queries.saveChapter(chapter)
      return getGraphQLFetcher(dispatch, getState().auth)(mutation)
        .then(graphQLResponse => graphQLResponse.data.saveChapter)
        .then(chapter => normalize(chapter, schemas.chapter))
    },
    redirect: '/chapters',
    payload: {chapter},
  }
}

export function addInviteCodeToChapter(id, inviteCodeData) {
  // because invite codes are stored in `idm` but chapter data lives in
  // `echo`, we first need to create the invite code through `idm`, then
  // associate it with the chapter in `echo`
  return {
    types: [
      types.ADD_INVITE_CODE_TO_CHAPTER_REQUEST,
      types.ADD_INVITE_CODE_TO_CHAPTER_SUCCESS,
      types.ADD_INVITE_CODE_TO_CHAPTER_FAILURE,
    ],
    shouldCallAPI: () => true,
    callAPI: (dispatch, getState) => {
      const {auth, chapters: {chapters}} = getState()
      const chapter = chapters[id]
      if (!chapter) {
        throw new Error('Can\'t add invite code to chapter before it\'s loaded!')
      }

      return createInviteCode(dispatch, auth, inviteCodeData)
        .then(inviteCode => {
          const chapterInviteCodes = (chapter.inviteCodes || []).concat([inviteCode.code])
          const chapterData = Object.assign({}, chapter, {inviteCodes: chapterInviteCodes})
          const mutation = queries.saveChapter(chapterData)
          return getGraphQLFetcher(dispatch, auth)(mutation)
            .then(graphQLResponse => graphQLResponse.data.saveChapter)
            .then(chapter => normalize(chapter, schemas.chapter))
        })
    },
    redirect: `/chapters/${id}`,
    payload: {id, inviteCodeData},
  }
}

function createInviteCode(dispatch, auth, inviteCode) {
  const mutation = queries.createInviteCode(inviteCode)
  return getGraphQLFetcher(dispatch, auth, process.env.IDM_BASE_URL)(mutation)
    .then(graphQLResponse => graphQLResponse.data.createInviteCode)
}
