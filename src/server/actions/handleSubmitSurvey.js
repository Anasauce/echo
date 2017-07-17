import assertSurveyIsComplete from 'src/server/actions/assertSurveyIsComplete'
import handleCompleteSurvey from 'src/server/actions/handleCompleteSurvey'
import {LGBadRequestError} from 'src/server/util/error'

export default async function handleSubmitSurvey(surveyId, respondentId) {
  console.log(`Survey [${surveyId}] submitted by [${respondentId}]`)

  const survey = await assertSurveyIsComplete(surveyId, respondentId)
  const surveyCompletedBy = survey.completedBy || []
  const surveyUnlockedFor = survey.unlockedFor || []
  if (surveyCompletedBy.includes(respondentId) && !surveyUnlockedFor.includes(respondentId)) {
    throw new LGBadRequestError('Survey has already been submitted and is locked')
  }

  return handleCompleteSurvey(surveyId, respondentId)
}
