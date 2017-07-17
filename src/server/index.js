/* eslint-disable import/no-unassigned-import */
require('babel-core/register')
require('babel-polyfill')

const config = require('src/config')

if (config.server.newrelic.enabled) {
  require('newrelic')
}

const configureCSSModules = require('./configureCSSModules')

configureCSSModules()
require('./server').start()
