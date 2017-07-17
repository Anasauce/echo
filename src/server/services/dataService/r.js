import rethinkdbdash from 'rethinkdbdash'

import dbConfig from 'src/config/db'

const r = rethinkdbdash({
  servers: [dbConfig],
  silent: true,
  max: 100,
  buffer: 10,
})

export default r
