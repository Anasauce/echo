import Promise from 'bluebird'

import getSurveyBlueprintByDescriptor from '../queries/getSurveyBlueprintByDescriptor'

require('require-yaml') // eslint-disable-line import/no-unassigned-import

const SURVEY_BLUEPRINTS = require('src/data/survey-blueprints.yaml')

export default function surveyBlueprintModel(thinky) {
  const {r, type: {string, date, array}} = thinky

  return {
    name: 'SurveyBlueprint',
    table: 'surveyBlueprints',
    schema: {
      id: string()
        .uuid(4)
        .allowNull(false),

      descriptor: string()
        .allowNull(false),

      defaultQuestionRefs: array()
        .allowNull(false),

      createdAt: date()
        .allowNull(false)
        .default(r.now()),

      updatedAt: date()
        .allowNull(false)
        .default(r.now()),
    },
    static: {
      async syncData() {
        return Promise.map(SURVEY_BLUEPRINTS, async surveyBlueprint => {
          // merge by unique descriptors
          if (!surveyBlueprint.id && surveyBlueprint.descriptor) {
            try {
              const existingSurveyBlueprint = await getSurveyBlueprintByDescriptor(surveyBlueprint.descriptor)
              if (existingSurveyBlueprint) {
                return this
                  .get(existingSurveyBlueprint.id)
                  .updateWithTimestamp(surveyBlueprint)
              }
            } catch (err) {
              console.warn(err)
            }
          }

          return this.save(surveyBlueprint, {conflict: 'replace'})
        })
      },
    },
  }
}
