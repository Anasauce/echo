/* eslint-disable no-console, camelcase */
import processChangeFeedWithAutoReconnect from 'rethinkdb-changefeed-reconnect'

import {changefeedForChapterCreated} from 'src/server/services/dataService'
import {handleConnectionError} from './util'

export default function chapterCreated(chapterCreatedQueue) {
  processChangeFeedWithAutoReconnect(changefeedForChapterCreated, _getFeedProcessor(chapterCreatedQueue), handleConnectionError, {
    changefeedName: 'chapter created',
  })
}

function _getFeedProcessor(chapterCreatedQueue) {
  return ({new_val: chapter}) => {
    const jobOpts = {
      attempts: 3,
      backoff: {type: 'fixed', delay: 60000},
    }
    chapterCreatedQueue.add(chapter, jobOpts)
  }
}
