"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const metrics_1 = require("../services/metrics");
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
function initializeMetrics(req, _res, next) {
    // Start metrics on the first public API request.
    // This will _always_ happen at initialization unless the PAYID_DOMAIN env var is set.
    if (config_1.default.metrics.domain === 'missing_domain' ||
        !metrics_1.default.areMetricsRunning()) {
        config_1.default.metrics.domain = req.hostname;
        metrics_1.default.scheduleRecurringMetricsPush();
        metrics_1.default.scheduleRecurringMetricsGeneration();
    }
    next();
}
exports.default = initializeMetrics;
//# sourceMappingURL=initializeMetrics.js.map