"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const users_1 = require("../../../src/data-access/users");
const errors_1 = require("../../../src/utils/errors");
const helpers_1 = require("../../helpers/helpers");
chai.use(chaiAsPromised);
const { assert } = chai;
describe('Data Access - Database Errors', function () {
    before(async function () {
        await helpers_1.seedDatabase();
    });
    const exampleAddresses = [
        {
            paymentNetwork: 'ABC',
            environment: 'XYZ',
            details: {
                address: 'abc.xyz',
                tag: '123',
            },
        },
    ];
    // Account table errors (PayID)
    it('Raises an error when attempting to insert a user with an null PayID', async function () {
        // GIVEN a PayID and associated addresses to insert
        const payId = null;
        // WHEN we insert the user into the database
        // @ts-expect-error -- In production we verify that the PayID is not null, but we want to test the DatabaseError
        const insertedAddresses = users_1.insertUser(payId, exampleAddresses);
        // THEN we get a DatabaseError with our expected error message
        return assert.isRejected(insertedAddresses, errors_1.DatabaseError, errors_1.DatabaseErrorMessage.NotNull);
    });
    it('Raises an error when attempting to insert a user with an empty PayID', async function () {
        // GIVEN a PayID and associated addresses to insert
        const payId = '';
        // WHEN we insert the user into the database
        const insertedAddresses = users_1.insertUser(payId, exampleAddresses);
        // THEN we get a DatabaseError with our expected error message
        return assert.isRejected(insertedAddresses, errors_1.DatabaseError, errors_1.DatabaseErrorMessage.EmptyStringPayId);
    });
    it('Raises an error when attempting to insert a user with an uppercase PayID', async function () {
        // GIVEN a PayID and associated addresses to insert
        const payId = 'ALICE$example.com';
        // WHEN we insert the user into the database
        const insertedAddresses = users_1.insertUser(payId, exampleAddresses);
        // THEN we get a DatabaseError with our expected error message
        return assert.isRejected(insertedAddresses, errors_1.DatabaseError, errors_1.DatabaseErrorMessage.StringCasePayId);
    });
    it('Raises an error when attempting to insert a user with a PayID already in use', async function () {
        // GIVEN a PayID and associated addresses to insert
        const payId = 'alice$xpring.money';
        // WHEN we insert the user into the database
        const insertedAddresses = users_1.insertUser(payId, exampleAddresses);
        // THEN we get a DatabaseError with our expected error message
        return assert.isRejected(insertedAddresses, errors_1.DatabaseError, errors_1.DatabaseErrorMessage.UniqueConstraintPayId);
    });
    // Address table errors
    it('Raises an error when attempting to insert an address with a NULL details payload', async function () {
        // GIVEN a PayID and associated addresses to insert
        const payId = 'alice$example.com';
        const addresses = [
            {
                paymentNetwork: 'XRPL',
                environment: 'TESTNET',
            },
        ];
        // WHEN we insert the user into the database
        // @ts-expect-error -- We are testing the DatabaseError, so need to ignore the typing information
        const insertedAddresses = users_1.insertUser(payId, addresses);
        // THEN we get a DatabaseError with our expected error message
        return assert.isRejected(insertedAddresses, errors_1.DatabaseError, errors_1.DatabaseErrorMessage.NotNull);
    });
    it('Raises an error when attempting to insert an address with an empty paymentNetwork', async function () {
        // GIVEN a PayID and associated addresses to insert
        const payId = 'alice$example.com';
        const addresses = [
            {
                paymentNetwork: '',
                environment: 'TESTNET',
                details: {
                    address: 'abc',
                },
            },
        ];
        // WHEN we insert the user into the database
        const insertedAddresses = users_1.insertUser(payId, addresses);
        // THEN we get a DatabaseError with our expected error message
        return assert.isRejected(insertedAddresses, errors_1.DatabaseError, errors_1.DatabaseErrorMessage.EmptyStringPaymentNetwork);
    });
    it('Raises an error when attempting to insert an address with an empty environment', async function () {
        // GIVEN a PayID and associated addresses to insert
        const payId = 'alice$example.com';
        const addresses = [
            {
                paymentNetwork: 'XRPL',
                environment: '',
                details: {
                    address: 'abc',
                },
            },
        ];
        // WHEN we insert the user into the database
        const insertedAddresses = users_1.insertUser(payId, addresses);
        // THEN we get a DatabaseError with our expected error message
        return assert.isRejected(insertedAddresses, errors_1.DatabaseError, errors_1.DatabaseErrorMessage.EmptyStringEnvironment);
    });
    it('Raises an error when attempting to insert multiple addresses for the same (paymentNetwork, environment)', async function () {
        // GIVEN a PayID and associated addresses to insert
        const payId = 'alice$example.com';
        const addresses = [
            {
                paymentNetwork: 'XRPL',
                environment: 'TESTNET',
                details: {
                    address: 'abc',
                },
            },
            {
                paymentNetwork: 'XRPL',
                environment: 'TESTNET',
                details: {
                    address: 'xyz',
                },
            },
        ];
        // WHEN we insert the user into the database
        const insertedAddresses = users_1.insertUser(payId, addresses);
        // THEN we get a DatabaseError with our expected error message
        return assert.isRejected(insertedAddresses, errors_1.DatabaseError, errors_1.DatabaseErrorMessage.UniqueConstraintAddress);
    });
});
//# sourceMappingURL=databaseErrors.test.js.map