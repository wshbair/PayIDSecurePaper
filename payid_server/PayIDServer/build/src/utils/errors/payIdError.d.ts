import HttpStatus from '@xpring-eng/http-status';
/**
 * Custom Errors for PayID.
 */
export default abstract class PayIDError extends Error {
    readonly httpStatusCode: HttpStatus;
    abstract readonly kind: string;
    /**
     * Create a new PayIDError instance.
     *
     * @param message - The error message.
     * @param status - An HttpStatus code associated with this error.
     */
    constructor(message: string, status: HttpStatus);
    /**
     * A custom toString method,
     * so our custom Errors include their `kind` when converted to a string.
     *
     * @returns A string representation of the PayIDError.
     */
    toString(): string;
}
//# sourceMappingURL=payIdError.d.ts.map