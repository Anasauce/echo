import {LGInternalServerError} from 'src/server/util/error'

import {avg, toPercent} from 'src/common/util'

export const LIKERT_SCORE_NA = 0
export const LIKERT_SCORE_MIN = 1
export const LIKERT_SCORE_MAX = 7

export const technicalComprehension = likert7Average
export const teamPlay = likert7Average

export function likert7Average(scores) {
  return averageScoreInRange(LIKERT_SCORE_MIN, LIKERT_SCORE_MAX, scores)
}

export function averageScoreInRange(minScore, maxScore, scores) {
  if (isNaN(minScore)) {
    throw new LGInternalServerError('Invalid score range min')
  }
  if (isNaN(maxScore)) {
    throw new LGInternalServerError('Invalid score range max')
  }
  if (minScore > maxScore) {
    throw new LGInternalServerError('Min score must be less than or equal to max score')
  }
  if (!Array.isArray(scores)) {
    return null
  }
  // exclude scores outside of valid range
  // shift score values down by min to produce range 0...n
  const adjusted = scores
                    .filter(n => (n >= minScore && n <= maxScore))
                    .map(n => n - minScore)
  const adjustedAvg = avg(adjusted)
  const range = maxScore - minScore
  return Math.round(toPercent(adjustedAvg / range))
}

export function extractValueForReponseQuestionFeedbackType(responseArr, feedbackTypeDescriptor) {
  if (!Array.isArray(responseArr) || !feedbackTypeDescriptor) {
    return
  }
  return (responseArr.find(response => (
    ((response.question || {}).feedbackType || {}).descriptor === feedbackTypeDescriptor
  )) || {}).value
}
