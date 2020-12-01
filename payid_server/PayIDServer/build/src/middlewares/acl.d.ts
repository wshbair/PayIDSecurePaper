import { Request, Response, NextFunction } from 'express';
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
/**
 * Add authorized public key to retrieve PayID account information .
 *
 * @param req - An Express Request object, holding PayID information.
 * @param res - An Express Response object.
 * @param next - An Express next() function.
 *
 * @throws ParseError if the PayID is missing from the request body.
 */
export declare function addAuthorizedUser(req: Request, res: Response, next: NextFunction): Promise<void>;
/**
 * Get Protected PayID account information .
 *
 * @param req - An Express Request object, holding PayID information.
 * @param res - An Express Response object.
 * @param next - An Express next() function.
 *
 * @throws LookupError .
 */
export declare function getGrayListOfPayId(req: Request, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=acl.d.ts.map