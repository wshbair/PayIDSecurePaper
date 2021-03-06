"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGrayListOfPayId = exports.addAuthorizedUser = void 0;
const http_status_1 = require("@xpring-eng/http-status");
const crypto = require("crypto");
const errors_1 = require("../utils/errors");
//const jose = require('jose')
const acl_1 = require("../data-access/acl");
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
/* export async function getUserACL(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  
  const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', { namedCurve: 'secp256k1'});
  
  const token2 = jose.JWT.sign(
    { 'publicKey': publicKey.export({type: 'spki', format: 'pem'}),
      'payId': 'wazen.shbair$money.com' },
    privateKey
    // {
    //   algorithm: 'ES256K',
    //   expiresIn: '1 hour',
    //   header: {
    //     typ: 'JWT'
    //   },
    //}
  )

  console.log("Token", token2)
  console.log("PublicKey", publicKey.export({type:"spki", format:'der'}).toString('hex'))

  //const verify= jose.JWT.verify(token2, publicKey)
  //console.log( "verify", verify)

//const decodedToken=  jose.JWT.decode(token2, { complete: true })
//console.log(decodedToken.payload)

   const payId = req.query.payId.toString()

  if (!payId) {
    throw new ParseError(
      'A `payId` must be provided in the path. A well-formed API call would look like `GET /users/alice$xpring.money`.',
      ParseErrorType.MissingPayId,
    )
  }

  const authorizedKey = await getACL(payId, "testing")

  if (authorizedKey === null || authorizedKey.length === 0) {
    res.locals.response = {
      payId,
      authorizedKey,
    }
  } else {
    res.locals.response = {
      payId,
      authorizedKey,
    }
  }
  next()
} */
/**
 * Add authorized public key to retrieve PayID account information .
 *
 * @param req - An Express Request object, holding PayID information.
 * @param res - An Express Response object.
 * @param next - An Express next() function.
 *
 * @throws ParseError if the PayID is missing from the request body.
 */
async function addAuthorizedUser(req, res, next) {
    const rawPayId = req.body.payId;
    const authorized_pay_id = req.body.authorized_pay_id;
    const authorized_pay_id_hash = crypto.createHash('md5').update(authorized_pay_id).toString();
    if (!rawPayId || typeof rawPayId !== 'string') {
        throw new errors_1.ParseError('A `payId` must be provided in the request body.', errors_1.ParseErrorType.MissingPayId);
    }
    await acl_1.insertUserACL(rawPayId, authorized_pay_id, authorized_pay_id_hash);
    res.locals.status = http_status_1.default.Created;
    res.locals.payId = rawPayId;
    next();
}
exports.addAuthorizedUser = addAuthorizedUser;
/**
 * Get Protected PayID account information .
 *
 * @param req - An Express Request object, holding PayID information.
 * @param res - An Express Response object.
 * @param next - An Express next() function.
 *
 * @throws LookupError .
 */
/*
export async function getProtectedPayId(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const userJWK = req.body.publicKey
  const authenticationToken = req.body.authenticationToken

  var authorized = false
  var accountInfo

    try {
      const verification= jose.JWT.verify(authenticationToken, jose.JWK.asKey(userJWK));
      const userPublicKey = jose.JWK.asKey(userJWK).toPEM()
      const claimedPublicKeyHash= crypto.createHash('md5').update(userPublicKey).digest('hex')

    //Check authorized keys from database
    const requestedPayId =  verification.payId
    const data= await getAuthorizedPublicKeys(requestedPayId, claimedPublicKeyHash)
    if (data.length >=1)
    {
      authorized=true
      accountInfo= await getAllVerifiedAddressInfoFromDatabase(requestedPayId)
    }
        
    } catch (error) {
      console.log("Error in decoding token")
    }

    res.locals.response= {
      "authorized_access": authorized,
      accountInfo
    }
    
  next()
}


// Generate public key and signature
export async function getJWK(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {

  const payId = req.body.requiredPayId
   
  const key = jose.JWK.generateSync('EC',  'P-256', { use: 'sig' } )
  const token = jose.JWT.sign(
    { 'payId': payId },
    key
  )
    res.locals.response= {
       "publicKey": key.toJWK(),
       "signature": token
    }
  next()
} */
async function getGrayListOfPayId(req, res, next) {
    const payId = req.query.payid.toString();
    const data = await acl_1.getGrayList(payId);
    res.locals.response = {
        data
    };
    next();
}
exports.getGrayListOfPayId = getGrayListOfPayId;
//# sourceMappingURL=acl.js.map