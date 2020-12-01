import { Request, Response, NextFunction } from 'express';
export declare function getStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getConnections(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function pullUserCredential(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function createDiD(): Promise<unknown>;
//# sourceMappingURL=agents.d.ts.map