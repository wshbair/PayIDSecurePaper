import * as express from 'express';
/**
 * The PayID application. Runs two Express servers on different ports.
 *
 * One server responds to PayID Protocol requests (the public API),
 * while the other server exposes CRUD commands for PayIDs stored in the database (the Admin API).
 */
export default class App {
    readonly publicApiExpress: express.Application;
    readonly adminApiExpress: express.Application;
    private publicApiServer?;
    private adminApiServer?;
    constructor();
    /**
     * Initializes the PayID server by:
     *  - Ensuring the database has all tables/columns necessary
     *  - Boot up the Public API server
     *  - Boot up the Admin API server
     *  - Scheduling various operations around metrics.
     *
     * @param initConfig - The application configuration to initialize the app with.
     *                     Defaults to whatever is in config.ts.
     */
    init(initConfig?: {
        database: {
            connection: {
                host: string;
                port: number;
                user: string;
                password: string;
                database: string;
            };
            options: {
                seedDatabase: boolean;
            };
        };
        app: {
            publicApiPort: number;
            adminApiPort: number;
            payIdVersion: string;
            adminApiVersion: string;
            logLevel: string;
        };
        metrics: {
            pushMetrics: boolean;
            domain: string;
            gatewayUrl: string;
            pushIntervalInSeconds: number;
            payIdCountRefreshIntervalInSeconds: number;
            payIdProtocolVersion: string;
            serverAgent: string;
        };
    }): Promise<void>;
    /**
     * Shuts down the PayID server, and cleans up the recurring metric operations.
     */
    close(): void;
    /**
     * Boots up the public API to respond to PayID Protocol requests.
     *
     * @param appConfig - The application configuration to boot up the Express server with.
     *
     * @returns An HTTP server listening on the public API port.
     */
    private launchPublicApi;
    /**
     * Boots up the Admin API to respond to CRUD commands hitting REST endpoints.
     *
     * @param appConfig - The application configuration to boot up the Express server with.
     *
     * @returns An HTTP server listening on the Admin API port.
     */
    private launchAdminApi;
}
//# sourceMappingURL=app.d.ts.map