export default function getChapter(identifier) {
  return {
    variables: {identifier},
    query: `
      query ($identifier: String!) {
        getChapter(identifier: $identifier) {
          id
          name
          channelName
          timezone
          inviteCodes
        }
      }
    `,
  }
}
