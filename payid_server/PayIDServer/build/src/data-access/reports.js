"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPayIdCount = exports.getAddressCounts = void 0;
const knex_1 = require("../db/knex");
/**
 * Retrieve count of addresses, grouped by payment network and environment.
 *
 * @returns A list with the number of addresses that have a given (paymentNetwork, environment) tuple,
 *          ordered by (paymentNetwork, environment).
 */
async function getAddressCounts() {
    const addressCounts = await knex_1.default
        .select('address.paymentNetwork', 'address.environment')
        .count('* as count')
        .from('address')
        .groupBy('address.paymentNetwork', 'address.environment')
        .orderBy(['address.paymentNetwork', 'address.environment']);
    return addressCounts.map((addressCount) => ({
        paymentNetwork: addressCount.paymentNetwork,
        environment: addressCount.environment,
        count: Number(addressCount.count),
    }));
}
exports.getAddressCounts = getAddressCounts;
/**
 * Retrieve the count of PayIDs in the database.
 *
 * @returns The count of PayIDs that exist for this PayID server.
 */
async function getPayIdCount() {
    const payIdCount = await knex_1.default
        .count('* as count')
        .from('account')
        .then((record) => {
        return Number(record[0].count);
    });
    return payIdCount;
}
exports.getPayIdCount = getPayIdCount;
//# sourceMappingURL=reports.js.map