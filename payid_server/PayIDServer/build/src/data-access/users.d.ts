import { Account, AddressInformation } from '../types/database';
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
export declare function checkUserExistence(payId: string): Promise<boolean>;
/**
 * Inserts a new user/PayID into the account table in the PayID database.
 *
 * @param payId - The PayID to insert in the account table.
 * @param addresses - The payment addresses for that PayID to insert into the database.
 * @param identityKey - Base64 encoded public key of user for signing addresses.
 *
 * @returns The addresses inserted for this user.
 */
export declare function insertUser(payId: string, addresses: readonly AddressInformation[], identityKey?: string): Promise<readonly AddressInformation[]>;
/**
 * Replace only the user PayID in the account table in the PayID database.
 *
 * @param oldPayId - The current PayID which needs to be updated.
 * @param newPayId - The new PayID of the user.
 *
 * @returns The updated user Account.
 */
export declare function replaceUserPayId(oldPayId: string, newPayId: string): Promise<Account | null>;
/**
 * Update the PayID and addresses for a given user.
 *
 * @param oldPayId - The old PayID of the user.
 * @param newPayId - The new PayID of the user.
 * @param addresses - The array of payment address information to associate with this user.
 *
 * @returns The updated payment addresses for a given PayID.
 */
export declare function replaceUser(oldPayId: string, newPayId: string, addresses: readonly AddressInformation[]): Promise<readonly AddressInformation[] | null>;
/**
 * Deletes a user from the database.
 * Addresses associated with that user should be automatically removed by a cascading delete.
 *
 * @param payId - The PayID associated with the user to delete.
 */
export declare function removeUser(payId: string): Promise<void>;
//# sourceMappingURL=users.d.ts.map