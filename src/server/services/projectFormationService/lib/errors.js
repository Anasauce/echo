export function NoValidPlanFoundError(message) {
  this.name = 'NoValidPlanFoundError'
  this.message = message
}
NoValidPlanFoundError.prototype = new Error()
