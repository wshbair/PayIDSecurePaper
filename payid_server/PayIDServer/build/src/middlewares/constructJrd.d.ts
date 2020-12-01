import { NextFunction, Request, Response } from 'express';
/**
 * Constructs a PayID Discovery JRD from a PayID.
 *
 * @param req - Contains a PayID as a query parameter.
 * @param res - Stores the JRD to be returned to the client.
 * @param next - Passes req/res to next middleware.
 * @returns A Promise resolving to nothing.
 * @throws ParseError if the PayID is missing from the request parameters.
 */
export default function constructJrd(req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=constructJrd.d.ts.map