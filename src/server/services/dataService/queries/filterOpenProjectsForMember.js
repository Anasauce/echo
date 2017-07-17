import r from '../r'

export default function filterOpenProjectsForMember(memberId) {
  return function (project) {
    const containsMember = project => project('memberIds').contains(memberId)
    const hasRetroSurvey = project => project('retrospectiveSurveyId')
    const isRetroOpenForMember = project =>
      r.table('surveys')
        .get(project('retrospectiveSurveyId'))
        .do(survey =>
          r.or(
            survey('unlockedFor').default([]).contains(memberId),
            survey('completedBy').default([]).contains(memberId).not()
          )
        )
    return r.and(
      containsMember(project),
      hasRetroSurvey(project),
      isRetroOpenForMember(project)
    )
  }
}
