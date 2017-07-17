
import express from 'express'
import raven from 'raven'
import {
  addUserToRequestFromJWT,
  extendJWTExpiration,
  refreshUserFromIDMService
} from '@learnersguild/idm-jwt-auth/lib/middlewares'

import config from 'src/config'

const sentry = new raven.Client(config.server.sentryDSN)

const app = new express.Router()

// app configuration
app.use(addUserToRequestFromJWT)
app.use((req, res, next) => {
  refreshUserFromIDMService(req, res, err => {
    if (err) {
      // this is not enough to break things -- if we are unable to refresh the
      // user from IDM, but our JWT is still valid, it's okay, so we won't
      // allow this error to propagate beyond this point
      console.warn('WARNING: unable to refresh user from IDM service:', err)
      sentry.captureException(err)
    }
    next()
  })
})
app.use(extendJWTExpiration)

export default app
