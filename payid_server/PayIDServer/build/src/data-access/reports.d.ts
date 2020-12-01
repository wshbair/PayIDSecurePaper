import { AddressCount } from '@payid-org/server-metrics';
/**
 * Retrieve count of addresses, grouped by payment network and environment.
 *
 * @returns A list with the number of addresses that have a given (paymentNetwork, environment) tuple,
 *          ordered by (paymentNetwork, environment).
 */
export declare function getAddressCounts(): Promise<AddressCount[]>;
/**
 * Retrieve the count of PayIDs in the database.
 *
 * @returns The count of PayIDs that exist for this PayID server.
 */
export declare function getPayIdCount(): Promise<number>;
//# sourceMappingURL=reports.d.ts.map