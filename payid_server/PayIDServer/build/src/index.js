"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const config_1 = require("./config");
const logger_1 = require("./utils/logger");
function run() {
    if (require.main === module) {
        const app = new app_1.default();
        app.init(config_1.default).catch((err) => {
            logger_1.default.fatal(err);
            process.exit(1);
        });
    }
}
run();
//# sourceMappingURL=index.js.map