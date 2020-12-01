import { Request, Response, NextFunction } from 'express';
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
export default function checkPublicApiVersionHeaders(req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=checkPublicApiVersionHeaders.d.ts.map