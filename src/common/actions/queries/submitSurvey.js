export default function submitSurvey(surveyId) {
  return {
    variables: {surveyId},
    query: `
      mutation($surveyId: ID!) {
        submitSurvey(surveyId:$surveyId) {
          success
        }
      }
    `,
  }
}
