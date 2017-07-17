import autoloader from 'auto-loader'

import {pruneAutoLoad} from 'src/server/graphql/util'

export default pruneAutoLoad(autoloader.load(__dirname))
