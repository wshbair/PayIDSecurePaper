"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUser = exports.replaceUser = exports.replaceUserPayId = exports.insertUser = exports.checkUserExistence = void 0;
const knex_1 = require("../db/knex");
const logger_1 = require("../utils/logger");
/**
 * Checks if a given PayID exists in the account table in the PayID database.
 *
 * @param payId - The PayID to insert in the account table.
 *
 * @returns A boolean indicating whether the PayID exists.
 *
 * Note: This could actually be done in getAllAddressInfoFromDatabase,
 * if we changed the return type a bit, which would let us always do a single database call,
 * instead of having to call this as a follow-up check, but it's probably cleaner to
 * let them have separate concerns until performance becomes an issue.
 */
// TODO:(hbergren): Type payId better
async function checkUserExistence(payId) {
    const result = await knex_1.default.select(knex_1.default.raw('exists(select 1 from account where pay_id = ?)', payId));
    return result[0].exists;
}
exports.checkUserExistence = checkUserExistence;
/**
 * Inserts a new user/PayID into the account table in the PayID database.
 *
 * @param payId - The PayID to insert in the account table.
 * @param addresses - The payment addresses for that PayID to insert into the database.
 * @param identityKey - Base64 encoded public key of user for signing addresses.
 *
 * @returns The addresses inserted for this user.
 */
// TODO(hbergren): Type payId better
// TODO:(hbergren) Accept an array of users (insertUsers?)
async function insertUser(payId, addresses, identityKey) {
    return knex_1.default.transaction(async (transaction) => {
        const insertedAddresses = await knex_1.default
            .insert({
            payId,
            identityKey,
        })
            .into('account')
            .transacting(transaction)
            .returning('id')
            .then(async (ids) => {
            const accountId = ids[0];
            const mappedAddresses = addAccountIdToAddresses(addresses, accountId);
            return insertAddresses(mappedAddresses, transaction);
        })
            .then(transaction.commit)
            .catch(transaction.rollback);
        return insertedAddresses;
    });
}
exports.insertUser = insertUser;
/**
 * Replace only the user PayID in the account table in the PayID database.
 *
 * @param oldPayId - The current PayID which needs to be updated.
 * @param newPayId - The new PayID of the user.
 *
 * @returns The updated user Account.
 */
async function replaceUserPayId(oldPayId, newPayId) {
    const account = await knex_1.default('account')
        .where('payId', oldPayId)
        .update({ payId: newPayId })
        .returning('*');
    if (account.length === 1) {
        return account[0];
    }
    return null;
}
exports.replaceUserPayId = replaceUserPayId;
/**
 * Update the PayID and addresses for a given user.
 *
 * @param oldPayId - The old PayID of the user.
 * @param newPayId - The new PayID of the user.
 * @param addresses - The array of payment address information to associate with this user.
 *
 * @returns The updated payment addresses for a given PayID.
 */
async function replaceUser(oldPayId, newPayId, addresses) {
    return knex_1.default.transaction(async (transaction) => {
        const updatedAddresses = await knex_1.default('account')
            .where('payId', oldPayId)
            .update({ payId: newPayId })
            .transacting(transaction)
            .returning('id')
            .then(async (ids) => {
            const accountId = ids[0];
            // This would happen if oldPayId did not exist in the database already
            if (accountId === undefined) {
                return null;
            }
            // Delete existing addresses associated with that user
            await knex_1.default('address')
                .delete()
                .where('accountId', accountId)
                .transacting(transaction);
            const mappedAddresses = addAccountIdToAddresses(addresses, accountId);
            return insertAddresses(mappedAddresses, transaction);
        })
            .then(transaction.commit)
            .catch(transaction.rollback);
        return updatedAddresses;
    });
}
exports.replaceUser = replaceUser;
/**
 * Deletes a user from the database.
 * Addresses associated with that user should be automatically removed by a cascading delete.
 *
 * @param payId - The PayID associated with the user to delete.
 */
async function removeUser(payId) {
    await knex_1.default('account')
        .delete()
        .where('payId', payId)
        .then((count) => {
        /* istanbul ignore if */
        if (count > 1) {
            // If we deleted more than one user, all bets are off, because multiple users could have the same PayID.
            // This should be impossible thanks to our unique constraint,
            // but this would mean that PayID resolution (and thus who gets transferred value) is non-deterministic.
            // Thus, we log an error and immediately kill the program.
            logger_1.default.fatal(`We deleted ${count} accounts with the PayID ${payId}, which should be impossible due to our unique constraint.`);
            process.exit(1);
        }
    });
}
exports.removeUser = removeUser;
/**
 * Maps an array of AddressInformation objects into an array of DatabaseAddress objects,
 * by adding an 'accountId' property to each object.
 *
 * @param addresses - An array of payment addresses we want to insert into the database.
 * @param accountId - The account ID to add to all the addresses to allow inserting the addresses into the database.
 *
 * @returns A new array of DatabaseAddress objects, where each address has a new property 'accountId'.
 */
function addAccountIdToAddresses(addresses, accountId) {
    return addresses.map((address) => {
        var _a;
        return ({
            accountId,
            paymentNetwork: address.paymentNetwork.toUpperCase(),
            environment: (_a = address.environment) === null || _a === void 0 ? void 0 : _a.toUpperCase(),
            details: address.details,
            identityKeySignature: address.identityKeySignature,
        });
    });
}
/**
 * Given an array of address objects and a transaction, insert the addresses into the database.
 *
 * @param addresses - An array of DatabaseAddress objects to insert into the database.
 * @param transaction - The transaction to wrap this statement with.
 *                      Used to ensure that when we insert/update a user, we maintain consistent data.
 *
 * @returns An array of the inserted addresses.
 */
async function insertAddresses(addresses, transaction) {
    if (addresses.length === 0) {
        return [];
    }
    // TODO:(hbergren) Verify that the number of inserted addresses matches the input address array length?
    return knex_1.default
        .insert(addresses)
        .into('address')
        .transacting(transaction)
        .returning(['paymentNetwork', 'environment', 'details']);
}
//# sourceMappingURL=users.js.map