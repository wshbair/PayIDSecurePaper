import { Request, Response, NextFunction, RequestHandler } from 'express';
import { PayIDError } from '../utils/errors';
/**
 * An error handling middleware responsible for catching unhandled errors,
 * and sending out an appropriate HTTP error response.
 *
 * @param err - An uncaught error to be handled by our error handler.
 * @param _req - An Express Request object (unused).
 * @param res - An Express Response object.
 * @param next - An Express next() function. Used for delegating to the default error handler.
 *
 * @returns Nothing.
 */
export default function errorHandler(err: Error | PayIDError, _req: Request, res: Response, next: NextFunction): void;
/**
 * A function used to wrap asynchronous Express middlewares.
 * It catches async errors so Express can pass them to an error handling middleware.
 *
 * @param handler - An Express middleware function.
 *
 * @returns An Express middleware capable of catching asynchronous errors.
 */
export declare function wrapAsync(handler: RequestHandler): RequestHandler;
//# sourceMappingURL=errorHandler.d.ts.map