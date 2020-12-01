import { Response } from 'express';
/**
 * A helper function for logging errors and sending the HTTP error response.
 *
 * @param errorCode - An HTTP error code.
 * @param msg - The error message.
 * @param res - An Express Response object, for sending the HTTP response.
 * @param err - The associated error object (optional).
 *
 * TODO:(hbergren) Kill this function and put this logic in our errorHandler.
 */
export default function handleHttpError(errorCode: number, msg: string, res: Response, err?: Error): void;
//# sourceMappingURL=handleHttpError.d.ts.map