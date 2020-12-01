import HttpStatus from '@xpring-eng/http-status';
import PayIDError from './payIdError';
/**
 * An enum containing the different kinds of DatabaseErrors.
 */
declare enum DatabaseErrorType {
    InvalidPayId = "InvalidPayId",
    EmptyStringViolation = "EmptyStringViolation",
    StringCaseViolation = "StringCaseViolation",
    UniqueConstraintViolation = "UniqueConstraintViolation",
    NotNullViolation = "NotNullViolation",
    Unknown = "Unknown"
}
/**
 * A enum for the different error messages associated with different kinds of DatabaseErrors.
 *
 * Exported for testing purposes.
 */
export declare enum DatabaseErrorMessage {
    InvalidPayId = "The PayID provided was in an invalid format",
    EmptyStringPayId = "The PayID was an empty string, which is invalid",
    EmptyStringPaymentNetwork = "The 'payment_network' of an address was an empty string, which is invalid",
    EmptyStringEnvironment = "The 'environment' of an address was an empty string, which is invalid",
    StringCasePayId = "The PayID provided had uppercase characters, but must be all lowercase",
    StringCasePaymentNetwork = "The 'payment_network' provided had lowercase characters, but must be all uppercase",
    StringCaseEnvironment = "The 'environment' provided had lowercase characters, but must be all uppercase",
    UniqueConstraintPayId = "There already exists a user with the provided PayID",
    UniqueConstraintAddress = "More than one address for the same (payment_network, environment) tuple was provided",
    NotNull = "NULL was given for a required value.",
    Unknown = "An unknown error occurred."
}
/**
 * A custom error class for problems encountered with running a database query.
 *
 * For example, A DatabaseError[NotNullViolation] is raised if we try updating/inserting
 * a non-nullable column with a NULL value.
 *
 * Exported for testing purposes.
 */
export default class DatabaseError extends PayIDError {
    readonly kind: DatabaseErrorType;
    /**
     * The constructor for new DatabaseErrors.
     *
     * @param message - The error message.
     * @param kind - The kind of DatabaseError.
     * @param status - An HTTP response code.
     */
    constructor(message: string, kind: DatabaseErrorType, status: HttpStatus);
}
/**
 * Map a raw error raised by Postgres/Knex into a custom DatabaseError.
 *
 * @param error - A raw SQL error raised by Postgres/Knex.
 *
 * @throws A custom DatabaseError which wraps the raw error from the database.
 */
export declare function handleDatabaseError(error: Error): never;
export {};
//# sourceMappingURL=databaseError.d.ts.map