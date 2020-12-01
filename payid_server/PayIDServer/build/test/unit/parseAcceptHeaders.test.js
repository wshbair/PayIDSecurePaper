"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const headers_1 = require("../../src/services/headers");
const errors_1 = require("../../src/utils/errors");
describe('Parsing - Headers - parseAcceptHeaders()', function () {
    it('Parses a list with a valid media type strings', function () {
        // GIVEN a string with a valid Accept type
        const validAcceptMediaType1 = 'application/xrpl-testnet+json';
        const validAcceptMediaType2 = 'application/xrpl-mainnet+json';
        const expectedParsedAcceptHeader1 = {
            mediaType: validAcceptMediaType1,
            paymentNetwork: 'XRPL',
            environment: 'TESTNET',
        };
        const expectedParsedAcceptHeader2 = {
            mediaType: validAcceptMediaType2,
            paymentNetwork: 'XRPL',
            environment: 'MAINNET',
        };
        // WHEN we attempt to parse it
        const parsedAcceptHeaders = headers_1.parseAcceptHeaders([
            validAcceptMediaType1,
            validAcceptMediaType2,
        ]);
        // THEN we successfully parsed the parts
        chai_1.assert.deepStrictEqual(parsedAcceptHeaders[0], expectedParsedAcceptHeader1);
        chai_1.assert.deepStrictEqual(parsedAcceptHeaders[1], expectedParsedAcceptHeader2);
    });
    it('Throws an error on an empty list of media types', function () {
        const expectedError = `Missing Accept Header. Must have an Accept header of the form "application/{payment_network}(-{environment})+json".
      Examples:
      - 'Accept: application/xrpl-mainnet+json'
      - 'Accept: application/btc-testnet+json'
      - 'Accept: application/ach+json'
      - 'Accept: application/payid+json'
      `;
        // GIVEN an empty list
        // WHEN we attempt to parse it
        const invalidMediaTypeParse = () => headers_1.parseAcceptHeaders([])[0];
        // THEN we throw a ParseError
        chai_1.assert.throws(invalidMediaTypeParse, errors_1.ParseError, expectedError);
    });
    it('Throws an error if the list contains an invalid media type', function () {
        // GIVEN a string with an invalid Accept type
        const invalidAcceptMediaType = 'invalid-type';
        const validAcceptMediaType = 'application/xrpl-testnet+json';
        const expectedError = `Invalid Accept Header. Must have an Accept header of the form "application/{payment_network}(-{environment})+json".
      Examples:
      - 'Accept: application/xrpl-mainnet+json'
      - 'Accept: application/btc-testnet+json'
      - 'Accept: application/ach+json'
      - 'Accept: application/payid+json'
      `;
        // WHEN we attempt to parse it
        const invalidMediaTypeParse = () => headers_1.parseAcceptHeaders([invalidAcceptMediaType, validAcceptMediaType])[0];
        // THEN we throw a ParseError
        chai_1.assert.throws(invalidMediaTypeParse, errors_1.ParseError, expectedError);
    });
});
//# sourceMappingURL=parseAcceptHeaders.test.js.map