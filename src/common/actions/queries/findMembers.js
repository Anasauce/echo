export default function findMembers() {
  return {
    variables: {},
    query: `
      query {
        findMembers {
          id
          chapter {
            id
            name
            channelName
            timezone
            inviteCodes
          }
          createdAt
          updatedAt
        }
      }
    `,
  }
}
