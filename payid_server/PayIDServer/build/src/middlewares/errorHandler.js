"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapAsync = void 0;
const http_status_1 = require("@xpring-eng/http-status");
const metrics_1 = require("../services/metrics");
const errors_1 = require("../utils/errors");
/**
 * An error handling middleware responsible for catching unhandled errors,
 * and sending out an appropriate HTTP error response.
 *
 * @param err - An uncaught error to be handled by our error handler.
 * @param _req - An Express Request object (unused).
 * @param res - An Express Response object.
 * @param next - An Express next() function. Used for delegating to the default error handler.
 *
 * @returns Nothing.
 */
function errorHandler(err, _req, res, next) {
    // https://expressjs.com/en/guide/error-handling.html
    // If you call next() with an error after you have started writing the response,
    // (for example, if you encounter an error while streaming the response to the client),
    // the Express default error handler closes the connection and fails the request.
    //
    // So, when you add a custom error handler,
    // you must delegate to the default Express error handler when the headers have already been sent to the client.
    if (res.headersSent) {
        return next(err);
    }
    let status = http_status_1.default.InternalServerError;
    if (err instanceof errors_1.PayIDError) {
        status = err.httpStatusCode;
        // Collect metrics on public API requests with bad Accept headers
        if (err.kind === errors_1.ParseErrorType.InvalidMediaType) {
            metrics_1.default.recordPayIdLookupBadAcceptHeader();
        }
        // Collect metrics on public API requests to a PayID that does not exist
        if (err.kind === errors_1.LookupErrorType.MissingPayId &&
            err instanceof errors_1.LookupError &&
            err.headers) {
            err.headers.forEach((acceptType) => metrics_1.default.recordPayIdLookupResult(false, acceptType.paymentNetwork, acceptType.environment));
        }
    }
    return errors_1.handleHttpError(status, err.message, res, err);
}
exports.default = errorHandler;
/**
 * A function used to wrap asynchronous Express middlewares.
 * It catches async errors so Express can pass them to an error handling middleware.
 *
 * @param handler - An Express middleware function.
 *
 * @returns An Express middleware capable of catching asynchronous errors.
 */
function wrapAsync(handler) {
    return async (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}
exports.wrapAsync = wrapAsync;
//# sourceMappingURL=errorHandler.js.map