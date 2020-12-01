export declare const payIdServerVersions: readonly string[];
export declare const adminApiVersions: readonly string[];
/**
 * Application configuration.
 *
 * NOTE: The defaults are developer defaults. This configuration is NOT a valid
 * production configuration. Please refer to example.production.env for
 * reference.
 */
declare const config: {
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
        /**
         * Whether or not to report PayID server metrics. Defaults to true.
         * To opt out,  you can set the PUSH_PAYID_METRICS to any value that isn't "true".
         */
        pushMetrics: boolean;
        /**
         * Domain name that operates this PayID server.
         *
         * Used to identify who is pushing the metrics in cases where multiple PayID servers are pushing to a shared metrics server.
         * Required for pushing metrics.
         *
         * This will be dynamically set by incoming requests if the ENV var is unset.
         */
        domain: string;
        /** URL to a Prometheus push gateway, defaulting to the Xpring Prometheus server. */
        gatewayUrl: string;
        /** How frequently (in seconds) to push metrics to the Prometheus push gateway. */
        pushIntervalInSeconds: number;
        /** How frequently (in seconds) to refresh the PayID Count report data from the database. */
        payIdCountRefreshIntervalInSeconds: number;
        payIdProtocolVersion: string;
        serverAgent: string;
    };
};
export default config;
//# sourceMappingURL=config.d.ts.map