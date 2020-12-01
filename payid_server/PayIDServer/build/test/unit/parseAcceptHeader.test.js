"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const headers_1 = require("../../src/services/headers");
const errors_1 = require("../../src/utils/errors");
describe('Parsing - Headers - parseAcceptHeader()', function () {
    it('Parses a string with a valid media type', function () {
        // GIVEN a string with a valid Accept type
        const validAcceptMediaType = 'application/xrpl-testnet+json';
        const expectedParsedAcceptHeader = {
            mediaType: validAcceptMediaType,
            paymentNetwork: 'XRPL',
            environment: 'TESTNET',
        };
        // WHEN we attempt to parse it
        const parsedAcceptHeader = headers_1.parseAcceptHeader(validAcceptMediaType);
        // THEN we successfully parsed the parts
        chai_1.assert.deepStrictEqual(parsedAcceptHeader, expectedParsedAcceptHeader);
    });
    it('Parses a string with a valid media type without an environment', function () {
        // GIVEN a string with a valid Accept type
        const validAcceptMediaType = 'application/ach+json';
        const expectedParsedAcceptHeader = {
            mediaType: validAcceptMediaType,
            paymentNetwork: 'ACH',
        };
        // WHEN we attempt to parse it
        const parsedAcceptHeader = headers_1.parseAcceptHeader(validAcceptMediaType);
        // THEN we successfully parsed the parts
        chai_1.assert.deepStrictEqual(parsedAcceptHeader, expectedParsedAcceptHeader);
    });
    it('Throws an error when parsing a string with an invalid media type', function () {
        // GIVEN a string with an invalid Accept type
        const invalidAcceptMediaType = 'invalid-type';
        // WHEN we attempt to parse it
        const invalidMediaTypeParse = () => headers_1.parseAcceptHeader(invalidAcceptMediaType);
        // THEN we throw a ParseError
        chai_1.assert.throws(invalidMediaTypeParse, errors_1.ParseError, `Invalid Accept Header. Must have an Accept header of the form "application/{payment_network}(-{environment})+json".
      Examples:
      - 'Accept: application/xrpl-mainnet+json'
      - 'Accept: application/btc-testnet+json'
      - 'Accept: application/ach+json'
      - 'Accept: application/payid+json'
      `);
    });
});
//# sourceMappingURL=parseAcceptHeader.test.js.map