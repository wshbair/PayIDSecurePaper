"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../utils/errors");
const urls_1 = require("../services/urls");
const acl_1 = require("../data-access/acl");
const agent_service_1 = require("../services/agent.service");
//import { v4 as uuidv4 } from 'uuid';
// const jose = require('jose')
const crypto = require("crypto");
// import { Buffer } from 'buffer'
/**
 * A middleware asserting that all public API HTTP requests have an appropriate PayID-Version header.
 *
 * It also sets a PayID-Server-Version header on all public API responses to allow for PayID Protocol version negotiation.
 *
 * @param req - An Express Request object.
 * @param res - An Express Response object.
 * @param next - An Express next() function.
 *
 * @throws A ParseError if the PayID-Version header is missing, malformed, or unsupported.
 */
async function checkAuthentication(req, res, next) {
    // Add our PayID-Server-Version header to all successful responses.
    // This should be the most recent version of the PayID protocol this server knows how to handle.
    // We add it early so even errors will respond with the `PayID-Server-Version` header.
    //res.header('PayID-Server-Version', config.app.payIdVersion)
    //const authenticationHeader = req.header('Authentication')
    const senderPayID = req.header('Sender-PayID');
    const payIdUrl = urls_1.constructUrl(req.protocol, req.hostname, req.url);
    const payId = urls_1.urlToPayId(payIdUrl);
    // Checks if the Sender PayID header exists
    if (!senderPayID) {
        throw new errors_1.ParseError("Sender PayID header is required in the request", errors_1.ParseErrorType.MissingPayIdVersionHeader);
    }
    //Step 1 Check if these is already credentials for a given payId
    const credentials = await agent_service_1.getProofRequests();
    const senderCredential = credentials.filter((record) => record.state === 'verified' && record.presentation.requested_proof.revealed_attrs['0_payid_uuid'].raw === senderPayID);
    if (senderCredential.length != 0) {
        console.log("Sender Credential Good to GO !!!! ");
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
    //////////////////////////////////////////////////
    // Decode the authentication header
    /* if (authenticationHeader) {
      try {
        
        let buff = Buffer.from(authenticationHeader, 'base64').toString()
        let authenticationToken = JSON.parse(buff)
        jose.JWT.verify(authenticationToken.signature, jose.JWK.asKey(authenticationToken.publicKey));
        const userPublicKey = jose.JWK.asKey(authenticationToken.publicKey).toPEM()
        const claimedPublicKeyHash=  crypto.createHash('md5').update(userPublicKey).digest('hex')
        let data = await getAuthorizedPublicKeys(payId, claimedPublicKeyHash)
        // no record found in the DB for the given public key to access the payment information
        if(data.length == 0)
        {
          await addToGrayList(payId, authenticationHeader)
          throw new ParseError(
              "Unauthorized Access to Payment Information", ParseErrorType.UnauthorizedAccess
            )
          }
    
        } catch (error) {
          if(error.kind =='UnauthorizedAccess')
          {
            throw new ParseError(
              "Unauthorized Access to Payment Information", ParseErrorType.UnauthorizedAccess
            )
          }
          else
          {
            throw new ParseError(
              "Invalid authentication header",
              ParseErrorType.InvalidAuthenticationHeader,
            )
          }
          
    
      
        
      }
      }
       */
    // Add our Authentication token header to all responses.
    res.header('Authentication', "verified");
    // TODO:(hbergren) This probably should not live here.
    // We probably want a separate setHeaders() function that does the setting,
    // and this and the PayID-Version header can live there.
    //
    // The response may not be stored in any cache.
    // Although other directives may be set,
    // this alone is the only directive you need in preventing cached responses on modern browsers
    res.header('Cache-Control', 'no-store');
    next();
}
exports.default = checkAuthentication;
//# sourceMappingURL=checkAuthentication.js.map