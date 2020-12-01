import { Request, Response, NextFunction } from 'express';
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
export default function getPaymentInfo(req: Request, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=payIds.d.ts.map