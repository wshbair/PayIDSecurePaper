"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = require("@xpring-eng/http-status");
const chai_1 = require("chai");
const request = require("supertest");
require("mocha");
const metrics_1 = require("../../../../src/services/metrics");
const helpers_1 = require("../../../helpers/helpers");
let app;
const payIdApiVersion = '2020-05-28';
describe('E2E - adminApiRouter - GET /metrics', function () {
    const mainnet = 'MAINNET';
    const testnet = 'TESTNET';
    const asPayId = (account) => `${account}$127.0.0.1`;
    const asAccept = (network, environment) => `application/${network}-${environment}+json`;
    before(async function () {
        app = await helpers_1.appSetup();
    });
    after(function () {
        helpers_1.appCleanup(app);
    });
    it('Counts found metric if PayID found', async function () {
        const account = 'hugh-honey';
        const payId = asPayId(account);
        const network = 'ACH';
        await createPayId(payId, network, mainnet);
        await lookupPayId(account, asAccept(network, mainnet), http_status_1.default.OK);
        await assertMetrics(/payid_lookup_request\{paymentNetwork="ACH",environment="MAINNET",org="127.0.0.1",result="found"\} 1/u);
    });
    it('Counts 1 not_found metric if PayID not found', async function () {
        const account = 'vic-vinegar';
        const payId = asPayId(account);
        const network = 'ETH';
        await createPayId(payId, network, testnet);
        await lookupPayId('bogus', asAccept(network, testnet), http_status_1.default.NotFound);
        await assertMetrics(/payid_lookup_request\{paymentNetwork="ETH",environment="TESTNET",org="127.0.0.1",result="not_found"\} 1/u);
    });
    it('Counts 1 error metric if PayID lookup errors', async function () {
        const account = 'pepe-silva';
        const payId = asPayId(account);
        await createPayId(payId, ' ', mainnet);
        await lookupPayId(account, ' ', http_status_1.default.BadRequest);
        await assertMetrics(/payid_lookup_request\{paymentNetwork="unknown",environment="unknown",org="127.0.0.1",result="error: bad_accept_header"\} 1/u);
    });
    it('Counts multiple lookups and metrics', async function () {
        const xrpAccount = 'rickety-cricket';
        const xrpPayId = asPayId(xrpAccount);
        const xrpNetwork = 'XRPL';
        await createPayId(xrpPayId, xrpNetwork, mainnet);
        const btcAccount = 'chardee-mcdennis';
        const btcPayId = asPayId(btcAccount);
        const btcNetwork = 'BTC';
        await createPayId(btcPayId, btcNetwork, 'TESTNET');
        await lookupPayId(xrpAccount, asAccept(xrpNetwork, mainnet), http_status_1.default.OK);
        await lookupPayId(xrpAccount, asAccept(xrpNetwork, mainnet), http_status_1.default.OK);
        await lookupPayId(btcAccount, asAccept(btcNetwork, testnet), http_status_1.default.OK);
        await assertMetrics(/payid_lookup_request\{paymentNetwork="XRPL",environment="MAINNET",org="127.0.0.1",result="found"\} 2/u);
        await assertMetrics(/payid_lookup_request\{paymentNetwork="BTC",environment="TESTNET",org="127.0.0.1",result="found"\} 1/u);
    });
    it('Includes count of all addresses', async function () {
        const achNetwork = 'ACH';
        const litecoinNetwork = 'LTC';
        await createPayId('charlie$fightmilk.com', achNetwork, 'US');
        await createPayId('mac$fightmilk.com', achNetwork, 'US');
        await createPayId('frank$wolfcola.com', litecoinNetwork, 'MAINNET');
        await metrics_1.default.generateAddressCountMetrics();
        await assertMetrics(/payid_count\{paymentNetwork="ACH",environment="US",org="127.0.0.1"\} 2/u);
        await assertMetrics(/payid_count\{paymentNetwork="LTC",environment="MAINNET",org="127.0.0.1"\} 1/u);
    });
    it('Includes count of all PayIDs', async function () {
        await metrics_1.default.generatePayIdCountMetrics();
        // We create 8 PayIDs in the tests before this one,
        // and start with 11 seeded PayIDs, for a total of 19.
        await assertMetrics(/actual_payid_count\{org="127.0.0.1"\} 19/u);
    });
    it('Includes server version info', async function () {
        await metrics_1.default.generatePayIdCountMetrics();
        await assertMetrics(/org="127.0.0.1",serverAgent="@payid-org\/payid:1.*.*",protocolVersion="1.*"\}/u);
    });
    /**
     * A helper function that fetches PayID metrics and matches them against
     * expected metrics.
     *
     * @param expectedMetric - The expected metric to match on.
     * @returns The HTTP response from a GET to the /metrics endpoint on the Admin API.
     */
    async function assertMetrics(expectedMetric) {
        return request(app.adminApiExpress)
            .get('/metrics')
            .set('PayID-API-Version', payIdApiVersion)
            .expect((res) => {
            chai_1.assert.match(res.text, expectedMetric);
        })
            .then(async (res) => res.body);
    }
    /**
     * A helper function to return address information for a PayID.
     *
     * @param account - The PayID to retrieve.
     * @param acceptHeader - The Accept header to send.
     * @param status - The status code returned by the request.
     *
     * @returns The HTTP response from a GET to the / endpoint on the Public API.
     */
    async function lookupPayId(account, acceptHeader, status) {
        return request(app.publicApiExpress)
            .get(`/${account}`)
            .set('PayID-Version', '1.0')
            .set('Accept', acceptHeader)
            .expect((res) => {
            chai_1.assert.strictEqual(res.status, status);
        })
            .then(async (res) => res.body);
    }
    /**
     * A helper function to create a PayID.
     *
     * @param payId - The PayID to create.
     * @param paymentNetwork - The payment network for the address entry (e.g. XRPL).
     * @param environment - The environment for the address entry (e.g. TESTNET).
     *
     * @returns The HTTP response from a POST to the /users endpoint on the Admin API.
     */
    async function createPayId(payId, paymentNetwork, environment) {
        const payIdRequest = {
            payId,
            addresses: [
                {
                    paymentNetwork,
                    environment,
                    details: {
                        address: 'test',
                    },
                },
            ],
        };
        return request(app.adminApiExpress)
            .post(`/users`)
            .set('PayID-API-Version', payIdApiVersion)
            .send(payIdRequest)
            .expect((res) => {
            chai_1.assert.strictEqual(res.status, http_status_1.default.Created);
        })
            .then(async (res) => res.body);
    }
});
//# sourceMappingURL=metrics.test.js.map