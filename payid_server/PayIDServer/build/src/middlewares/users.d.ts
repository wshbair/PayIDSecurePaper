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
export declare function getUser(req: Request, res: Response, next: NextFunction): Promise<void>;
/**
 * Create a new PayID.
 *
 * @param req - An Express Request object, holding PayID information.
 * @param res - An Express Response object.
 * @param next - An Express next() function.
 *
 * @throws ParseError if the PayID is missing from the request body.
 */
export declare function postUser(req: Request, res: Response, next: NextFunction): Promise<void>;
/**
 * Either create a new PayID, or update an existing PayID.
 *
 * @param req - An Express Request object, with a body holding the new PayID information.
 * @param res - An Express Response object.
 * @param next - An Express next() function.
 *
 * @throws A ParseError if either PayID is missing or invalid.
 */
export declare function putUser(req: Request, res: Response, next: NextFunction): Promise<void>;
/**
 * Removes a PayID from the PayID server.
 *
 * @param req - An Express Request object, holding the PayID.
 * @param res - An Express Response object.
 * @param next - An Express next() function.
 *
 * @throws A ParseError if the PayID is missing from the request.
 */
export declare function deleteUser(req: Request, res: Response, next: NextFunction): Promise<void>;
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
export declare function patchUserPayId(req: Request, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=users.d.ts.map