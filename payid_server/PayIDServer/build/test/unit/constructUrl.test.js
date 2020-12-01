"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const urls_1 = require("../../src/services/urls");
describe('Parsing - URLs - constructUrl()', function () {
    it('returns a url from components', function () {
        // GIVEN a set of URL components
        const protocol = 'https';
        const hostname = 'example.com';
        const path = '/alice';
        const expectedUrl = 'https://example.com/alice';
        // WHEN we attempt converting them to a URL
        const actualUrl = urls_1.constructUrl(protocol, hostname, path);
        // THEN we get our expected URL
        chai_1.assert.strictEqual(actualUrl, expectedUrl);
    });
    it('returns a url with a port from components', function () {
        // GIVEN a set of URL components w/ a port
        const protocol = 'https';
        const hostname = 'example.com';
        const path = '/alice';
        const port = '8080';
        const expectedUrl = 'https://example.com:8080/alice';
        // WHEN we attempt converting them to a URL
        const actualUrl = urls_1.constructUrl(protocol, hostname, path, port);
        // THEN we get our expected URL w/ a port
        chai_1.assert.strictEqual(actualUrl, expectedUrl);
    });
});
//# sourceMappingURL=constructUrl.test.js.map