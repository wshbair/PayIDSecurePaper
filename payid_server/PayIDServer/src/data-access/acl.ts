/* eslint-disable @typescript-eslint/unbound-method --
 * Knex transaction commits and rollbacks are "unbound methods"
 */
import { Transaction } from 'knex'

import knex from '../db/knex'
import { Acl, GrayList } from '../types/database'

/**
 * Inserts a new user/PayID into the ACL table in the PayID database.
 *
 * @param payId - The PayID to insert in the account table.
 * @param authorizedPublicKey - Base64 encoded public key .
 *
 * @returns The addresses inserted for this user.
 */

export async function insertUserACL(
  payId: string,
  authorized_pay_id?: string,
  authorized_pay_id_hash? :string
): Promise<readonly Acl[]> {
  return knex.transaction(async (transaction: Transaction) => {
    const insertedAddresses = await knex
      .insert({
        payId,
        authorized_pay_id,
        authorized_pay_id_hash
      })
      .into<Acl>('acl')
      .transacting(transaction)
      .returning('id')
      .then(async (ids) => {
          console.log(ids)
      })
      .then(transaction.commit)
      .catch(transaction.rollback)

    return insertedAddresses
  })
}

/**
 * Retrieve ACL associated with a given PayID from the database.
 *
 * @param payId - The PayID used to retrieve address information.
 * @returns All of the address information associated with a given PayID.
 */
export async function getAuthorizedPayId(
    payId: string,
    authorizedPayIdHash: string,
  ): Promise<readonly Acl[]> {
    const aclData = await knex
      .select('*')
      .from<Acl>('acl')
      .where('acl.payId', payId).andWhere('acl.authorized_pay_id_hash', authorizedPayIdHash)
    return aclData
  }

/**
 * Inserts blocked_pay_id to key gray list .
 *
 * @param payId - The PayID to insert in the account table.
 * @param blocked_pay_id - blocked PayID.
 *
 * @returns The addresses inserted for this user.
 */

export async function addToGrayList(
  pay_id: string,
  blocked_pay_id: string,
): Promise<readonly GrayList[]> {
  return knex.transaction(async (transaction: Transaction) => {
    const insertedToken = await knex
      .insert({
        pay_id,
        blocked_pay_id,
      })
      .into<GrayList>('graylist')
      .transacting(transaction)
      .returning('id')
      .then(async (ids) => {
        console.log(ids)
      })
      .then(transaction.commit)
      .catch(transaction.rollback)

    return insertedToken
  })
}

/**
 * Retrieve Gray list
 *
 * @param payId - The PayID used to retrieve address information.
 * @returns All of the address information associated with a given PayID.
 */
export async function getGrayList(
  payId: string,
): Promise<readonly GrayList[]> {
  const listData = await knex
    .select('*')
    .from<GrayList>('graylist')
    .where('graylist.pay_id', payId)
  return listData
}