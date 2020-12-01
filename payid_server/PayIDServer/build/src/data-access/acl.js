"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGrayList = exports.addToGrayList = exports.getAuthorizedPayId = exports.insertUserACL = void 0;
const knex_1 = require("../db/knex");
/**
 * Inserts a new user/PayID into the ACL table in the PayID database.
 *
 * @param payId - The PayID to insert in the account table.
 * @param authorizedPublicKey - Base64 encoded public key .
 *
 * @returns The addresses inserted for this user.
 */
async function insertUserACL(payId, authorized_pay_id, authorized_pay_id_hash) {
    return knex_1.default.transaction(async (transaction) => {
        const insertedAddresses = await knex_1.default
            .insert({
            payId,
            authorized_pay_id,
            authorized_pay_id_hash
        })
            .into('acl')
            .transacting(transaction)
            .returning('id')
            .then(async (ids) => {
            console.log(ids);
        })
            .then(transaction.commit)
            .catch(transaction.rollback);
        return insertedAddresses;
    });
}
exports.insertUserACL = insertUserACL;
/**
 * Retrieve ACL associated with a given PayID from the database.
 *
 * @param payId - The PayID used to retrieve address information.
 * @returns All of the address information associated with a given PayID.
 */
async function getAuthorizedPayId(payId, authorizedPayIdHash) {
    const aclData = await knex_1.default
        .select('*')
        .from('acl')
        .where('acl.payId', payId).andWhere('acl.authorized_pay_id_hash', authorizedPayIdHash);
    return aclData;
}
exports.getAuthorizedPayId = getAuthorizedPayId;
/**
 * Inserts blocked_pay_id to key gray list .
 *
 * @param payId - The PayID to insert in the account table.
 * @param blocked_pay_id - blocked PayID.
 *
 * @returns The addresses inserted for this user.
 */
async function addToGrayList(pay_id, blocked_pay_id) {
    return knex_1.default.transaction(async (transaction) => {
        const insertedToken = await knex_1.default
            .insert({
            pay_id,
            blocked_pay_id,
        })
            .into('graylist')
            .transacting(transaction)
            .returning('id')
            .then(async (ids) => {
            console.log(ids);
        })
            .then(transaction.commit)
            .catch(transaction.rollback);
        return insertedToken;
    });
}
exports.addToGrayList = addToGrayList;
/**
 * Retrieve Gray list
 *
 * @param payId - The PayID used to retrieve address information.
 * @returns All of the address information associated with a given PayID.
 */
async function getGrayList(payId) {
    const listData = await knex_1.default
        .select('*')
        .from('graylist')
        .where('graylist.pay_id', payId);
    return listData;
}
exports.getGrayList = getGrayList;
//# sourceMappingURL=acl.js.map