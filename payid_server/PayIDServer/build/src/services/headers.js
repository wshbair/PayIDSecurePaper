"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAcceptHeader = exports.parseAcceptHeaders = void 0;
const errors_1 = require("../utils/errors");
const badAcceptHeaderErrorMessage = `Must have an Accept header of the form "application/{payment_network}(-{environment})+json".
      Examples:
      - 'Accept: application/xrpl-mainnet+json'
      - 'Accept: application/btc-testnet+json'
      - 'Accept: application/ach+json'
      - 'Accept: application/payid+json'
      `;
/**
 * Parses a list of accept headers to confirm they adhere to the PayID accept header syntax.
 *
 * @param acceptHeaders - A list of accept headers.
 *
 * @returns A parsed list of accept headers.
 *
 * @throws A custom ParseError when the Accept Header is missing.
 */
// TODO(dino): Generate this error code from a list of supported media types
// TODO(dino): Move the metrics capturing to the error handling middleware
function parseAcceptHeaders(acceptHeaders) {
    // MUST include at least 1 accept header
    if (!acceptHeaders.length) {
        throw new errors_1.ParseError(`Missing Accept Header. ${badAcceptHeaderErrorMessage}`, errors_1.ParseErrorType.InvalidMediaType);
    }
    // Accept types MUST be the proper format
    const parsedAcceptHeaders = acceptHeaders.map((type) => parseAcceptHeader(type));
    return parsedAcceptHeaders;
}
exports.parseAcceptHeaders = parseAcceptHeaders;
// HELPERS
/**
 * Parses an accept header for valid syntax.
 *
 * @param acceptHeader - A string representation of an accept header to validate.
 *
 * @returns A parsed accept header.
 *
 * @throws A custom ParseError when the Accept Header is invalid.
 */
function parseAcceptHeader(acceptHeader) {
    const ACCEPT_HEADER_REGEX = /^(?:application\/)(?<paymentNetwork>\w+)-?(?<environment>\w+)?(?:\+json)$/u;
    const lowerCaseMediaType = acceptHeader.toLowerCase();
    const regexResult = ACCEPT_HEADER_REGEX.exec(lowerCaseMediaType);
    if (!regexResult || !regexResult.groups) {
        throw new errors_1.ParseError(`Invalid Accept Header. ${badAcceptHeaderErrorMessage}`, errors_1.ParseErrorType.InvalidMediaType);
    }
    return {
        mediaType: lowerCaseMediaType,
        // Optionally returns the environment (only if it exists)
        ...(regexResult.groups.environment && {
            environment: regexResult.groups.environment.toUpperCase(),
        }),
        paymentNetwork: regexResult.groups.paymentNetwork.toUpperCase(),
    };
}
exports.parseAcceptHeader = parseAcceptHeader;
//# sourceMappingURL=headers.js.map