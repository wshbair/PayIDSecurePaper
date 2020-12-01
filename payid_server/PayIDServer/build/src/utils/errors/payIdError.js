"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Custom Errors for PayID.
 */
class PayIDError extends Error {
    /**
     * Create a new PayIDError instance.
     *
     * @param message - The error message.
     * @param status - An HttpStatus code associated with this error.
     */
    constructor(message, status) {
        super(message);
        // All our custom errors will extend PayIDError
        // So use the name of the class extending PayIDError
        this.name = this.constructor.name;
        this.httpStatusCode = status;
    }
    /**
     * A custom toString method,
     * so our custom Errors include their `kind` when converted to a string.
     *
     * @returns A string representation of the PayIDError.
     */
    toString() {
        return `${this.name}[${this.kind}]: ${this.message}`;
    }
}
exports.default = PayIDError;
//# sourceMappingURL=payIdError.js.map