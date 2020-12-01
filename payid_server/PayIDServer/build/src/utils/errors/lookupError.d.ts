import { ParsedAcceptHeader } from '../../types/headers';
import PayIDError from './payIdError';
export declare enum LookupErrorType {
    MissingPayId = "MissingPayId",
    MissingAddress = "MissingAddress",
    Unknown = "Unknown"
}
/**
 * A custom error class to organize logic around errors related to a 404 - Not Found.
 */
export default class LookupError extends PayIDError {
    readonly kind: LookupErrorType;
    readonly headers?: readonly ParsedAcceptHeader[];
    /**
     * The constructor for new LookupErrors.
     *
     * @param message - An error message.
     * @param kind - The kind of LookupError for this instance.
     * @param headers - The headers used for the PayID lookup.
     */
    constructor(message: string, kind: LookupErrorType, headers?: readonly ParsedAcceptHeader[]);
}
//# sourceMappingURL=lookupError.d.ts.map