import r from '../r'
import {customQueryError} from '../util'

export default function getFeedbackTypeByDescriptor(descriptor) {
  return r.table('feedbackTypes').getAll(descriptor, {index: 'descriptor'})
    .nth(0)
    .default(customQueryError(`No feedback type found with descriptor ${descriptor}`))
}
