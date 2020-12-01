"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Boom = require("@hapi/boom");
const http_status_1 = require("@xpring-eng/http-status");
const logger_1 = require("../logger");
/**
 * A helper function for logging errors and sending the HTTP error response.
 *
 * @param errorCode - An HTTP error code.
 * @param msg - The error message.
 * @param res - An Express Response object, for sending the HTTP response.
 * @param err - The associated error object (optional).
 *
 * TODO:(hbergren) Kill this function and put this logic in our errorHandler.
 */
function handleHttpError(errorCode, msg, res, err) {
    var _a, _b;
    // Logging for our debugging purposes
    if (errorCode >= http_status_1.default.InternalServerError) {
        logger_1.default.error(errorCode, ':', (_a = err === null || err === void 0 ? void 0 : err.toString()) !== null && _a !== void 0 ? _a : msg);
    }
    else {
        logger_1.default.warn(errorCode, ':', (_b = err === null || err === void 0 ? void 0 : err.toString()) !== null && _b !== void 0 ? _b : msg);
    }
    // Error code matching
    let error;
    switch (errorCode) {
        case http_status_1.default.BadRequest:
            error = Boom.badRequest(msg).output.payload;
            break;
        case http_status_1.default.NotFound:
            error = Boom.notFound(msg).output.payload;
            break;
        case http_status_1.default.Conflict:
            error = Boom.conflict(msg).output.payload;
            break;
        case http_status_1.default.UnsupportedMediaType:
            error = Boom.unsupportedMediaType(msg).output.payload;
            break;
        default:
            // This is a 500 internal server error
            error = Boom.badImplementation(msg).output.payload;
    }
    res.status(errorCode).json(error);
}
exports.default = handleHttpError;
//# sourceMappingURL=handleHttpError.js.map