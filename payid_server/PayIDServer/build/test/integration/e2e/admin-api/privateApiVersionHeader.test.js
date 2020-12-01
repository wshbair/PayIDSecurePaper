"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const http_status_1 = require("@xpring-eng/http-status");
const request = require("supertest");
const config_1 = require("../../../../src/config");
const helpers_1 = require("../../../helpers/helpers");
let app;
describe('E2E - adminApiRouter - Version Headers', function () {
    // Boot up Express application and initialize DB connection pool
    before(async function () {
        app = await helpers_1.appSetup();
    });
    it('Returns a 400 - Bad Request when we omit a PayID-API-Version header', function (done) {
        // GIVEN a PayID known to resolve to an account on the PayID service
        const payId = 'alice$xpring.money';
        const expectedErrorResponse = {
            statusCode: 400,
            error: 'Bad Request',
            message: "A PayID-API-Version header is required in the request, of the form 'PayID-API-Version: YYYY-MM-DD'.",
        };
        // WHEN we make a GET request to /users/ with that PayID as our user
        request(app.adminApiExpress)
            .get(`/users/${payId}`)
            .expect('PayID-API-Server-Version', config_1.default.app.adminApiVersion)
            .expect('Content-Type', /json/u)
            // THEN We expect back a 400 - Bad Request
            .expect(http_status_1.default.BadRequest, expectedErrorResponse, done);
    });
    it('Returns a 400 - Bad Request when we provide a malformed PayID-API-Version header', function (done) {
        // GIVEN a PayID known to resolve to an account on the PayID service
        const payId = 'alice$xpring.money';
        const payIdApiVersion = 'a-b-c';
        const expectedErrorResponse = {
            statusCode: 400,
            error: 'Bad Request',
            message: "A PayID-API-Version header must be in the form 'PayID-API-Version: YYYY-MM-DD'.",
        };
        // WHEN we make a GET request to /users/ with that PayID as our user
        request(app.adminApiExpress)
            .get(`/users/${payId}`)
            .set('PayID-API-Version', payIdApiVersion)
            .expect('PayID-API-Server-Version', config_1.default.app.adminApiVersion)
            .expect('Content-Type', /json/u)
            // THEN We expect back a 400 - Bad Request
            .expect(http_status_1.default.BadRequest, expectedErrorResponse, done);
    });
    it('Returns a 400 - Bad Request when we provide an unsupported PayID-API-Version header (less than first Version cut)', function (done) {
        // GIVEN a PayID known to resolve to an account on the PayID service
        const payId = 'alice$xpring.money';
        const payIdApiVersion = '2020-05-27';
        const expectedErrorResponse = {
            statusCode: 400,
            error: 'Bad Request',
            message: `The PayID-API-Version ${payIdApiVersion} is not supported, please try upgrading your request to at least 'PayID-API-Version: ${config_1.adminApiVersions[0]}'`,
        };
        // WHEN we make a GET request to /users/ with that PayID as our user
        request(app.adminApiExpress)
            .get(`/users/${payId}`)
            .set('PayID-API-Version', payIdApiVersion)
            .expect('PayID-API-Server-Version', config_1.default.app.adminApiVersion)
            .expect('Content-Type', /json/u)
            // THEN We expect back a 400 - Bad Request
            .expect(http_status_1.default.BadRequest, expectedErrorResponse, done);
    });
    it('Returns a 200 - OK when we provide a valid PayID-Version header', function (done) {
        // GIVEN a PayID known to resolve to an account on the PayID service
        const payId = 'alice$xpring.money';
        // WHEN we make a GET request to /users/ with that PayID as our user
        request(app.adminApiExpress)
            .get(`/users/${payId}`)
            .set('PayID-API-Version', config_1.default.app.adminApiVersion)
            .expect('PayID-API-Server-Version', config_1.default.app.adminApiVersion)
            .expect('Content-Type', /json/u)
            // THEN We expect back a 200 - OK, with the account information
            .expect(http_status_1.default.OK, done);
    });
    // Shut down Express application and close DB connections
    after(function () {
        helpers_1.appCleanup(app);
    });
});
//# sourceMappingURL=privateApiVersionHeader.test.js.map