export default function importProject(values) {
  return {
    variables: {values},
    query: `
      mutation ($values: ProjectImport!) {
        importProject(values: $values) {
          id
          name
          updatedAt
        }
      }
    `,
  }
}
