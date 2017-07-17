/* eslint-disable no-console, camelcase */
import processChangeFeedWithAutoReconnect from 'rethinkdb-changefeed-reconnect'

import {changefeedForSurveySubmitted} from 'src/server/services/dataService'
import {handleConnectionError} from './util'

export default function surveySubmitted(queue) {
  processChangeFeedWithAutoReconnect(changefeedForSurveySubmitted, _getFeedProcessor(queue), handleConnectionError, {
    changefeedName: 'survey submitted',
  })
}

function _getFeedProcessor(queue) {
  return ({old_val, new_val}) => {
    const completedByOld = old_val.completedBy || []
    const completedByNew = new_val.completedBy || []
    const newRespondentId = completedByNew.find(u => !completedByOld.includes(u.id))
    queue.add({
      survey: new_val,
      respondentId: newRespondentId,
    }, {
      attempts: 3,
      backoff: {type: 'fixed', delay: 10000},
    })
  }
}
