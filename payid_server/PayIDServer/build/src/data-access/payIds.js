"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthorizedPublicKey = exports.getIdentityKeyFromDatabase = exports.getAllVerifiedAddressInfoFromDatabase = exports.getAllAddressInfoFromDatabase = void 0;
const knex_1 = require("../db/knex");
/**
 * Retrieve all of the address information associated with a given PayID from the database.
 *
 * @param payId - The PayID used to retrieve address information.
 * @returns All of the address information associated with a given PayID.
 */
async function getAllAddressInfoFromDatabase(payId) {
    const addressInformation = await knex_1.default
        .select('address.paymentNetwork', 'address.environment', 'address.details')
        .from('address')
        .innerJoin('account', 'address.accountId', 'account.id')
        .where('account.payId', payId)
        .whereNull('address.identityKeySignature');
    return addressInformation;
}
exports.getAllAddressInfoFromDatabase = getAllAddressInfoFromDatabase;
/**
 * Retrieve all verified address data associated with a given PayID.
 *
 * @param payId -- The PayID used to retrieve verified address information.
 * @returns All of the verified addresses associated with the given PayID.
 */
async function getAllVerifiedAddressInfoFromDatabase(payId) {
    const addressInformation = await knex_1.default
        .select('address.paymentNetwork', 'address.environment', 'address.details', 'address.identityKeySignature')
        .from('address')
        .innerJoin('account', 'address.accountId', 'account.id')
        .where('account.payId', payId)
        .whereNotNull('address.identityKeySignature');
    return addressInformation;
}
exports.getAllVerifiedAddressInfoFromDatabase = getAllVerifiedAddressInfoFromDatabase;
/**
 * Retrieves the identity key for a specific PayID.
 *
 * @param payId - The PayID that we are requesting an identityKey for.
 * @returns The identity key for that PayID if it exists.
 */
async function getIdentityKeyFromDatabase(payId) {
    const identityKey = await knex_1.default
        .select('account.identityKey')
        .from('account')
        .where('account.payId', payId);
    return identityKey[0].identityKey;
}
exports.getIdentityKeyFromDatabase = getIdentityKeyFromDatabase;
/**
 * Retrieves the authorized Public Key.
 *
 * @param payId - The PayID that we are requesting an authorized public key for.
 * @param publicKey - The sender public key
 * @returns the check of access for a given public key
 */
async function getAuthorizedPublicKey() {
    return "Testing api call";
}
exports.getAuthorizedPublicKey = getAuthorizedPublicKey;
//# sourceMappingURL=payIds.js.map