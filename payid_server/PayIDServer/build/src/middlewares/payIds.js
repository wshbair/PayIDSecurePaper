"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const payIds_1 = require("../data-access/payIds");
const memo_1 = require("../hooks/memo");
const basePayId_1 = require("../services/basePayId");
const headers_1 = require("../services/headers");
const metrics_1 = require("../services/metrics");
const urls_1 = require("../services/urls");
const errors_1 = require("../utils/errors");
//access control functions
const acl_1 = require("../data-access/acl");
const agent_service_1 = require("../services/agent.service");
const crypto = require("crypto");
/**
 * Resolves inbound requests to a PayID to their respective ledger addresses or other payment information.
 *
 * @param req - Contains PayID and payment network header.
 * @param res - Stores payment information to be returned to the client.
 * @param next - Passes req/res to next middleware.
 *
 * @returns A Promise resolving to nothing.
 *
 * @throws A LookupError if we could not find payment information for the given PayID.
 */
// eslint-disable-next-line max-lines-per-function -- For this middleware, this limit is too restrictive.
async function getPaymentInfo(req, res, next) {
    // NOTE: If you plan to expose your PayID with a port number, you
    // should include req.port as a fourth parameter.
    const payIdUrl = urls_1.constructUrl(req.protocol, req.hostname, req.url);
    // Parses the constructed URL to confirm it can be converted into a valid PayID
    const payId = urls_1.urlToPayId(payIdUrl);
    //Access Control Zone 
    //--------------------------------------------------------------------
    // Checks if the Sender PayID header exists
    const senderPayID = req.header('Sender-PayID');
    let SenderDID = '';
    if (!senderPayID) {
        throw new errors_1.ParseError("Sender PayID header is required in the request", errors_1.ParseErrorType.MissingPayIdVersionHeader);
    }
    //Step 1 Check if these is already credentials for a given payId
    const credentials = await agent_service_1.getProofRequests();
    const senderCredential = credentials.filter((record) => record.state === 'verified' && record.presentation.requested_proof.revealed_attrs['0_payid_uuid'].raw === senderPayID);
    if (senderCredential.length != 0) {
        console.log("Sender Credential Good to GO !!!! ");
        //Extract Sender DID from the credential 
        SenderDID = senderCredential[0].presentation.requested_proof.revealed_attrs['0_did_uuid'].raw;
        console.log("Check Access Control list ... ");
        const sender_pay_id_hash = crypto.createHash('md5').update(senderPayID).toString();
        let data = await acl_1.getAuthorizedPayId(payId, sender_pay_id_hash);
        // no record found in the DB for the given PayID to access the payment information 
        if (data.length == 0) {
            await acl_1.addToGrayList(payId, senderPayID);
            throw new errors_1.ParseError("Unauthorized Access to Payment Information of (" + payId + ") with (" + senderPayID + ") Digital Credential", errors_1.ParseErrorType.UnauthorizedAccess);
        }
    }
    else {
        await acl_1.addToGrayList(payId, senderPayID);
        throw new errors_1.ParseError("No VALID CREDENTIAL is found for (" + senderPayID + "), PRESENT your CREDENTIAL to the PayID Server", errors_1.ParseErrorType.UnauthorizedAccess);
    }
    //--------------------------------------------------------------------
    // Parses any accept headers to make sure they use valid PayID syntax
    //  - This overload (req.accepts()) isn't mentioned in the express documentation,
    // but if there are no args provided, an array of types sorted by preference
    // is returned
    // https://github.com/jshttp/accepts/blob/master/index.js#L96
    const parsedAcceptHeaders = headers_1.parseAcceptHeaders(req.accepts());
    // Get all addresses from DB
    // TODO(aking): Refactor this into a single knex query
    const [allAddressInfo, allVerifiedAddressInfo, identityKey,] = await Promise.all([
        payIds_1.getAllAddressInfoFromDatabase(payId),
        payIds_1.getAllVerifiedAddressInfoFromDatabase(payId),
        payIds_1.getIdentityKeyFromDatabase(payId).catch((_err) => {
            // This error is only emitted if the PayID is not found
            // If the PayID is found, but it has no identity key, it returns null instead
            // We can thus use this query to trigger 404s for missing PayIDs
            // ---
            // Respond with a 404 if we can't find the requested PayID
            throw new errors_1.LookupError(`PayID ${payId} could not be found.`, errors_1.LookupErrorType.MissingPayId, parsedAcceptHeaders);
        }),
    ]);
    // Content-negotiation to get preferred payment information
    const [preferredHeader, preferredAddresses, verifiedPreferredAddresses,] = basePayId_1.getPreferredAddressHeaderPair(allAddressInfo, allVerifiedAddressInfo, parsedAcceptHeaders);
    // Respond with a 404 if we can't find the requested payment information
    if (!preferredHeader) {
        // Record metrics for 404s
        throw new errors_1.LookupError(`Payment information for ${payId} could not be found.`, errors_1.LookupErrorType.MissingAddress, parsedAcceptHeaders);
    }
    // Wrap addresses into PaymentInformation object (this is the response in Base PayID)
    // * NOTE: To append a memo, MUST set a memo in createMemo()
    const formattedPaymentInfo = basePayId_1.formatPaymentInfo(preferredAddresses, verifiedPreferredAddresses, identityKey, res.get('PayID-Version'), payId, memo_1.default);
    // Set the content-type to the media type corresponding to the returned address
    res.set('Content-Type', preferredHeader.mediaType);
    // Store response information (or information to be used in other middlewares)
    // TODO:(hbergren), come up with a less hacky way to pipe around data than global state.
    res.locals.payId = payId; //await encryptPaymentInformation(payId, "test")
    res.locals.paymentInformation = formattedPaymentInfo;
    res.locals.response = await agent_service_1.encryptPaymentInformation(JSON.stringify(formattedPaymentInfo), SenderDID);
    metrics_1.default.recordPayIdLookupResult(true, preferredHeader.paymentNetwork, preferredHeader.environment);
    return next();
}
exports.default = getPaymentInfo;
//# sourceMappingURL=payIds.js.map