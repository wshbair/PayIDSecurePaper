"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const http_status_1 = require("@xpring-eng/http-status");
const chai_1 = require("chai");
const request = require("supertest");
const helpers_1 = require("../../../helpers/helpers");
const payloads_1 = require("./payloads");
let app;
const USER = '/alice';
const PAYID = `${USER.slice(1)}$127.0.0.1`;
const XRPL_EXPECTED_TESTNET_RESPONSE = {
    addresses: [payloads_1.XRPL_TESTNET_ADDRESS],
    verifiedAddresses: [],
    payId: PAYID,
};
const XRPL_EXPECTED_MAINNET_RESPONSE = {
    addresses: [payloads_1.XRPL_MAINNET_ADDRESS],
    verifiedAddresses: [],
    payId: PAYID,
};
describe('E2E - publicAPIRouter - Content Negotiation', function () {
    // Boot up Express application and initialize DB connection pool
    before(async function () {
        app = await helpers_1.appSetup();
    });
    it('Returns the first address for multiple types with no q', function (done) {
        // GIVEN a payment pointer known to have an associated xrpl-testnet and xrpl-mainnet address
        const acceptHeader = `${payloads_1.XRPL_TESTNET_ACCEPT_HEADER}, ${payloads_1.XRPL_MAINNET_ACCEPT_HEADER}`;
        // WHEN we make a GET request to the public endpoint to retrieve payment info with an Accept header specifying
        // both testnet and mainnet, with no q for either
        request(app.publicApiExpress)
            .get(USER)
            .set('PayID-Version', '1.1')
            .set('Accept', acceptHeader)
            // THEN we get back an xrpl testnet header as our Content-Type
            .expect((res) => {
            chai_1.assert.strictEqual(res.get('Content-Type').split('; ')[0], payloads_1.XRPL_TESTNET_ACCEPT_HEADER);
        })
            // AND we get back the xrpl-testnet account information associated with that payment pointer for xrpl-testnet
            .expect(http_status_1.default.OK, XRPL_EXPECTED_TESTNET_RESPONSE, done);
    });
    it('Returns the preferred available address where the higher q is at the beginning', function (done) {
        // GIVEN a payment pointer known to have an associated xrpl-testnet address and xrpl-mainnet address
        const acceptHeader = `${payloads_1.XRPL_TESTNET_ACCEPT_HEADER}; q=1.1, ${payloads_1.XRPL_MAINNET_ACCEPT_HEADER}; q=0.5`;
        // WHEN we make a GET request to the public endpoint to retrieve payment info with an Accept header specifying testnet
        // and mainnet, with testnet having a higher q-value
        request(app.publicApiExpress)
            .get(USER)
            .set('PayID-Version', '1.1')
            .set('Accept', acceptHeader)
            // THEN we get back an xrpl testnet header as the Content-Type
            .expect((res) => {
            chai_1.assert.strictEqual(res.get('Content-Type').split('; ')[0], payloads_1.XRPL_TESTNET_ACCEPT_HEADER);
        })
            // AND we get back the xrpl testnet account information associated with that payment pointer for xrpl testnet
            .expect(http_status_1.default.OK, XRPL_EXPECTED_TESTNET_RESPONSE, done);
    });
    it('Returns the preferred available address where the higher q is at the end', function (done) {
        // GIVEN a payment pointer known to have an associated xrpl-testnet address and an xrpl-mainnet address
        const acceptHeader = `${payloads_1.XRPL_TESTNET_ACCEPT_HEADER}; q=0.5, ${payloads_1.XRPL_MAINNET_ACCEPT_HEADER}; q=1.1`;
        // WHEN we make a GET request to the public endpoint to retrieve payment info with an Accept header specifying
        // xrpl-testnet and xrpl-mainnet, with a higher q for xrpl-mainnet
        request(app.publicApiExpress)
            .get(USER)
            .set('PayID-Version', '1.1')
            .set('Accept', acceptHeader)
            // THEN we get back a xrpl-mainnet accept header as the Content-Type
            .expect((res) => {
            chai_1.assert.strictEqual(res.get('Content-Type').split('; ')[0], payloads_1.XRPL_MAINNET_ACCEPT_HEADER);
        })
            // AND we get back the xrpl-mainnet account information associated with that payment pointer for xrpl-mainnet.
            .expect(http_status_1.default.OK, XRPL_EXPECTED_MAINNET_RESPONSE, done);
    });
    it('Returns a valid address when the most preferred type does not exist', function (done) {
        // GIVEN a payment pointer known to have an associated xrpl-testnet address and mainnet address
        const nonExistentAcceptType = 'application/fakenetwork-fakenet+json';
        const acceptHeader = `${nonExistentAcceptType}; q=1.1, ${payloads_1.XRPL_TESTNET_ACCEPT_HEADER}; q=0.5, ${payloads_1.XRPL_MAINNET_ACCEPT_HEADER}; q=0.9`;
        // WHEN we make a GET request to the public endpoint to retrieve payment info with an Accept header specifying
        // a non-existent network+environment most preferred, followed by xrpl-mainnet and xrpl-testnet
        request(app.publicApiExpress)
            .get(USER)
            .set('PayID-Version', '1.1')
            .set('Accept', acceptHeader)
            // THEN we get back a xrpl-mainnet accept header as the Content-Type
            .expect((res) => {
            chai_1.assert.strictEqual(res.get('Content-Type').split('; ')[0], payloads_1.XRPL_MAINNET_ACCEPT_HEADER);
        })
            // AND we get back the xrpl-mainnet account information associated with that payment pointer for xrpl mainnet.
            .expect(http_status_1.default.OK, XRPL_EXPECTED_MAINNET_RESPONSE, done);
    });
    // Shut down Express application and close DB connections
    after(function () {
        helpers_1.appCleanup(app);
    });
});
//# sourceMappingURL=basePayIdContentNegotiation.test.js.map