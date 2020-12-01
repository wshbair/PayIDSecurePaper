"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const reports_1 = require("../../../src/data-access/reports");
const helpers_1 = require("../../helpers/helpers");
describe('Data Access - getPayIdCounts()', function () {
    before(async function () {
        await helpers_1.seedDatabase();
    });
    it('getAddressCounts - Returns a result per by unique network and environment', async function () {
        const results = await reports_1.getAddressCounts();
        const expected = [
            {
                paymentNetwork: 'ACH',
                environment: null,
                count: 2,
            },
            {
                paymentNetwork: 'BTC',
                environment: 'MAINNET',
                count: 1,
            },
            {
                paymentNetwork: 'BTC',
                environment: 'TESTNET',
                count: 3,
            },
            {
                paymentNetwork: 'INTERLEDGER',
                environment: 'TESTNET',
                count: 1,
            },
            {
                paymentNetwork: 'XRPL',
                environment: 'MAINNET',
                count: 2,
            },
            {
                paymentNetwork: 'XRPL',
                environment: 'TESTNET',
                count: 6,
            },
        ];
        chai_1.assert.deepEqual(results, expected);
    });
    it('getPayIdCount - Returns a count of PayIDs', async function () {
        const payIdCount = await reports_1.getPayIdCount();
        const expectedPayIdCount = 11;
        chai_1.assert.strictEqual(payIdCount, expectedPayIdCount);
    });
});
//# sourceMappingURL=reports.test.js.map