/**
 * Type of payment address in PaymentInformation.
 */
export declare enum AddressDetailsType {
    CryptoAddress = "CryptoAddressDetails",
    FiatAddress = "FiatAddressDetails",
    AchAddress = "AchAddressDetails"
}
/**
 * Matching schema for AddressDetailsType.CryptoAddress.
 */
export interface CryptoAddressDetails {
    readonly address: string;
    readonly tag?: string;
}
/**
 * Matching schema for AddressDetailsType.FiatAddress.
 */
export interface FiatAddressDetails {
    readonly accountNumber: string;
    readonly routingNumber?: string;
}
/**
 * Payment information included in a PaymentSetupDetails or by itself (in the
 * case of a GET request to the base path /).
 */
export interface PaymentInformation {
    readonly payId?: string;
    readonly addresses: Address[];
    readonly verifiedAddresses: VerifiedAddress[];
    readonly memo?: string;
}
/**
 * Address information included inside of a PaymentInformation object.
 */
export interface Address {
    readonly paymentNetwork: string;
    readonly environment?: string;
    readonly addressDetailsType: AddressDetailsType;
    readonly addressDetails: CryptoAddressDetails | FiatAddressDetails;
}
/**
 * Object containing address information alongside signatures.
 */
interface VerifiedAddress {
    readonly payload: string;
    readonly signatures: readonly VerifiedAddressSignature[];
}
/**
 * JWS object for verification.
 */
interface VerifiedAddressSignature {
    name: string;
    protected: string;
    signature: string;
}
export {};
//# sourceMappingURL=protocol.d.ts.map