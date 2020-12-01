"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchUserPayId = exports.deleteUser = exports.putUser = exports.postUser = exports.getUser = void 0;
const http_status_1 = require("@xpring-eng/http-status");
const payIds_1 = require("../data-access/payIds");
const users_1 = require("../data-access/users");
const errors_1 = require("../utils/errors");
/**
 * Retrieve all the information about that PayID.
 *
 * @param req - An Express Request object, holding the PayID.
 * @param res - An Express Response object.
 * @param next - An Express next() function.
 *
 * @throws A ParseError if the PayID is missing.
 * @throws A LookupError if the PayID has no associated addresses.
 *
 * TODO:(hbergren): Handle retrieving an array of users as well as a single user?
 */
async function getUser(req, res, next) {
    // TODO:(dino) Validate PayID
    const payId = req.params.payId.toLowerCase();
    // TODO:(hbergren) More validation? Assert that the PayID is `https://` and of a certain form?
    // Could use a similar regex to the one used by the database.
    if (!payId) {
        throw new errors_1.ParseError('A `payId` must be provided in the path. A well-formed API call would look like `GET /users/alice$xpring.money`.', errors_1.ParseErrorType.MissingPayId);
    }
    // TODO:(hbergren) Does not work for multiple accounts
    const doesUserExist = await users_1.checkUserExistence(payId);
    if (!doesUserExist) {
        throw new errors_1.LookupError(`No information could be found for the PayID ${payId}.`, errors_1.LookupErrorType.Unknown);
    }
    const addresses = await payIds_1.getAllAddressInfoFromDatabase(payId);
    const verifiedAddresses = await payIds_1.getAllVerifiedAddressInfoFromDatabase(payId);
    const identityKey = await payIds_1.getIdentityKeyFromDatabase(payId);
    if (identityKey === null || identityKey.length === 0) {
        res.locals.response = {
            payId,
            addresses,
            verifiedAddresses,
        };
    }
    else {
        res.locals.response = {
            payId,
            identityKey,
            addresses,
            verifiedAddresses,
        };
    }
    next();
}
exports.getUser = getUser;
// TODO:(hbergren) Handle both single user and array of new users
// TODO:(hbergren) Any sort of validation? Validate XRP addresses have both X-Address & Classic/DestinationTag?
// TODO:(hbergren) Any sort of validation on the PayID? Check the domain name to make sure it's owned by that organization?
// TODO:(hbergren) Use joi to validate the `req.body`. All required properties present, and match some sort of validation.
/**
 * Create a new PayID.
 *
 * @param req - An Express Request object, holding PayID information.
 * @param res - An Express Response object.
 * @param next - An Express next() function.
 *
 * @throws ParseError if the PayID is missing from the request body.
 */
async function postUser(req, res, next) {
    // TODO:(hbergren) Any validation? Assert that the PayID is `https://` and of a certain form?
    // Do that using a regex route param in Express?
    // Could use a similar regex to the one used by the database. Also look at validation in the conversion functions.
    const rawPayId = req.body.payId;
    if (!rawPayId || typeof rawPayId !== 'string') {
        throw new errors_1.ParseError('A `payId` must be provided in the request body.', errors_1.ParseErrorType.MissingPayId);
    }
    const payId = rawPayId.toLowerCase();
    // TODO:(hbergren) Need to test here and in `putUser()` that `req.body.addresses` is well formed.
    // This includes making sure that everything that is not ACH or ILP is in a CryptoAddressDetails format.
    // And that we `toUpperCase()` paymentNetwork and environment as part of parsing the addresses.
    let allAddresses = [];
    if (req.body.addresses !== undefined) {
        allAddresses = allAddresses.concat(req.body.addresses);
    }
    if (req.body.verifiedAddresses !== undefined) {
        allAddresses = allAddresses.concat(req.body.verifiedAddresses);
    }
    await users_1.insertUser(payId, allAddresses, req.body.identityKey);
    // Set HTTP status and save the PayID to generate the Location header in later middleware
    res.locals.status = http_status_1.default.Created;
    res.locals.payId = payId;
    next();
}
exports.postUser = postUser;
/**
 * Either create a new PayID, or update an existing PayID.
 *
 * @param req - An Express Request object, with a body holding the new PayID information.
 * @param res - An Express Response object.
 * @param next - An Express next() function.
 *
 * @throws A ParseError if either PayID is missing or invalid.
 */
