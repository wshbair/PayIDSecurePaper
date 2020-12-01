import { Request, Response, NextFunction } from 'express'

import {
  getAllAddressInfoFromDatabase,
  getAllVerifiedAddressInfoFromDatabase,
  getIdentityKeyFromDatabase,
} from '../data-access/payIds'
import createMemo from '../hooks/memo'
import {
  formatPaymentInfo,
  getPreferredAddressHeaderPair,
} from '../services/basePayId'
import { parseAcceptHeaders } from '../services/headers'
import metrics from '../services/metrics'
import { urlToPayId, constructUrl } from '../services/urls'
import { LookupError, LookupErrorType,ParseError, ParseErrorType  } from '../utils/errors' 

//access control functions
import { getAuthorizedPayId, addToGrayList } from '../data-access/acl'
import{getProofRequests,encryptPaymentInformation} from '../services/agent.service'
import * as crypto from 'crypto'


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
export default async function getPaymentInfo(
  req: Request,
  res: Response,
  next: NextFunction, 
): Promise<void> {
  // NOTE: If you plan to expose your PayID with a port number, you
  // should include req.port as a fourth parameter.
  const payIdUrl = constructUrl(req.protocol, req.hostname, req.url)

  // Parses the constructed URL to confirm it can be converted into a valid PayID
  const payId = urlToPayId(payIdUrl)

  //Access Control Zone 
  //--------------------------------------------------------------------
  // Checks if the Sender PayID header exists
  const senderPayID = req.header('Sender-PayID')
  let SenderDID=''
  if (!senderPayID) {
    throw new ParseError(
      "Sender PayID header is required in the request",
      ParseErrorType.MissingPayIdVersionHeader,
    )
  } 
  //Step 1 Check if these is already credentials for a given payId
  const credentials = await getProofRequests()
  const senderCredential = credentials.filter((record:any) => record.state === 'verified' && record.presentation.requested_proof.revealed_attrs['0_payid_uuid'].raw===senderPayID);
  if(senderCredential.length != 0)
  {
    console.log("Sender Credential Good to GO !!!! ")
    //Extract Sender DID from the credential 
     SenderDID = senderCredential[0].presentation.requested_proof.revealed_attrs['0_did_uuid'].raw
    console.log("Check Access Control list ... ")
    const sender_pay_id_hash = crypto.createHash('md5').update(senderPayID).toString()
    let data = await getAuthorizedPayId(payId, sender_pay_id_hash)
    // no record found in the DB for the given PayID to access the payment information 
    if(data.length == 0)
    {
      await addToGrayList(payId, senderPayID)
      throw new ParseError(
          "Unauthorized Access to Payment Information of ("+payId+") with ("+senderPayID+") Digital Credential", ParseErrorType.UnauthorizedAccess
        )
      }
  }
  else
  {
    await addToGrayList(payId, senderPayID)
    throw new ParseError(
      "No VALID CREDENTIAL is found for ("+senderPayID+"), PRESENT your CREDENTIAL to the PayID Server", ParseErrorType.UnauthorizedAccess
    )
  }



  //--------------------------------------------------------------------


  // Parses any accept headers to make sure they use valid PayID syntax
  //  - This overload (req.accepts()) isn't mentioned in the express documentation,
  // but if there are no args provided, an array of types sorted by preference
  // is returned
  // https://github.com/jshttp/accepts/blob/master/index.js#L96
  const parsedAcceptHeaders = parseAcceptHeaders(req.accepts())

  // Get all addresses from DB
  // TODO(aking): Refactor this into a single knex query
  const [
    allAddressInfo,
    allVerifiedAddressInfo,
    identityKey,
  ] = await Promise.all([
    getAllAddressInfoFromDatabase(payId),
    getAllVerifiedAddressInfoFromDatabase(payId),
    getIdentityKeyFromDatabase(payId).catch((_err) => {
      // This error is only emitted if the PayID is not found
      // If the PayID is found, but it has no identity key, it returns null instead
      // We can thus use this query to trigger 404s for missing PayIDs
      // ---
      // Respond with a 404 if we can't find the requested PayID
      throw new LookupError(
        `PayID ${payId} could not be found.`,
        LookupErrorType.MissingPayId,
        parsedAcceptHeaders,
      )
    }),
  ])

  // Content-negotiation to get preferred payment information
  const [
    preferredHeader,
    preferredAddresses,
    verifiedPreferredAddresses,
  ] = getPreferredAddressHeaderPair(
    allAddressInfo,
    allVerifiedAddressInfo,
    parsedAcceptHeaders,
  )

  // Respond with a 404 if we can't find the requested payment information
  if (!preferredHeader) {
    // Record metrics for 404s
    throw new LookupError(
      `Payment information for ${payId} could not be found.`,
      LookupErrorType.MissingAddress,
      parsedAcceptHeaders,
    )
  }

  // Wrap addresses into PaymentInformation object (this is the response in Base PayID)
  // * NOTE: To append a memo, MUST set a memo in createMemo()
  const formattedPaymentInfo = formatPaymentInfo(
    preferredAddresses,
    verifiedPreferredAddresses,
    identityKey,
    res.get('PayID-Version'),
    payId,
    createMemo,
  )

  // Set the content-type to the media type corresponding to the returned address
  res.set('Content-Type', preferredHeader.mediaType)

  // Store response information (or information to be used in other middlewares)
  // TODO:(hbergren), come up with a less hacky way to pipe around data than global state.
  res.locals.payId = payId //await encryptPaymentInformation(payId, "test")
  res.locals.paymentInformation = formattedPaymentInfo
  res.locals.response =  await encryptPaymentInformation(JSON.stringify(formattedPaymentInfo), SenderDID)

  metrics.recordPayIdLookupResult(
    true,
    preferredHeader.paymentNetwork,
    preferredHeader.environment,
  )
  return next()
}
