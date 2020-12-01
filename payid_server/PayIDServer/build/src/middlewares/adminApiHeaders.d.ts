import { Request, Response, NextFunction } from 'express';
/**
 * A middleware asserting that all Admin API HTTP requests have an appropriate PayID-API-Version header.
 *
 * It also sets version headers on all Admin API HTTP responses for informational purposes.
 *
 * @param req - An Express Request object.
 * @param res - An Express Response object.
 * @param next - An Express next() function.
 *
 * @throws A ParseError if the PayID-API-Version header is missing, malformed, or unsupported.
 */
export declare function checkRequestAdminApiVersionHeaders(req: Request, res: Response, next: NextFunction): void;
/**
 * A middleware asserting that Admin requests have an appropriate Content-Type header.
 *
 * @param req - An Express Request object.
 * @param _res - An Express Response object.
 * @param next - An Express next() function.
 * @throws A ParseError if the Content-Type header is missing, malformed, or unsupported.
 */
export declare function checkRequestContentType(req: Request, _res: Response, next: NextFunction): void;
/**
 * A middleware putting an Accept-Patch header in the response.
 *
 * @param _req - An Express Request object.
 * @param res - An Express Response object.
 * @param next - An Express next() function.
 */
export declare function addAcceptPatchResponseHeader(_req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=adminApiHeaders.d.ts.map