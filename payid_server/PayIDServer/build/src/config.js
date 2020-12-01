"use strict";
var _a, _b, _c, _d, _e, _f, _g, _h, _j;
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminApiVersions = exports.payIdServerVersions = void 0;
const package_json_1 = require("../package.json");
exports.payIdServerVersions = ['1.0', '1.1'];
exports.adminApiVersions = ['2020-05-28'];
/**
 * Application configuration.
 *
 * NOTE: The defaults are developer defaults. This configuration is NOT a valid
 * production configuration. Please refer to example.production.env for
 * reference.
 */
const config = {
    database: {
        connection: {
            host: (_a = process.env.DB_HOSTNAME) !== null && _a !== void 0 ? _a : '127.0.0.1',
            port: Number((_b = process.env.DB_PORT) !== null && _b !== void 0 ? _b : 5432),
            user: (_c = process.env.DB_USERNAME) !== null && _c !== void 0 ? _c : 'postgres',
            password: (_d = process.env.DB_PASSWORD) !== null && _d !== void 0 ? _d : 'password',
            database: (_e = process.env.DB_NAME) !== null && _e !== void 0 ? _e : 'database_development',
        },
        options: {
            seedDatabase: process.env.DB_SEED === 'true',
        },
    },
    app: {
        publicApiPort: Number(process.env.PUBLIC_API_PORT) || 8080,
        // TODO: (When we make a breaking Admin API change, cut PRIVATE_API_PORT)
        adminApiPort: Number((_f = process.env.PRIVATE_API_PORT) !== null && _f !== void 0 ? _f : process.env.ADMIN_API_PORT) ||
            8081,
        payIdVersion: exports.payIdServerVersions[exports.payIdServerVersions.length - 1],
        adminApiVersion: exports.adminApiVersions[exports.adminApiVersions.length - 1],
        logLevel: (_g = process.env.LOG_LEVEL) !== null && _g !== void 0 ? _g : 'INFO',
    },
    metrics: {
        /**
         * Whether or not to report PayID server metrics. Defaults to true.
         * To opt out,  you can set the PUSH_PAYID_METRICS to any value that isn't "true".
         */
        pushMetrics: process.env.PUSH_PAYID_METRICS
            ? process.env.PUSH_PAYID_METRICS === 'true'
            : true,
        /**
         * Domain name that operates this PayID server.
         *
         * Used to identify who is pushing the metrics in cases where multiple PayID servers are pushing to a shared metrics server.
         * Required for pushing metrics.
         *
         * This will be dynamically set by incoming requests if the ENV var is unset.
         */
        domain: (_h = process.env.PAYID_DOMAIN) !== null && _h !== void 0 ? _h : 'missing_domain',
        /** URL to a Prometheus push gateway, defaulting to the Xpring Prometheus server. */
        gatewayUrl: (_j = process.env.PUSH_GATEWAY_URL) !== null && _j !== void 0 ? _j : 'https://push00.mon.payid.tech/',
        /** How frequently (in seconds) to push metrics to the Prometheus push gateway. */
        pushIntervalInSeconds: Number(process.env.PUSH_METRICS_INTERVAL) || 15,
        /** How frequently (in seconds) to refresh the PayID Count report data from the database. */
        payIdCountRefreshIntervalInSeconds: Number(process.env.PAYID_COUNT_REFRESH_INTERVAL) || 60,
        payIdProtocolVersion: exports.payIdServerVersions[exports.payIdServerVersions.length - 1],
        serverAgent: `@payid-org/payid:${package_json_1.version}`,
    },
};
exports.default = config;
//# sourceMappingURL=config.js.map