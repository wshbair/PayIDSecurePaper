"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = require("@xpring-eng/http-status");
const request = require("supertest");
const helpers_1 = require("../../../helpers/helpers");
const discoveryLinks = require("./testDiscoveryLinks.json");
let app;
const discoveryPath = '/.well-known/webfinger';
describe('E2E - publicAPIRouter - PayID Discovery', function () {
    // Boot up Express application and initialize DB connection pool
    before(async function () {
        app = await helpers_1.appSetup();
    });
    it('Discovery query returns JRD', function (done) {
        // GIVEN a PayID
        const payId = 'alice$wallet.com';
        const expectedResponse = {
            subject: payId,
            links: discoveryLinks,
        };
        // WHEN we make a GET request to the PayID Discovery endpoint
        request(app.publicApiExpress)
            .get(`${discoveryPath}?resource=${payId}`)
            // THEN we get back a JRD with subject = the PayID and all links from the discoveryLinks.json file
            .expect(http_status_1.default.OK, expectedResponse, done);
    });
    it('Discovery query with no PayID in request parameter returns 400', function (done) {
        // GIVEN no PayID for a PayID Discovery request
        const expectedErrorResponse = {
            statusCode: 400,
            error: 'Bad Request',
            message: 'A PayID must be provided in the `resource` request parameter.',
        };
        // WHEN we make a GET request to the PayID Discovery endpoint with no `resource` request parameter
        request(app.publicApiExpress)
            .get(discoveryPath)
            // THEN we get back a 400 with the expected error message
            .expect(http_status_1.default.BadRequest, expectedErrorResponse, done);
    });
    after(function () {
        helpers_1.appCleanup(app);
    });
});
//# sourceMappingURL=discovery.test.js.map