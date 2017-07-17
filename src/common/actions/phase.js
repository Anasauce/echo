import {normalize} from 'normalizr'

import {getGraphQLFetcher} from 'src/common/util'
import types from './types'
import schemas from './schemas'
import queries from './queries'

export function findPhases() {
  return {
    types: [
      types.FIND_PHASES_REQUEST,
      types.FIND_PHASES_SUCCESS,
      types.FIND_PHASES_FAILURE,
    ],
    shouldCallAPI: () => true,
    callAPI: (dispatch, getState) => {
      const query = queries.findPhases()
      return getGraphQLFetcher(dispatch, getState().auth)(query)
        .then(graphQLResponse => graphQLResponse.data.findPhases)
        .then(phases => normalize(phases, schemas.phases))
    },
    payload: {},
  }
}
