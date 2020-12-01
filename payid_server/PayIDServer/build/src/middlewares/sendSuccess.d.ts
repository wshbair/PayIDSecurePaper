import { Request, Response } from 'express';
/**
 * Sends an HTTP response with the appropriate HTTP status and JSON-formatted payload (if any).
 *
 * It also sets the Location header on responses for 201 - Created responses.
 *
 * @param req - An Express Request object.
 * @param res - An Express Response object.
 */
export default function sendSuccess(req: Request, res: Response): void;
//# sourceMappingURL=sendSuccess.d.ts.map