"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = require("@xpring-eng/http-status");
const payIdError_1 = require("./payIdError");
/**
 * A custom error type to organize logic around 415 - Unsupported Media Type errors.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/415|MDN Unsupported Media Type (415)}.
 */
class ContentTypeError extends payIdError_1.default {
    /**
     * The constructor for new ContentTypeError.
     *
     * @param mediaType - The Media Type (also called Content Type) required by the request.
     */
    constructor(mediaType) {
        // All content type errors are the result of a 415 Unsupported Media Type error
        const message = `A 'Content-Type' header is required for this request: 'Content-Type: ${mediaType}'.`;
        super(message, http_status_1.default.UnsupportedMediaType);
        this.kind = 'UnsupportedMediaTypeHeader';
    }
}
exports.default = ContentTypeError;
//# sourceMappingURL=contentTypeError.js.map