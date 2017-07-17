import dbConfig from 'src/config/db'

import r from '../r'

const {db: DB_NAME} = dbConfig

export default async function dropDb() {
  console.log(`Dropping database '${DB_NAME}'`)
  return r.dbDrop(DB_NAME)
}
