"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_metrics_1 = require("@payid-org/server-metrics");
const express = require("express");
const config_1 = require("./config");
const syncDatabaseSchema_1 = require("./db/syncDatabaseSchema");
const sendSuccess_1 = require("./middlewares/sendSuccess");
const routes_1 = require("./routes");
const metrics_1 = require("./services/metrics");
const logger_1 = require("./utils/logger");
/**
 * The PayID application. Runs two Express servers on different ports.
 *
 * One server responds to PayID Protocol requests (the public API),
 * while the other server exposes CRUD commands for PayIDs stored in the database (the Admin API).
 */
class App {
    constructor() {
        this.publicApiExpress = express();
        this.adminApiExpress = express();
    }
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
    async init(initConfig = config_1.default) {
        // Execute DDL statements not yet defined on the current database
        await syncDatabaseSchema_1.default(initConfig.database);
        this.publicApiServer = this.launchPublicApi(initConfig.app);
        this.adminApiServer = this.launchAdminApi(initConfig.app);
        // Check if our metrics configuration is valid.
        server_metrics_1.checkMetricsConfiguration(initConfig.metrics);
        // Explicitly log that we are pushing metrics if we're pushing metrics.
        if (initConfig.metrics.pushMetrics) {
            logger_1.default.info(`Pushing metrics is enabled.

      Metrics only capture the total number of PayIDs grouped by (paymentNetwork, environment),
      and the (paymentNetwork, environment) tuple of public requests to the PayID server.
      No identifying information is captured.

      If you would like to opt out of pushing metrics, set the environment variable PUSH_PAYID_METRICS to "false".
    `);
        }
    }
    /**
     * Shuts down the PayID server, and cleans up the recurring metric operations.
     */
    close() {
        var _a, _b;
        (_a = this.publicApiServer) === null || _a === void 0 ? void 0 : _a.close();
        (_b = this.adminApiServer) === null || _b === void 0 ? void 0 : _b.close();
        metrics_1.default.stopMetrics();
    }
    /**
     * Boots up the public API to respond to PayID Protocol requests.
     *
     * @param appConfig - The application configuration to boot up the Express server with.
     *
     * @returns An HTTP server listening on the public API port.
     */
    launchPublicApi(appConfig) {
        this.publicApiExpress.use('/', routes_1.publicApiRouter);
        return this.publicApiExpress.listen(appConfig.publicApiPort, () => logger_1.default.info(`Public API listening on ${appConfig.publicApiPort}`));
    }
    /**
     * Boots up the Admin API to respond to CRUD commands hitting REST endpoints.
     *
     * @param appConfig - The application configuration to boot up the Express server with.
     *
     * @returns An HTTP server listening on the Admin API port.
     */
    launchAdminApi(appConfig) {
        this.adminApiExpress.use('/users', routes_1.adminApiRouter);
        this.adminApiExpress.use('/metrics', routes_1.metricsRouter);
        this.adminApiExpress.use('/status/health', sendSuccess_1.default);
        return this.adminApiExpress.listen(appConfig.adminApiPort, () => logger_1.default.info(`Admin API listening on ${appConfig.adminApiPort}`));
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map