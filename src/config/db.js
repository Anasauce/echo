import url from 'url'
import path from 'path'

import config from './index'

const DATA_SERVICE_DIR = path.resolve(__dirname, '../server/services/dataService')

const dbCert = config.server.rethinkdb.connections.cert
const dbUrl = config.server.rethinkdb.connections.url
const {hostname, port, pathname, auth} = url.parse(dbUrl)

export default {
  host: hostname,
  port: parseInt(port, 10),
  db: pathname ? pathname.slice(1) : undefined,
  authKey: auth ? auth.split(':')[1] : undefined,
  ssl: dbCert ? {ca: dbCert} : undefined,
  relativeTo: DATA_SERVICE_DIR,
  migrationsDirectory: path.join(DATA_SERVICE_DIR, 'migrations'),
}
