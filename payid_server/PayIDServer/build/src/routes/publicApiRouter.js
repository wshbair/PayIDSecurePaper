"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const express = require("express");
const checkPublicApiVersionHeaders_1 = require("../middlewares/checkPublicApiVersionHeaders");
const constructJrd_1 = require("../middlewares/constructJrd");
const errorHandler_1 = require("../middlewares/errorHandler");
const initializeMetrics_1 = require("../middlewares/initializeMetrics");
const payIds_1 = require("../middlewares/payIds");
const sendSuccess_1 = require("../middlewares/sendSuccess");
//import checkAuthentication from '../middlewares/checkAuthentication'
const acl_1 = require("../middlewares/acl");
const agents_1 = require("../middlewares/agents");
const publicApiRouter = express.Router();
/**
 * Routes for the PayID Public API.
 */
publicApiRouter
    // Allow the PayID Protocol to basically ignore CORS
    .use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'PayID-Version');
    res.header('Access-Control-Expose-Headers', 'PayID-Version, PayID-Server-Version');
    next();
})
    // Welcome page route
    .get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, '../html/index.html'));
})
    // Favicon route
    .get('/favicon.ico', (_req, res) => {
    res.sendFile(path.join(__dirname, '../html/favicon.ico'));
})
    // Authorized access to PayID account information
    .post('/payId/authorize', express.json(), errorHandler_1.wrapAsync(acl_1.addAuthorizedUser), sendSuccess_1.default)
    // Get authorized PayID account info.
    //.post('/payId/', express.json(), getProtectedPayId, sendSuccess)
    //.post('/createjwk', express.json(), wrapAsync(getJWK),sendSuccess)
    // Health route
    .get('/status/health', sendSuccess_1.default)
    // PayID Discovery route
    .get('./well-known/webfinger', constructJrd_1.default, sendSuccess_1.default)
    .get('/graylist', errorHandler_1.wrapAsync(acl_1.getGrayListOfPayId), sendSuccess_1.default)
    // HYPERLEDGER ARIES AGENT
    .get('/agent/status', errorHandler_1.wrapAsync(agents_1.getStatus), sendSuccess_1.default)
    .get('/agent/connections', errorHandler_1.wrapAsync(agents_1.getConnections), sendSuccess_1.default)
    // Credential Proof Hook does not work
    // .post("/request", (req, res) => {
    //   console.log('From the HOOCK')
    //   console.log(req.body) // Call your action on the request here
    //   res.status(200).end() // Responding is important
    // })
    //Grab a user credential via the connection -Not NEEDED
    //.post('/credential/pull', express.json(), wrapAsync(pullUserCredential), sendSuccess)
    // Base PayID route
    .get('/*', checkPublicApiVersionHeaders_1.default, 
//wrapAsync(checkAuthentication),
initializeMetrics_1.default, errorHandler_1.wrapAsync(payIds_1.default), sendSuccess_1.default)
    // Error handling middleware (needs to be defined last)
    .use(errorHandler_1.default);
exports.default = publicApiRouter;
//# sourceMappingURL=publicApiRouter.js.map