import { CryptoAddressDetails, FiatAddressDetails } from './protocol';
/**
 * Model of the Account table schema for the database.
 */
export interface Account {
    readonly id: string;
    readonly payId: string;
    readonly identityKey?: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
/**
 * Model of the Address table schema for the database.
 */
export interface Address {
    readonly id: number;
    readonly accountId: string;
    readonly paymentNetwork: string;
    readonly environment?: string | null;
    readonly details: CryptoAddressDetails | FiatAddressDetails;
    readonly identityKeySignature?: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
/**
 * Model of the access control.
 */
export interface Acl {
    readonly id: number;
    readonly payId: string;
    readonly authorized_pay_id: string;
    readonly authorized_pay_id_hash: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
/**
 * Model of the gray list keys.
 */
export interface GrayList {
    readonly id: number;
    readonly pay_id: string;
    readonly blocked_pay_id: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
/**
 * The information retrieved from or inserted into the database for a given address.
 */
export declare type AddressInformation = Pick<Address, 'paymentNetwork' | 'environment' | 'details' | 'identityKeySignature'>;
//# sourceMappingURL=database.d.ts.map