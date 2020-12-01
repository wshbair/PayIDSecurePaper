"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddressDetailsType = exports.getPreferredAddressHeaderPair = exports.formatPaymentInfo = void 0;
const protocol_1 = require("../types/protocol");
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
// eslint-disable-next-line max-params -- We want 6 parameters here. I think this makes more sense that destructuring.
function formatPaymentInfo(addresses, verifiedAddresses, identityKey, version, payId, memoFn) {
    const paymentInformation = {
        addresses: addresses.map((address) => {
            return {
                paymentNetwork: address.paymentNetwork,
                ...(address.environment && { environment: address.environment }),
                addressDetailsType: getAddressDetailsType(address, version),
                addressDetails: address.details,
            };
        }),
        verifiedAddresses: verifiedAddresses.map((address) => {
            var _a;
            return {
                signatures: [
                    {
                        name: 'testing',
                        protected: identityKey !== null && identityKey !== void 0 ? identityKey : '',
                        signature: (_a = address.identityKeySignature) !== null && _a !== void 0 ? _a : '',
                    },
                ],
                payload: JSON.stringify({
                    payId,
                    // Call the address a "payIdAddress" so we don't step on the JWT "address"
                    // field if we ever change our minds
                    payIdAddress: {
                        paymentNetwork: address.paymentNetwork,
                        ...(address.environment && { environment: address.environment }),
                        addressDetailsType: getAddressDetailsType(address, version),
                        addressDetails: address.details,
                    },
                }),
            };
        }),
        payId,
    };
    return {
        ...paymentInformation,
        ...((memoFn === null || memoFn === void 0 ? void 0 : memoFn(paymentInformation)) && { memo: memoFn(paymentInformation) }),
    };
}
exports.formatPaymentInfo = formatPaymentInfo;
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
function getPreferredAddressHeaderPair(allAddresses, allVerifiedAddresses, sortedParsedAcceptHeaders) {
    if (allAddresses.length === 0 && allVerifiedAddresses.length === 0) {
        return [undefined, [], []];
    }
    // Find the optimal payment information from a sorted list
    for (const acceptHeader of sortedParsedAcceptHeaders) {
        // Return all addresses for application/payid+json
        if (acceptHeader.paymentNetwork === 'PAYID') {
            return [acceptHeader, allAddresses, allVerifiedAddresses];
        }
        // Otherwise, try to fetch the address for the respective media type
        // foundAddress -> what we have in our database
        // acceptHeader -> what the client sent over
        const foundAddress = allAddresses.find((address) => {
            var _a;
            return address.paymentNetwork === acceptHeader.paymentNetwork &&
                // If no environment is found in our database, it returns null
                // If the client doesn't send over an environment, it is undefined
                // Below we convert null to undefined to do the comparison
                ((_a = address.environment) !== null && _a !== void 0 ? _a : undefined) === acceptHeader.environment;
        });
        const foundVerifiedAddress = allVerifiedAddresses.find((address) => {
            var _a;
            return address.paymentNetwork === acceptHeader.paymentNetwork &&
                ((_a = address.environment) !== null && _a !== void 0 ? _a : undefined) === acceptHeader.environment;
        });
        // Return the address + the media type to respond with
        // If either a unverified or verified address is found, we return
        if (foundAddress || foundVerifiedAddress) {
            return [
                acceptHeader,
                foundAddress ? [foundAddress] : [],
                foundVerifiedAddress ? [foundVerifiedAddress] : [],
            ];
        }
    }
    return [undefined, [], []];
}
exports.getPreferredAddressHeaderPair = getPreferredAddressHeaderPair;
// HELPERS
/**
 * Gets the associated AddressDetailsType for an address.
 *
 * @param address - The address information associated with a PayID.
 * @param version - The PayID protocol version.
 * @returns The AddressDetailsType for the address.
 */
function getAddressDetailsType(address, version) {
    if (address.paymentNetwork === 'ACH') {
        if (version === '1.0') {
            return protocol_1.AddressDetailsType.AchAddress;
        }
        return protocol_1.AddressDetailsType.FiatAddress;
    }
    return protocol_1.AddressDetailsType.CryptoAddress;
}
exports.getAddressDetailsType = getAddressDetailsType;
//# sourceMappingURL=basePayId.js.map