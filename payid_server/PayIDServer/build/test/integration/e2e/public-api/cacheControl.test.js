"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const http_status_1 = require("@xpring-eng/http-status");
const request = require("supertest");
const config_1 = require("../../../../src/config");
const helpers_1 = require("../../../helpers/helpers");
let app;
const payIdServerVersion = config_1.default.app.payIdVersion;
describe('E2E - publicAPIRouter - Cache Control', function () {
    // Boot up Express application and initialize DB connection pool
    before(async function () {
        app = await helpers_1.appSetup();
    });
    it('Returns a "no-store" Cache-Control header', function (done) {
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
            // AND we expect a "no-store" Cache-Control response header
            .expect('Cache-Control', 'no-store')
            // AND we expect a 200 - OK
            .expect(http_status_1.default.OK, done);
    });
    // Shut down Express application and close DB connections
    after(function () {
        helpers_1.appCleanup(app);
    });
});
//# sourceMappingURL=cacheControl.test.js.map