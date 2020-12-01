"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LookupErrorType = void 0;
const http_status_1 = require("@xpring-eng/http-status");
const payIdError_1 = require("./payIdError");
var LookupErrorType;
(function (LookupErrorType) {
    LookupErrorType["MissingPayId"] = "MissingPayId";
    LookupErrorType["MissingAddress"] = "MissingAddress";
    // TODO: Remove Unknown after MissingPayId/MissingAddress are implemented
    LookupErrorType["Unknown"] = "Unknown";
})(LookupErrorType = exports.LookupErrorType || (exports.LookupErrorType = {}));
/**
 * A custom error class to organize logic around errors related to a 404 - Not Found.
 */
class LookupError extends payIdError_1.default {
    /**
     * The constructor for new LookupErrors.
     *
     * @param message - An error message.
     * @param kind - The kind of LookupError for this instance.
     * @param headers - The headers used for the PayID lookup.
     */
    constructor(message, kind, headers) {
        // All lookup errors should return a 404 - Not Found
        super(message, http_status_1.default.NotFound);
        this.kind = kind;
        this.headers = headers;
    }
}
exports.default = LookupError;
//# sourceMappingURL=lookupError.js.map