import * as path from 'path'

import * as express from 'express'

import checkPublicApiVersionHeaders from '../middlewares/checkPublicApiVersionHeaders'
import constructJrd from '../middlewares/constructJrd'
import errorHandler ,{wrapAsync} from '../middlewares/errorHandler'
import initializeMetrics from '../middlewares/initializeMetrics'
import getPaymentInfo from '../middlewares/payIds'
import sendSuccess from '../middlewares/sendSuccess'
//import checkAuthentication from '../middlewares/checkAuthentication'
import {addAuthorizedUser, getGrayListOfPayId} from '../middlewares/acl'

import { getStatus, getConnections } from '../middlewares/agents'

const publicApiRouter = express.Router()

/**
 * Routes for the PayID Public API.
 */
publicApiRouter
  // Allow the PayID Protocol to basically ignore CORS
  .use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'PayID-Version')
    res.header(
      'Access-Control-Expose-Headers',
      'PayID-Version, PayID-Server-Version',
    )
    next()
  })

  // Welcome page route
  .get('/', (_req: express.Request, res: express.Response) => {
    res.sendFile(path.join(__dirname, '../html/index.html'))
  })

  // Favicon route
  .get('/favicon.ico', (_req: express.Request, res: express.Response) => {
    res.sendFile(path.join(__dirname, '../html/favicon.ico'))
  })

  // Authorized access to PayID account information
  .post('/payId/authorize', express.json(), wrapAsync(addAuthorizedUser), sendSuccess)
  // Get authorized PayID account info.
  //.post('/payId/', express.json(), getProtectedPayId, sendSuccess)
  //.post('/createjwk', express.json(), wrapAsync(getJWK),sendSuccess)

  // Health route
  .get('/status/health', sendSuccess)

  // PayID Discovery route
  .get('./well-known/webfinger', constructJrd, sendSuccess)
  //ACL
  .get('/graylist', wrapAsync(getGrayListOfPayId), sendSuccess)

  // HYPERLEDGER ARIES AGENT
  .get('/agent/status', wrapAsync(getStatus),sendSuccess)
  .get('/agent/connections', wrapAsync(getConnections), sendSuccess)

  // Credential Proof Hook does not work
  // .post("/request", (req, res) => {
  //   console.log('From the HOOCK')
  //   console.log(req.body) // Call your action on the request here
  //   res.status(200).end() // Responding is important
  // })

  //Grab a user credential via the connection -Not NEEDED
  //.post('/credential/pull', express.json(), wrapAsync(pullUserCredential), sendSuccess)
 
  // Base PayID route
  .get(
    '/*',
    checkPublicApiVersionHeaders,
    //wrapAsync(checkAuthentication),
    initializeMetrics,
    wrapAsync(getPaymentInfo),
    sendSuccess,
  )

  // Error handling middleware (needs to be defined last)
  .use(errorHandler)

export default publicApiRouter
