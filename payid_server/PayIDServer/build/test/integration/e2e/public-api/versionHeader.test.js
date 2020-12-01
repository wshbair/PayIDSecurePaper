"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const http_status_1 = require("@xpring-eng/http-status");
const request = require("supertest");
const config_1 = require("../../../../src/config");
const helpers_1 = require("../../../helpers/helpers");
let app;
const earliestPayIdServerVersion = config_1.payIdServerVersions[0];
const payIdServerVersion = config_1.default.app.payIdVersion;
describe('E2E - publicAPIRouter - Version Headers', function () {
    // Boot up Express application and initialize DB connection pool
    before(async function () {
        app = await helpers_1.appSetup();
    });
    it('Returns a 400 - Bad Request when we omit a PayID-Version header', function (done) {
        // GIVEN a PayID known to have an associated xrpl-mainnet address
        const payId = '/alice';
        const acceptHeader = 'application/xrpl-mainnet+json';
        const expectedErrorResponse = {
            statusCode: 400,
            error: 'Bad Request',
            message: "A PayID-Version header is required in the request, of the form 'PayID-Version: {major}.{minor}'.",
        };
        // WHEN we make a GET request without specifying a PayID-Version header
        request(app.publicApiExpress)
            .get(payId)
            .set('Accept', acceptHeader)
            // THEN we expect to get back the latest PayID version as the server version
            .expect('PayID-Server-Version', payIdServerVersion)
            // AND we expect a 400 - Bad Request
            .expect(http_status_1.default.BadRequest, expectedErrorResponse, done);
    });
    it('Returns a 400 - Bad Request when we provide a malformed PayID-Version header', function (done) {
        // GIVEN a PayID known to have an associated xrpl-mainnet address
        const payId = '/alice';
        const acceptHeader = 'application/xrpl-mainnet+json';
        const expectedErrorResponse = {
            statusCode: 400,
            error: 'Bad Request',
            message: "A PayID-Version header must be in the form 'PayID-Version: {major}.{minor}'.",
        };
        // WHEN we make a GET request specifying a malformed PayID-Version header
        request(app.publicApiExpress)
            .get(payId)
            .set('PayID-Version', 'abc')
            .set('Accept', acceptHeader)
            // THEN we expect to get back the latest PayID version as the server version
            .expect('PayID-Server-Version', payIdServerVersion)
            // AND we expect a 400 - Bad Request
            .expect(http_status_1.default.BadRequest, expectedErrorResponse, done);
    });
    it('Returns a 400 - Bad Request when we provide an unsupported PayID-Version header (greater than PayID server)', function (done) {
        // GIVEN a PayID known to have an associated xrpl-mainnet address
        const payId = '/alice';
        const acceptHeader = 'application/xrpl-mainnet+json';
        const payIdVersion = '100.0';
        const expectedErrorResponse = {
            statusCode: 400,
            error: 'Bad Request',
            message: `The PayID-Version ${payIdVersion} is not supported, please try downgrading your request to PayID-Version ${payIdServerVersion}`,
        };
        // WHEN we make a GET request specifying an unsupported PayID-Version header
        request(app.publicApiExpress)
            .get(payId)
            .set('PayID-Version', payIdVersion)
            .set('Accept', acceptHeader)
            // THEN we expect to get back the latest PayID version as the server version
            .expect('PayID-Server-Version', payIdServerVersion)
            // AND we expect a 400 - Bad Request
            .expect(http_status_1.default.BadRequest, expectedErrorResponse, done);
    });
    it('Returns a 400 - Bad Request when we provide an unknown PayID-Version header', function (done) {
        // GIVEN a PayID known to have an associated xrpl-mainnet address
        const payId = '/alice';
        const acceptHeader = 'application/xrpl-mainnet+json';
        const payIdVersion = '0.1';
        const expectedErrorResponse = {
            statusCode: 400,
            error: 'Bad Request',
            message: `The PayID Version ${payIdVersion} is not supported, try something in the range ${earliestPayIdServerVersion} - ${payIdServerVersion}`,
        };
        // WHEN we make a GET request specifying an unsupported PayID-Version header
        request(app.publicApiExpress)
            .get(payId)
            .set('PayID-Version', payIdVersion)
            .set('Accept', acceptHeader)
            // THEN we expect to get back the latest PayID version as the server version
            .expect('PayID-Server-Version', payIdServerVersion)
            // AND we expect a 400 - Bad Request
            .expect(http_status_1.default.BadRequest, expectedErrorResponse, done);
    });
    it('Returns a 200 - OK when we provide a valid PayID-Version header', function (done) {
        // GIVEN a PayID known to have an associated xrpl-mainnet address
        const payId = '/alice';
        const acceptHeader = 'application/xrpl-mainnet+json';
        const payIdVersion = payIdServerVersion;
        // WHEN we make a GET request specifying a supported PayID-Version header
        request(app.publicApiExpress)
            .get(payId)
            .set('PayID-Version', payIdVersion)
            .set('Accept', acceptHeader)
            // THEN we expect to get back the latest PayID version as the server version
            .expect('PayID-Server-Version', payIdServerVersion)
            // AND we expect to get back the payload using the PayID-Version we specified in the request
            .expect('PayID-Version', payIdVersion)
            // AND we expect a 200 - OK
            .expect(http_status_1.default.OK, done);
    });
    // Shut down Express application and close DB connections
    after(function () {
        helpers_1.appCleanup(app);
    });
});
//# sourceMappingURL=versionHeader.test.js.map