async function putUser(req, res, next) {
    var _a, _b, _c;
    // TODO:(hbergren) Validate req.body and throw a 400 Bad Request when appropriate
    // TODO(hbergren): pull this PayID / HttpError out into middleware?
    const rawPayId = req.params.payId;
    const rawNewPayId = (_a = req.body) === null || _a === void 0 ? void 0 : _a.payId;
    const addresses = (_b = req.body) === null || _b === void 0 ? void 0 : _b.addresses;
    const identityKey = (_c = req.body) === null || _c === void 0 ? void 0 : _c.identityKey;
    // TODO:(hbergren) More validation? Assert that the PayID is `$` and of a certain form?
    // Do that using a regex route param in Express?
    // Could use a similar regex to the one used by the database.
    if (!rawPayId) {
        throw new errors_1.ParseError('A `payId` must be provided in the path. A well-formed API call would look like `PUT /users/alice$xpring.money`.', errors_1.ParseErrorType.MissingPayId);
    }
    if (!rawNewPayId || typeof rawNewPayId !== 'string') {
        throw new errors_1.ParseError('A `payId` must be provided in the request body.', errors_1.ParseErrorType.MissingPayId);
    }
    // TODO:(dino) move this to validation
    if (!rawPayId.includes('$') || !rawNewPayId.includes('$')) {
        throw new errors_1.ParseError('Bad input. PayIDs must contain a "$"', errors_1.ParseErrorType.InvalidPayId);
    }
    // TODO:(hbergren) We should rip this out since PayIDs now officially support multiple '$'.
    if ((rawPayId.match(/\$/gu) || []).length !== 1 ||
        (rawNewPayId.match(/\$/gu) || []).length !== 1) {
        throw new errors_1.ParseError('Bad input. PayIDs must contain only one "$"', errors_1.ParseErrorType.InvalidPayId);
    }
    const payId = rawPayId.toLowerCase();
    const newPayId = rawNewPayId.toLowerCase();
    // TODO:(dino) validate body params before this
    let updatedAddresses;
    let statusCode = http_status_1.default.OK;
    updatedAddresses = await users_1.replaceUser(payId, newPayId, addresses);
    if (updatedAddresses === null) {
        updatedAddresses = await users_1.insertUser(newPayId, addresses, identityKey);
        statusCode = http_status_1.default.Created;
    }
    // If the status code is 201 - Created, we need to set a Location header later with the PayID
    if (statusCode === http_status_1.default.Created) {
        res.locals.payId = newPayId;
    }
    res.locals.status = statusCode;
    res.locals.response = {
        payId: newPayId,
        addresses: updatedAddresses,
    };
    next();
}
exports.putUser = putUser;
/**
 * Removes a PayID from the PayID server.
 *
 * @param req - An Express Request object, holding the PayID.
 * @param res - An Express Response object.
 * @param next - An Express next() function.
 *
 * @throws A ParseError if the PayID is missing from the request.
 */
async function deleteUser(req, res, next) {
    // TODO:(hbergren) This absolutely needs to live in middleware
    const payId = req.params.payId.toLowerCase();
    // TODO:(hbergren) More validation? Assert that the PayID is `https://` and of a certain form?
    // Do that using a regex route param in Express? Could use a similar regex to the one used by the database.
    if (!payId) {
        throw new errors_1.ParseError('A PayID must be provided in the path. A well-formed API call would look like `DELETE /users/alice$xpring.money`.', errors_1.ParseErrorType.MissingPayId);
    }
    await users_1.removeUser(payId);
    res.locals.status = http_status_1.default.NoContent;
    next();
}
exports.deleteUser = deleteUser;
/**
 * Updates a PayID only, not the addresses.
 *
 * @param req - An Express Request object, holding the PayID.
 * @param res - An Express Response object.
 * @param next - An Express next() function.
 *
 * @throws A ParseError if the PayID is missing from the request.
 * @throws A LookupError if the PayID doesn't already exist in the database.
 */
async function patchUserPayId(req, res, next) {
    const rawOldPayId = req.params.payId;
    if (!rawOldPayId) {
        throw new errors_1.ParseError('A `payId` must be provided in the path. A well-formed API call would look like `PATCH /users/alice$xpring.money`.', errors_1.ParseErrorType.MissingPayId);
    }
    // "Potential" because we don't know yet if there will be an error or not
    const rawNewPotentialPayId = req.body.payId;
    if (!rawNewPotentialPayId || typeof rawNewPotentialPayId !== 'string') {
        throw new errors_1.ParseError('A `payId` must be provided in the request body.', errors_1.ParseErrorType.MissingPayId);
    }
    // TODO: move this to validation
    if (!rawOldPayId.includes('$') || !rawNewPotentialPayId.includes('$')) {
        throw new errors_1.ParseError('Bad input. PayIDs must contain a "$"', errors_1.ParseErrorType.InvalidPayId);
    }
    // TODO: We should rip this out since PayIDs now officially support multiple '$'.
    if ((rawOldPayId.match(/\$/gu) || []).length !== 1 ||
        (rawNewPotentialPayId.match(/\$/gu) || []).length !== 1) {
        throw new errors_1.ParseError('Bad input. PayIDs must contain only one "$"', errors_1.ParseErrorType.InvalidPayId);
    }
    const newPayId = rawNewPotentialPayId.toLowerCase();
    const oldPayId = rawOldPayId.toLowerCase();
    const account = await users_1.replaceUserPayId(oldPayId, newPayId);
    // If we try to update a PayID which doesn't exist, the 'account' object will be null.
    if (!account) {
        throw new errors_1.LookupError(`The PayID ${oldPayId} doesn't exist.`, errors_1.LookupErrorType.MissingPayId);
    }
    res.locals.status = http_status_1.default.Created;
    res.locals.payId = newPayId;
    next();
}
exports.patchUserPayId = patchUserPayId;
//# sourceMappingURL=users.js.map