"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseErrorType = void 0;
const http_status_1 = require("@xpring-eng/http-status");
const payIdError_1 = require("./payIdError");
/**
 * An enum containing the different kinds of ParseErrors.
 */
var ParseErrorType;
(function (ParseErrorType) {
    ParseErrorType["InvalidMediaType"] = "InvalidMediaType";
    // PayID Stuff
    ParseErrorType["MissingPayId"] = "MissingPayId";
    ParseErrorType["InvalidPayId"] = "InvalidPayId";
    // These are the Public API version header errors for the PayID Protocol.
    ParseErrorType["MissingPayIdVersionHeader"] = "MissingPayIdVersionHeader";
    ParseErrorType["InvalidPayIdVersionHeader"] = "InvalidPayIdVersionHeader";
    ParseErrorType["UnsupportedPayIdVersionHeader"] = "UnsupportedPayIdVersionHeader";
    ParseErrorType["InvalidAuthenticationHeader"] = "InvalidAuthenticationHeader";
    ParseErrorType["UnauthorizedAccess"] = "UnauthorizedAccess";
    // These are the Admin API version header errors, for the CRUD PayID API service.
    ParseErrorType["MissingPayIdApiVersionHeader"] = "MissingPayIdApiVersionHeader";
    ParseErrorType["InvalidPayIdApiVersionHeader"] = "InvalidPayIdApiVersionHeader";
    ParseErrorType["UnsupportedPayIdApiVersionHeader"] = "UnsupportedPayIdApiVersionHeader";
})(ParseErrorType = exports.ParseErrorType || (exports.ParseErrorType = {}));
/**
 * A custom error type to organize logic around 400 - Bad Request errors.
 */
class ParseError extends payIdError_1.default {
    /**
     * The constructor for new ParseErrors.
     *
     * @param message - An error message.
     * @param kind - The kind of ParseError for this error instance.
     */
    constructor(message, kind) {
        // All parsing errors are the result of a bad request
        super(message, http_status_1.default.BadRequest);
        this.kind = kind;
    }
}
exports.default = ParseError;
//# sourceMappingURL=parseError.js.map