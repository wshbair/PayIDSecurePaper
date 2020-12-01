"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable mocha/no-top-level-hooks --
 * This is the file specifically for top-level hooks to run before/after ALL tests.
 */
require("mocha");
const knex_1 = require("../src/db/knex");
const logger_1 = require("../src/utils/logger");
// We can use a before block outside any describe block to execute code before any test runs.
// Here, we disable logging for all tests.
before(function () {
    logger_1.default.level = 'OFF';
});
// Close DB connections after all tests are run
after(async function () {
    await knex_1.default.destroy();
});
//# sourceMappingURL=global.test.js.map