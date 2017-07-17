export default function updateUser(values) {
  return {
    variables: {values},
    query: `
      mutation ($values: InputUser!) {
        updateUser(values: $values) {
          id
          handle
          updatedAt
        }
      }
    `,
  }
}
