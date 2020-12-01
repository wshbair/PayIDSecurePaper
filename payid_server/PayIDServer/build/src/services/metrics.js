"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_metrics_1 = require("@payid-org/server-metrics");
const config_1 = require("../config");
const reports_1 = require("../data-access/reports");
const metrics = new server_metrics_1.Metrics(config_1.default.metrics, reports_1.getAddressCounts, reports_1.getPayIdCount);
exports.default = metrics;
//# sourceMappingURL=metrics.js.map