export default function findChapters() {
  return {
    variables: {},
    query: `
      query {
        findChapters {
          id
          name
          channelName
          inviteCodes
          activeProjectCount
          activeMemberCount
          latestCycle {
            id
            cycleNumber
            state
          }
        }
      }
    `,
  }
}
