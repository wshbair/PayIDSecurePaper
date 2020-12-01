"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const adminApiHeaders_1 = require("../middlewares/adminApiHeaders");
const errorHandler_1 = require("../middlewares/errorHandler");
const sendSuccess_1 = require("../middlewares/sendSuccess");
const users_1 = require("../middlewares/users");
const adminApiRouter = express.Router();
/**
 * Routes for the PayID Admin API.
 */
adminApiRouter
    // All /:payId requests should have an Accept-Patch response header with the PATCH mime type
    .use('/:payId', adminApiHeaders_1.addAcceptPatchResponseHeader)
    // All [POST, PUT, PATCH] requests should have an appropriate Content-Type header,
    // AND all Admin API requests should have an appropriate PayID-API-Version header.
    .use('/*', adminApiHeaders_1.checkRequestContentType, adminApiHeaders_1.checkRequestAdminApiVersionHeaders)
    // Get user route
    .get('/:payId', errorHandler_1.wrapAsync(users_1.getUser), sendSuccess_1.default)
    // Create user route
    .post('/', express.json(), errorHandler_1.wrapAsync(users_1.postUser), sendSuccess_1.default)
    // Replace user route
    .put('/:payId', express.json(), errorHandler_1.wrapAsync(users_1.putUser), sendSuccess_1.default)
    // Delete user route
    .delete('/:payId', errorHandler_1.wrapAsync(users_1.deleteUser), sendSuccess_1.default)
    // Patch user's PayID route
    .patch('/:payId', express.json({ type: 'application/merge-patch+json' }), errorHandler_1.wrapAsync(users_1.patchUserPayId), sendSuccess_1.default)
    // Error handling middleware (needs to be defined last)
    .use(errorHandler_1.default);
exports.default = adminApiRouter;
//# sourceMappingURL=adminApiRouter.js.map