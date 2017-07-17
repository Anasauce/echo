export default function reassignMembersToChapter(memberIds, chapterId) {
  return {
    variables: {memberIds, chapterId},
    query: `
      mutation ($memberIds: [ID], $chapterId: ID!) {
        reassignMembersToChapter(memberIds: $memberIds, chapterId: $chapterId) {
          id
          chapter {
            id
            name
            channelName
            timezone
            inviteCodes
          }
        }
      }
    `,
  }
}
