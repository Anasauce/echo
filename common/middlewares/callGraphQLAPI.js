import {normalize} from 'normalizr'
import {push} from 'react-router-redux'

// inspired-by: http://redux.js.org/docs/recipes/ReducingBoilerplate.html
export default function callGraphQLAPI({dispatch, getState}) {
  return next => action => {
    const {
      types,
      responseDataAttribute,
      schema,
      callAPI,
      shouldCallAPI = () => true,
      redirect = null,
      payload = {},
    } = action

    if (!types || !responseDataAttribute) {
      // Normal action: pass it on
      return next(action)
    }

    if (
      !Array.isArray(types) ||
      types.length !== 3 ||
      !types.every(type => typeof type === 'string')
    ) {
      throw new Error('Expected an array (e.g., XX_REQUEST, XX_SUCCESS, XX_FAILURE).')
    }

    if (typeof callAPI !== 'function') {
      throw new Error('Expected callAPI to be a function.')
    }

    if (!shouldCallAPI(getState())) {
      /* eslint-disable consistent-return */
      return
    }

    const [requestType, successType, failureType] = types

    dispatch(Object.assign({}, payload, {
      type: requestType
    }))

    return callAPI(dispatch, getState)
      .then(graphQLResponse => {
        dispatch(Object.assign({}, payload, {
          response: normalize(graphQLResponse.data[responseDataAttribute], schema),
          type: successType,
        }))
        if (redirect) {
          dispatch(push(redirect))
        }
      })
      .catch(error => {
        return dispatch(Object.assign({}, payload, {
          error,
          type: failureType,
        }))
      })
  }
}