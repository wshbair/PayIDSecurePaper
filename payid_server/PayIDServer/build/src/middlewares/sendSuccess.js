"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = require("@xpring-eng/http-status");
const logger_1 = require("../utils/logger");
/**
 * Sends an HTTP response with the appropriate HTTP status and JSON-formatted payload (if any).
 *
 * It also sets the Location header on responses for 201 - Created responses.
 *
 * @param req - An Express Request object.
 * @param res - An Express Response object.
 */
function sendSuccess(req, res) {
    var _a;
    const status = Number((_a = res.locals) === null || _a === void 0 ? void 0 : _a.status) || http_status_1.default.OK;
    // Set a location header when our status is 201 - Created
    if (status === http_status_1.default.Created) {
        // The first part of the destructured array will be "", because the string starts with "/"
        // And for PUT commands, the path could potentially hold more after `userPath`.
        const [, userPath] = req.originalUrl.split('/');
        const locationHeader = ['', userPath, res.locals.payId].join('/');
        res.location(locationHeader);
    }
    // Debug-level log all successful requests
    // Do not log health checks
    if (req.originalUrl !== '/status/health') {
        logger_1.default.debug(status, (() => {
            if (res.get('PayID-API-Server-Version')) {
                return '- Admin API:';
            }
            return '- Public API:';
        })(), `${req.method} ${req.originalUrl}`);
    }
    if (res.locals.response) {
        res.status(status).json(res.locals.response);
    }
    else {
        res.sendStatus(status);
    }
}
exports.default = sendSuccess;
//# sourceMappingURL=sendSuccess.js.map