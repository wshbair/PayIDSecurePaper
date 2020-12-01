"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const urls_1 = require("../../src/services/urls");
describe('Parsing - URLs - urlToPayId()', function () {
    it('throws an error on inputs that are not HTTP/HTTPS', function () {
        // GIVEN a badly formed input
        const url = 'ftp://example.com/alice';
        const expectedErrorMessage = 'Invalid PayID URL protocol. PayID URLs must be HTTP/HTTPS.';
        // WHEN we attempt converting it to a PayID
        const badConversion = () => urls_1.urlToPayId(url);
        // THEN we get our expected error
        chai_1.assert.throws(badConversion, expectedErrorMessage);
    });
    it('Handles an HTTPS PayID URL', function () {
        // GIVEN an http URL
        const url = 'https://example.com/alice';
        const expectedPayId = 'alice$example.com';
        // WHEN we attempt converting it to a PayID
        const actualPayId = urls_1.urlToPayId(url);
        // THEN we get our expected error
        chai_1.assert.strictEqual(actualPayId, expectedPayId);
    });
    it('Handles an HTTP PayID URL', function () {
        // GIVEN an http URL
        const url = 'http://example.com/alice';
        const expectedPayId = 'alice$example.com';
        // WHEN we attempt converting it to a PayID
        const actualPayId = urls_1.urlToPayId(url);
        // THEN we get our expected PayId
        chai_1.assert.strictEqual(actualPayId, expectedPayId);
    });
    it('throws an error on inputs that are not ASCII', function () {
        // GIVEN a badly formed PayID URL (non-ASCII)
        // Note that this is a real TLD that exists
        const url = 'https://hansbergren.example.संगठन';
        const expectedErrorMessage = 'Invalid PayID characters. PayIDs must be ASCII.';
        // WHEN we attempt converting it to a PayID
        const badConversion = () => urls_1.urlToPayId(url);
        // THEN we get our expected error
        chai_1.assert.throws(badConversion, expectedErrorMessage);
    });
    it('throws an error on an invalid URL', function () {
        // GIVEN an invalid PayID URL (multi-step path)
        const url = 'https://example.com/badPath/alice';
        const expectedErrorMessage = 'Too many paths. The only paths allowed in a PayID are to specify the user.';
        // WHEN we attempt converting it to a PayID
        const badConversion = () => urls_1.urlToPayId(url);
        // THEN we get our expected error & error message
        chai_1.assert.throws(badConversion, expectedErrorMessage);
    });
    it('handles a PayID URL with a subdomain', function () {
        // GIVEN a PayID URL with a subdomain
        const url = 'https://payid.example.com/alice';
        const expectedPayId = 'alice$payid.example.com';
        // WHEN we attempt converting it to a PayID
        const actualPayId = urls_1.urlToPayId(url);
        // THEN we get our expected PayID
        chai_1.assert.strictEqual(actualPayId, expectedPayId);
    });
    it('handles a PayID URL with capital letters', function () {
        // GIVEN a PayID URL with capitals
        const url = 'https://example.com/ALICE';
        const expectedPayId = 'alice$example.com';
        // WHEN we attempt converting it to a PayID
        const actualPayId = urls_1.urlToPayId(url);
        // THEN we get our expected PayID
        chai_1.assert.strictEqual(actualPayId, expectedPayId);
    });
});
//# sourceMappingURL=urlToPayId.test.js.map