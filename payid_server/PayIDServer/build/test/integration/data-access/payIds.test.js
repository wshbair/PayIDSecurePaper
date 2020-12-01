"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const payIds_1 = require("../../../src/data-access/payIds");
const helpers_1 = require("../../helpers/helpers");
describe('Data Access - getAllAddressInfoFromDatabase()', function () {
    before(async function () {
        await helpers_1.seedDatabase();
    });
    it('Gets address information for a known PayID (1 address)', async function () {
        // GIVEN a PayID known to exist in the database
        // WHEN we attempt to retrieve address information for that tuple
        const addressInfo = await payIds_1.getAllAddressInfoFromDatabase('alice$xpring.money');
        // THEN we get our seeded value back
        const expectedaddressInfo = [
            {
                paymentNetwork: 'XRPL',
                environment: 'TESTNET',
                details: {
                    address: 'rDk7FQvkQxQQNGTtfM2Fr66s7Nm3k87vdS',
                },
            },
        ];
        chai_1.assert.deepEqual(addressInfo, expectedaddressInfo);
    });
    it('Gets address information for a known PayID (multiple addresses)', async function () {
        // GIVEN a PayID known to exist in the database
        // WHEN we attempt to retrieve address information for that tuple
        const addressInfo = await payIds_1.getAllAddressInfoFromDatabase('alice$127.0.0.1');
        // THEN we get our seeded values back
        const expectedaddressInfo = [
            {
                paymentNetwork: 'XRPL',
                environment: 'MAINNET',
                details: {
                    address: 'rw2ciyaNshpHe7bCHo4bRWq6pqqynnWKQg',
                    tag: '67298042',
                },
            },
            {
                paymentNetwork: 'XRPL',
                environment: 'TESTNET',
                details: {
                    address: 'rDk7FQvkQxQQNGTtfM2Fr66s7Nm3k87vdS',
                },
            },
            {
                paymentNetwork: 'BTC',
                environment: 'TESTNET',
                details: {
                    address: 'mxNEbRXokcdJtT6sbukr1CTGVx8Tkxk3DB',
                },
            },
            {
                paymentNetwork: 'ACH',
                environment: null,
                details: {
                    accountNumber: '000123456789',
                    routingNumber: '123456789',
                },
            },
        ];
        chai_1.assert.deepEqual(addressInfo, expectedaddressInfo);
    });
    it('Returns empty array for an unknown PayID', async function () {
        // GIVEN a PayID known to not exist in the database
        // WHEN we attempt to retrieve address information for that tuple
        const addressInfo = await payIds_1.getAllAddressInfoFromDatabase('johndoe$xpring.io');
        // THEN we get back an empty array
        chai_1.assert.deepStrictEqual(addressInfo, []);
    });
});
//# sourceMappingURL=payIds.test.js.map