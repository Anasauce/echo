/* eslint-disable no-console, camelcase */
import processChangeFeedWithAutoReconnect from 'rethinkdb-changefeed-reconnect'

import {changefeedForVoteSubmitted} from 'src/server/services/dataService'
import {handleConnectionError} from './util'

export default function voteSubmitted(voteSubmittedQueue) {
  processChangeFeedWithAutoReconnect(changefeedForVoteSubmitted, _getFeedProcessor(voteSubmittedQueue), handleConnectionError, {
    changefeedName: 'vote submitted',
  })
}

function _getFeedProcessor(voteSubmittedQueue) {
  return ({new_val: vote}) => {
    const jobOpts = {
      attempts: 3,
      backoff: {type: 'fixed', delay: 5000},
    }
    voteSubmittedQueue.add(vote, jobOpts)
  }
}
