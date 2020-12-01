import { Request, Response, NextFunction } from 'express';
/**
 * An Express middleware that schedules metrics generation.
 *
 * It also looks at the request hostname property to dynamically set
 * the domain to associate the metrics it pushes with (if push metrics are enabled).
 *
 * @param req - An Express request object. We get the hostname off of this for pushing metrics.
 * @param _res - An Express response object (unused).
 * @param next - An Express next function.
 */
export default function initializeMetrics(req: Request, _res: Response, next: NextFunction): void;
//# sourceMappingURL=initializeMetrics.d.ts.map