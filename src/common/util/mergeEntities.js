export default function mergeEntities(original, updates) {
  if (!updates) {
    return original
  }
  const mergedEntities = Object.assign({}, original)
  Object.keys(updates).forEach(id => {
    mergedEntities[id] = original[id] ? Object.assign({}, original[id], updates[id]) : updates[id]
  })
  return mergedEntities
}
