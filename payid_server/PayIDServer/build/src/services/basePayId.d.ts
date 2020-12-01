import { AddressInformation } from '../types/database';
import { ParsedAcceptHeader } from '../types/headers';
import { AddressDetailsType, PaymentInformation } from '../types/protocol';
/**
 * Format AddressInformation into a PaymentInformation object.
 * To be returned in PaymentSetupDetails, or as the response in
 * a Base PayID flow.
 *
 * @param addresses - Array of address information associated with a PayID.
 * @param verifiedAddresses - Array of address information associated with a PayID.
 * @param identityKey - A base64 encoded identity key for verifiable PayID.
 * @param version - The PayID protocol response version.
 * @param payId - Optionally include a PayId.
 * @param memoFn - A function, taking an optional PaymentInformation object,
 * that returns a string to be used as the memo.
 * @returns The formatted PaymentInformation object.
 */
export declare function formatPaymentInfo(addresses: readonly AddressInformation[], verifiedAddresses: readonly AddressInformation[], identityKey: string | null, version: string, payId: string, memoFn?: (paymentInformation: PaymentInformation) => string): PaymentInformation;
/**
 * Gets the best payment information associated with a PayID given a set of sorted
 * Accept types and a list of payment information.
 *
 * @param allAddresses - The array of AddressInformation objects to look through.
 * @param allVerifiedAddresses - The array of verified AddressInformation objects to look through.
 * @param sortedParsedAcceptHeaders - An array of ParsedAcceptHeader objects, sorted by preference.
 *
 * @returns A tuple containing the AcceptMediaType (or undefined) and its associated AddressInformation
 * if one exists.
 */
export declare function getPreferredAddressHeaderPair(allAddresses: readonly AddressInformation[], allVerifiedAddresses: readonly AddressInformation[], sortedParsedAcceptHeaders: readonly ParsedAcceptHeader[]): [ParsedAcceptHeader | undefined, readonly AddressInformation[], readonly AddressInformation[]];
/**
 * Gets the associated AddressDetailsType for an address.
 *
 * @param address - The address information associated with a PayID.
 * @param version - The PayID protocol version.
 * @returns The AddressDetailsType for the address.
 */
export declare function getAddressDetailsType(address: AddressInformation, version: string): AddressDetailsType;
//# sourceMappingURL=basePayId.d.ts.map