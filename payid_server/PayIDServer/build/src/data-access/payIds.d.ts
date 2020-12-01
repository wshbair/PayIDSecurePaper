import { AddressInformation } from '../types/database';
/**
 * Retrieve all of the address information associated with a given PayID from the database.
 *
 * @param payId - The PayID used to retrieve address information.
 * @returns All of the address information associated with a given PayID.
 */
export declare function getAllAddressInfoFromDatabase(payId: string): Promise<readonly AddressInformation[]>;
/**
 * Retrieve all verified address data associated with a given PayID.
 *
 * @param payId -- The PayID used to retrieve verified address information.
 * @returns All of the verified addresses associated with the given PayID.
 */
export declare function getAllVerifiedAddressInfoFromDatabase(payId: string): Promise<readonly AddressInformation[]>;
/**
 * Retrieves the identity key for a specific PayID.
 *
 * @param payId - The PayID that we are requesting an identityKey for.
 * @returns The identity key for that PayID if it exists.
 */
export declare function getIdentityKeyFromDatabase(payId: string): Promise<string | null>;
/**
 * Retrieves the authorized Public Key.
 *
 * @param payId - The PayID that we are requesting an authorized public key for.
 * @param publicKey - The sender public key
 * @returns the check of access for a given public key
 */
export declare function getAuthorizedPublicKey(): Promise<string>;
//# sourceMappingURL=payIds.d.ts.map