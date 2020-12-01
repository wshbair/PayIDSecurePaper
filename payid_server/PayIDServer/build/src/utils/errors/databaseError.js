"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDatabaseError = exports.DatabaseErrorMessage = void 0;
const http_status_1 = require("@xpring-eng/http-status");
const logger_1 = require("../logger");
const payIdError_1 = require("./payIdError");
/**
 * An enum containing the different kinds of DatabaseErrors.
 */
var DatabaseErrorType;
(function (DatabaseErrorType) {
    DatabaseErrorType["InvalidPayId"] = "InvalidPayId";
    DatabaseErrorType["EmptyStringViolation"] = "EmptyStringViolation";
    DatabaseErrorType["StringCaseViolation"] = "StringCaseViolation";
    DatabaseErrorType["UniqueConstraintViolation"] = "UniqueConstraintViolation";
    DatabaseErrorType["NotNullViolation"] = "NotNullViolation";
    DatabaseErrorType["Unknown"] = "Unknown";
})(DatabaseErrorType || (DatabaseErrorType = {}));
/**
 * A enum for the different error messages associated with different kinds of DatabaseErrors.
 *
 * Exported for testing purposes.
 */
var DatabaseErrorMessage;
(function (DatabaseErrorMessage) {
    DatabaseErrorMessage["InvalidPayId"] = "The PayID provided was in an invalid format";
    DatabaseErrorMessage["EmptyStringPayId"] = "The PayID was an empty string, which is invalid";
    DatabaseErrorMessage["EmptyStringPaymentNetwork"] = "The 'payment_network' of an address was an empty string, which is invalid";
    DatabaseErrorMessage["EmptyStringEnvironment"] = "The 'environment' of an address was an empty string, which is invalid";
    DatabaseErrorMessage["StringCasePayId"] = "The PayID provided had uppercase characters, but must be all lowercase";
    DatabaseErrorMessage["StringCasePaymentNetwork"] = "The 'payment_network' provided had lowercase characters, but must be all uppercase";
    DatabaseErrorMessage["StringCaseEnvironment"] = "The 'environment' provided had lowercase characters, but must be all uppercase";
    DatabaseErrorMessage["UniqueConstraintPayId"] = "There already exists a user with the provided PayID";
    DatabaseErrorMessage["UniqueConstraintAddress"] = "More than one address for the same (payment_network, environment) tuple was provided";
    DatabaseErrorMessage["NotNull"] = "NULL was given for a required value.";
    DatabaseErrorMessage["Unknown"] = "An unknown error occurred.";
})(DatabaseErrorMessage = exports.DatabaseErrorMessage || (exports.DatabaseErrorMessage = {}));
/**
 * A custom error class for problems encountered with running a database query.
 *
 * For example, A DatabaseError[NotNullViolation] is raised if we try updating/inserting
 * a non-nullable column with a NULL value.
 *
 * Exported for testing purposes.
 */
class DatabaseError extends payIdError_1.default {
    /**
     * The constructor for new DatabaseErrors.
     *
     * @param message - The error message.
     * @param kind - The kind of DatabaseError.
     * @param status - An HTTP response code.
     */
    constructor(message, kind, status) {
        super(message, status);
        this.kind = kind;
    }
}
exports.default = DatabaseError;
/* eslint-disable max-lines-per-function --
 * TODO:(hbergren), it might be worth refactoring this into smaller helper functions,
 * to make this easier to reason about.
 */
/**
 * Map a raw error raised by Postgres/Knex into a custom DatabaseError.
 *
 * @param error - A raw SQL error raised by Postgres/Knex.
 *
 * @throws A custom DatabaseError which wraps the raw error from the database.
 */
function handleDatabaseError(error) {
    logger_1.default.debug(error);
    // InvalidPayId Errors
    if (error.message.includes('valid_pay_id')) {
        throw new DatabaseError(DatabaseErrorMessage.InvalidPayId, DatabaseErrorType.InvalidPayId, http_status_1.default.BadRequest);
    }
    // EmptyStringViolation Errors
    if (error.message.includes('pay_id_length_nonzero')) {
        throw new DatabaseError(DatabaseErrorMessage.EmptyStringPayId, DatabaseErrorType.EmptyStringViolation, http_status_1.default.BadRequest);
    }
    if (error.message.includes('payment_network_length_nonzero')) {
        throw new DatabaseError(DatabaseErrorMessage.EmptyStringPaymentNetwork, DatabaseErrorType.EmptyStringViolation, http_status_1.default.BadRequest);
    }
    if (error.message.includes('environment_length_nonzero')) {
        throw new DatabaseError(DatabaseErrorMessage.EmptyStringEnvironment, DatabaseErrorType.EmptyStringViolation, http_status_1.default.BadRequest);
    }
    // StringCaseViolation Errors
    if (error.message.includes('pay_id_lowercase')) {
        throw new DatabaseError(DatabaseErrorMessage.StringCasePayId, DatabaseErrorType.StringCaseViolation, http_status_1.default.InternalServerError);
    }
    if (error.message.includes('payment_network_uppercase')) {
        throw new DatabaseError(DatabaseErrorMessage.StringCasePaymentNetwork, DatabaseErrorType.StringCaseViolation, http_status_1.default.InternalServerError);
    }
    if (error.message.includes('environment_uppercase')) {
        throw new DatabaseError(DatabaseErrorMessage.StringCaseEnvironment, DatabaseErrorType.StringCaseViolation, http_status_1.default.InternalServerError);
    }
    // UniqueConstraintViolation Errors
    if (error.message.includes('account_pay_id_key')) {
        throw new DatabaseError(DatabaseErrorMessage.UniqueConstraintPayId, DatabaseErrorType.UniqueConstraintViolation, http_status_1.default.Conflict);
    }
    if (error.message.includes('one_address_per_account_payment_network_environment_tuple')) {
        throw new DatabaseError(DatabaseErrorMessage.UniqueConstraintAddress, DatabaseErrorType.UniqueConstraintViolation, http_status_1.default.Conflict);
    }
    // General errors
    if (error.message.includes('violates not-null constraint')) {
        throw new DatabaseError(DatabaseErrorMessage.NotNull, DatabaseErrorType.NotNullViolation, http_status_1.default.InternalServerError);
    }
    throw new DatabaseError(DatabaseErrorMessage.Unknown, DatabaseErrorType.Unknown, http_status_1.default.InternalServerError);
    // TODO:(hbergren) Knex does not yet handle connection errors:
    // https://github.com/knex/knex/issues/3113
}
exports.handleDatabaseError = handleDatabaseError;
/* eslint-enable max-lines-per-function */
//# sourceMappingURL=databaseError.js.map