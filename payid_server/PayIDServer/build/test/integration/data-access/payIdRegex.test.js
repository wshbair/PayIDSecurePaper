"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const payIds_1 = require("../../../src/data-access/payIds");
const users_1 = require("../../../src/data-access/users");
chai.use(chaiAsPromised);
const { assert } = chai;
describe('Data Access - PayID Regex - insertUser()', function () {
    const addresses = [
        {
            paymentNetwork: 'XRPL',
            environment: 'MAINNET',
            details: {
                address: 'XV5sbjUmgPpvXv4ixFWZ5ptAYZ6PD28Sq49uo34VyjnmK5H',
            },
        },
    ];
    // specific regex we are testing:
    // constraint = valid_pay_id
    // location = src/db/migrations/02_change_pay_id_format_constraint.sql
    it('Accepts PayID with a lowercase letter for user', async function () {
        // GIVEN an acceptable PayID with a lowercase letter for the user
        const payId = 'a$wallet.com';
        // WHEN we attempt to insert that PayID into our DB
        await users_1.insertUser(payId, addresses);
        // THEN we expect the user to have been successfully inserted
        const resp = await payIds_1.getAllAddressInfoFromDatabase(payId);
        assert.deepEqual(resp, addresses);
    });
    it('Rejects PayID with a uppercase letter for user', async function () {
        // GIVEN an unacceptable PayID with an uppercase letter for the user
        const payId = 'A$wallet.com';
        // WHEN we attempt to insert that PayID into our DB
        const insertion = users_1.insertUser(payId, addresses);
        // THEN we expect insert to throw an error
        // NOTE: We need to return the assertion here because we are using chai-as-promised
        return assert.isRejected(insertion);
    });
    it('Accepts PayID with a number for user', async function () {
        // GIVEN an acceptable PayID with a number for the user
        const payId = '1$wallet.com';
        // WHEN we attempt to insert that PayID into our DB
        await users_1.insertUser(payId, addresses);
        // THEN we expect the user to have been successfully inserted
        const resp = await payIds_1.getAllAddressInfoFromDatabase(payId);
        assert.deepEqual(resp, addresses);
    });
    it('Accepts PayID with a user containing a period', async function () {
        // GIVEN an acceptable PayID with a user containing a period
        const payId = 'first.last$wallet.com';
        // WHEN we attempt to insert that PayID into our DB
        await users_1.insertUser(payId, addresses);
        // THEN we expect the user to have been successfully inserted
        const resp = await payIds_1.getAllAddressInfoFromDatabase(payId);
        assert.deepEqual(resp, addresses);
    });
    it('Accepts PayID with an _ for user', async function () {
        // GIVEN an acceptable PayID with an _ for the user
        const payId = '_$wallet.com';
        // WHEN we attempt to insert that PayID into our DB
        await users_1.insertUser(payId, addresses);
        // THEN we expect the user to have been successfully inserted
        const resp = await payIds_1.getAllAddressInfoFromDatabase(payId);
        assert.deepEqual(resp, addresses);
    });
    it('Accepts PayID with a hyphen for user', async function () {
        // GIVEN an acceptable PayID with a hypen for the user
        const payId = '-$wallet.com';
        // WHEN we attempt to insert that PayID into our DB
        await users_1.insertUser(payId, addresses);
        // THEN we expect the user to have been successfully inserted
        const resp = await payIds_1.getAllAddressInfoFromDatabase(payId);
        assert.deepEqual(resp, addresses);
    });
    it('Accepts PayID with normal host', async function () {
        // GIVEN an acceptable PayID with a normal host
        const payId = 'user$wallet.com';
        // WHEN we attempt to insert that PayID into our DB
        await users_1.insertUser(payId, addresses);
        // THEN we expect the user to have been successfully inserted
        const resp = await payIds_1.getAllAddressInfoFromDatabase(payId);
        assert.deepEqual(resp, addresses);
    });
    it('Accepts PayID with a subdomain', async function () {
        // GIVEN an acceptable PayID a subdomain
        const payId = 'user$subdomain.wallet.com';
        // WHEN we attempt to insert that PayID into our DB
        await users_1.insertUser(payId, addresses);
        // THEN we expect the user to have been successfully inserted
        const resp = await payIds_1.getAllAddressInfoFromDatabase(payId);
        assert.deepEqual(resp, addresses);
    });
});
//# sourceMappingURL=payIdRegex.test.js.map