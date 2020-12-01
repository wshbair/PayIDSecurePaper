import PayIDError from './payIdError';
/**
 * An enum containing the different kinds of ParseErrors.
 */
export declare enum ParseErrorType {
    InvalidMediaType = "InvalidMediaType",
    MissingPayId = "MissingPayId",
    InvalidPayId = "InvalidPayId",
    MissingPayIdVersionHeader = "MissingPayIdVersionHeader",
    InvalidPayIdVersionHeader = "InvalidPayIdVersionHeader",
    UnsupportedPayIdVersionHeader = "UnsupportedPayIdVersionHeader",
    InvalidAuthenticationHeader = "InvalidAuthenticationHeader",
    UnauthorizedAccess = "UnauthorizedAccess",
    MissingPayIdApiVersionHeader = "MissingPayIdApiVersionHeader",
    InvalidPayIdApiVersionHeader = "InvalidPayIdApiVersionHeader",
    UnsupportedPayIdApiVersionHeader = "UnsupportedPayIdApiVersionHeader"
}
/**
 * A custom error type to organize logic around 400 - Bad Request errors.
 */
export default class ParseError extends PayIDError {
    readonly kind: ParseErrorType;
    /**
     * The constructor for new ParseErrors.
     *
     * @param message - An error message.
     * @param kind - The kind of ParseError for this error instance.
     */
    constructor(message: string, kind: ParseErrorType);
}
//# sourceMappingURL=parseError.d.ts.map