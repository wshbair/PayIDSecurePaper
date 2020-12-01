"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = require("@xpring-eng/http-status");
const request = require("supertest");
require("mocha");
const helpers_1 = require("../../../helpers/helpers");
let app;
const payIdApiVersion = '2020-05-28';
const acceptPatch = 'application/merge-patch+json';
describe('E2E - adminApiRouter - DELETE /users', function () {
    before(async function () {
        app = await helpers_1.appSetup();
    });
    it('Returns a 204 and no payload when deleting an account', function (done) {
        // GIVEN a PayID known to resolve to an account on the PayID service
        const payId = 'alice$xpring.money';
        const missingPayIdError = {
            error: 'Not Found',
            message: `No information could be found for the PayID ${payId}.`,
            statusCode: 404,
        };
        // WHEN we make a DELETE request to /users/ with the PayID to delete
        request(app.adminApiExpress)
            .delete(`/users/${payId}`)
            .set('PayID-API-Version', payIdApiVersion)
            // THEN we expect to have an Accept-Patch header in the response
            .expect('Accept-Patch', acceptPatch)
            // THEN we expect back a 204-No Content, indicating successful deletion
            .expect(http_status_1.default.NoContent)
            .then((_res) => {
            // AND subsequent GET requests to that PayID now return a 404
            request(app.adminApiExpress)
                .get(`/users/${payId}`)
                .set('PayID-API-Version', payIdApiVersion)
                .expect(http_status_1.default.NotFound, missingPayIdError, done);
        })
            .catch((err) => {
            done(err);
        });
    });
    it('Returns a 204 and no payload when deleting an account given an uppercase PayID', function (done) {
        // GIVEN a PayID known to resolve to an account on the PayID service
        const payId = 'BOB$XPRING.MONEY';
        const missingPayIdError = {
            error: 'Not Found',
            message: `No information could be found for the PayID ${payId.toLowerCase()}.`,
            statusCode: 404,
        };
        // WHEN we make a DELETE request to /users/ with the PayID to delete
        request(app.adminApiExpress)
            .delete(`/users/${payId}`)
            .set('PayID-API-Version', payIdApiVersion)
            // THEN we expect to have an Accept-Patch header in the response
            .expect('Accept-Patch', acceptPatch)
            // THEN we expect back a 204-No Content, indicating successful deletion
            .expect(http_status_1.default.NoContent)
            .then((_res) => {
            // AND subsequent GET requests to that PayID now return a 404
            request(app.adminApiExpress)
                .get(`/users/${payId.toLowerCase()}`)
                .set('PayID-API-Version', payIdApiVersion)
                .expect(http_status_1.default.NotFound, missingPayIdError, done);
        })
            .catch((err) => {
            done(err);
        });
    });
    it('Returns a 204  when attempting to delete an account that does not exist', function (done) {
        // GIVEN a PayID known to not exist on the PayID service
        const payId = 'johndoe$xpring.money';
        // WHEN we make a DELETE request to /users/ with the PayID to delete
        request(app.adminApiExpress)
            .delete(`/users/${payId}`)
            .set('PayID-API-Version', payIdApiVersion)
            // THEN we expect to have an Accept-Patch header in the response
            .expect('Accept-Patch', acceptPatch)
            // THEN we expect back a 204 - No Content
            .expect(http_status_1.default.NoContent, done);
    });
    after(function () {
        helpers_1.appCleanup(app);
    });
});
//# sourceMappingURL=deleteUsers.test.js.map