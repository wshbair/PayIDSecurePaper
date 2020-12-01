"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const http_status_1 = require("@xpring-eng/http-status");
const request = require("supertest");
const helpers_1 = require("../../../helpers/helpers");
let app;
describe('E2E - publicAPIRouter - Health Check', function () {
    before(async function () {
        app = await helpers_1.appSetup();
    });
    it('Returns a 200 - OK for a GET /status/health', function (done) {
        request(app.publicApiExpress)
            .get('/status/health')
            .expect(http_status_1.default.OK, 'OK', done);
    });
    after(function () {
        helpers_1.appCleanup(app);
    });
});
//# sourceMappingURL=healthCheck.test.js.map