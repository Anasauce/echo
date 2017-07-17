import {GraphQLEnumType} from 'graphql/type'

import {CYCLE_STATES} from 'src/common/models/cycle'

export default new GraphQLEnumType({
  name: 'CycleState',
  values: (
    CYCLE_STATES.reduce((reduced, state) => {
      return Object.assign(reduced, {[state]: {}})
    }, {})
  ),
})
