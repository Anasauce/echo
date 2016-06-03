import yup from 'yup'
import {saveResponsesForQuestion} from '../../server/db/response'
import {getCurrentRetrospectiveSurveyForPlayer} from '../../server/db/survey'
import {getQuestionById} from '../../server/db/question'

export default async function saveRetrospectiveCLISurveyResponseForPlayer(respondentId, {questionNumber, responseParams}) {
  const questionIndex = questionNumber - 1
  try {
    const survey = await getCurrentRetrospectiveSurveyForPlayer(respondentId)
    const {questionId, subject} = survey.questions[questionIndex]
    const question = await getQuestionById(questionId)

    const defaultResponseAttrs = {
      questionId,
      respondentId,
      surveyId: survey.id,
    }

    const responses = await parseAndValidateResponseParams(responseParams, question, subject)
      .then(responses => responses.map(response => Object.assign({}, response, defaultResponseAttrs)))

    const createdIds = await saveResponsesForQuestion(responses)
    return createdIds
  } catch (e) {
    throw (e)
  }
}

async function parseAndValidateResponseParams(responseParams, question, subject) {
  try {
    const rawResponses = await parseResponseParams(responseParams, subject, question.subjectType)
    const responses = await validateResponses(rawResponses, question.type)
    if (responses.length > 1) {
      assertValidMultipartResponse(responses, question.type)
    }
    return responses
  } catch (e) {
    throw (e)
  }
}

async function getPlayerIdFromHandle(playerHandle) {
  return playerHandle
}

const responseParamParsers = {
  team: responseParams => {
    return Promise.all(responseParams.map(param => {
      const [playerHandle, value] = param.split(':')
      return getPlayerIdFromHandle(playerHandle)
        .then(playerId => ({subject: playerId, value}))
    }))
  },
  player: async (responseParams, subject) => {
    return [{subject, value: responseParams[0]}]
  },
}

function parseResponseParams(responseParams, subject, subjectType) {
  const parser = responseParamParsers[subjectType]

  if (!parser) {
    throw Error(`Unknown subjectType: ${subjectType}!`)
  }

  return parser(responseParams, subject)
}

function validateResponses(unparsedValues, questionType) {
  return Promise.all(
    unparsedValues.map(({subject, value}) =>
      parseValue(value, questionType)
        .then(parsedValue => ({subject, value: parsedValue}))
    )
  )
}

const multipartValidators = {
  percentage: responseParts => {
    const values = responseParts.map(({value}) => value)
    const sum = values.reduce((sum, value) => sum + value, 0)
    if (sum !== 100) {
      throw (Error(`Percentages must add up to 100%, got ${sum}`))
    }
  }
}

function assertValidMultipartResponse(responseParts, type) {
  if (multipartValidators[type]) {
    multipartValidators[type](responseParts)
  }
}

const valueParsers = {
  percentage: value => yup.number().positive().max(100).validate(value),
  text: value => yup.string().trim().min(1).max(10000).validate(value),
}

function parseValue(value, type) {
  const parser = valueParsers[type]

  if (!parser) {
    return Promise.reject(Error(`Unknown question type: ${type}!`))
  }

  return parser(value)
}
