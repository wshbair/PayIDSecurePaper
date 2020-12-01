import { Acl, GrayList } from '../types/database';
/**
 * Inserts a new user/PayID into the ACL table in the PayID database.
 *
 * @param payId - The PayID to insert in the account table.
 * @param authorizedPublicKey - Base64 encoded public key .
 *
 * @returns The addresses inserted for this user.
 */
export declare function insertUserACL(payId: string, authorized_pay_id?: string, authorized_pay_id_hash?: string): Promise<readonly Acl[]>;
/**
 * Retrieve ACL associated with a given PayID from the database.
 *
 * @param payId - The PayID used to retrieve address information.
 * @returns All of the address information associated with a given PayID.
 */
export declare function getAuthorizedPayId(payId: string, authorizedPayIdHash: string): Promise<readonly Acl[]>;
/**
 * Inserts blocked_pay_id to key gray list .
 *
 * @param payId - The PayID to insert in the account table.
 * @param blocked_pay_id - blocked PayID.
 *
 * @returns The addresses inserted for this user.
 */
export declare function addToGrayList(pay_id: string, blocked_pay_id: string): Promise<readonly GrayList[]>;
/**
 * Retrieve Gray list
 *
 * @param payId - The PayID used to retrieve address information.
 * @returns All of the address information associated with a given PayID.
 */
export declare function getGrayList(payId: string): Promise<readonly GrayList[]>;
//# sourceMappingURL=acl.d.ts.map