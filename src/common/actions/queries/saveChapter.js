export default function saveChapter({id, name, channelName, inviteCodes, timezone}) {
  return {
    variables: {chapter: {id, name, channelName, inviteCodes, timezone}},
    query: `
      mutation ($chapter: InputChapter!) {
        saveChapter(chapter: $chapter) {
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
