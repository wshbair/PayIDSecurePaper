"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const knex_1 = require("../../../src/db/knex");
const helpers_1 = require("../../helpers/helpers");
describe('Database Schema - PayID Regex Example Table', function () {
    let payIdRegex;
    before(async function () {
        var _a, _b;
        await helpers_1.seedDatabase();
        const validPayIdConstraint = await helpers_1.getDatabaseConstraintDefinition('valid_pay_id', 'account');
        // Extract regex from constraint definition
        const regexExtractor = /'(?<payIdRegex>.*?)'/u;
        const match = regexExtractor.exec(validPayIdConstraint);
        payIdRegex = (_b = (_a = match === null || match === void 0 ? void 0 : match.groups) === null || _a === void 0 ? void 0 : _a.payIdRegex) !== null && _b !== void 0 ? _b : '';
        if (payIdRegex === '') {
            throw new Error('Expected payIdRegex to be defined.');
        }
    });
    it('Contains the expected number of valid PayIDs', async function () {
        // GIVEN an expected number of PayIDs that pass the PayID regex
        const EXPECTED_VALID_PAYID_COUNT = 23;
        // WHEN we fetch the number of PayIDs that pass the PayID regex
        const validPayIdCount = await knex_1.default
            .count('*')
            .from('payid_examples')
            .where('pay_id', '~*', payIdRegex)
            .then(async (result) => Number(result[0].count));
        // AND the number of PayIDs with 'is_valid = true' the database table
        // (This is just a sanity check on the seeded values)
        const isValidCount = await knex_1.default
            .count('*')
            .from('payid_examples')
            .where('is_valid', true)
            .then(async (result) => Number(result[0].count));
        // THEN we expect to get our expected number of valid PayIDs
        chai_1.assert.strictEqual(validPayIdCount, EXPECTED_VALID_PAYID_COUNT);
        chai_1.assert.strictEqual(isValidCount, EXPECTED_VALID_PAYID_COUNT);
    });
    it('Contains the expected number of invalid PayIDs', async function () {
        // GIVEN an expected number of PayIDs that fail the PayID regex
        const EXPECTED_INVALID_PAYID_COUNT = 28;
        // WHEN we fetch the number of PayIDs that fail the PayID regex
        const invalidPayIdCount = await knex_1.default
            .count('*')
            .from('payid_examples')
            .where('pay_id', '!~*', payIdRegex)
            .then(async (result) => Number(result[0].count));
        // AND the number of PayIDs with 'is_valid = false' in the database table
        const isInvalidCount = await knex_1.default
            .count('*')
            .from('payid_examples')
            .where('is_valid', false)
            .then(async (result) => Number(result[0].count));
        // // THEN we expect to get our expected number of valid PayIDs
        chai_1.assert.strictEqual(invalidPayIdCount, EXPECTED_INVALID_PAYID_COUNT);
        chai_1.assert.strictEqual(isInvalidCount, EXPECTED_INVALID_PAYID_COUNT);
    });
});
//# sourceMappingURL=payidRegex.test.js.map