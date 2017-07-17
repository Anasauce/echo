import dbConfig from 'src/config/db'

import r from '../r'

const {db: DB_NAME} = dbConfig

export default async function createDb() {
  console.log(`Creating database '${DB_NAME}'`)
  return r.dbCreate(DB_NAME).run()
}
