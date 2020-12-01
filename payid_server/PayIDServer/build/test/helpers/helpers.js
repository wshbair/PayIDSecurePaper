"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseConstraintDefinition = exports.seedDatabase = exports.appCleanup = exports.appSetup = void 0;
const v8 = require("v8");
const app_1 = require("../../src/app");
const config_1 = require("../../src/config");
const knex_1 = require("../../src/db/knex");
const syncDatabaseSchema_1 = require("../../src/db/syncDatabaseSchema");
/**
 * Deep clones an object *properly*.
 *
 * @param obj - The object to be deep cloned.
 *
 * @returns A deeply cloned object.
 */
function structuredClone(obj) {
    return v8.deserialize(v8.serialize(obj));
}
/**
 * Boots up the Express application for testing purposes.
 * The first time this is run it will initialize the database connection pool.
 *
 * @returns The Express application.
 */
async function appSetup() {
    const app = new app_1.default();
    // Deep cloning the configuration so we don't mutate the global shared configuration
    const testConfig = structuredClone(config_1.default);
    testConfig.database.options.seedDatabase = true;
    await app.init(testConfig);
    return app;
}
exports.appSetup = appSetup;
/**
 * Shuts down the Express application, so there are not running processes when testing ends.
 *
 * @param app - The Express app.
 */
function appCleanup(app) {
    app.close();
}
exports.appCleanup = appCleanup;
async function seedDatabase() {
    // Deep cloning the configuration so we don't mutate the global shared configuration
    const testConfig = structuredClone(config_1.default);
    testConfig.database.options.seedDatabase = true;
    await syncDatabaseSchema_1.default(testConfig.database);
}
exports.seedDatabase = seedDatabase;
/**
 * Gets the definition of a database constraint.
 *
 * @param constraintName - The name of the constraint.
 * @param tableName - The name of the table associated with the constraint.
 *
 * @returns The constraint definition from the database.
 */
async function getDatabaseConstraintDefinition(constraintName, tableName) {
    return knex_1.default
        .raw(`
        -- Select the constraint definition in the relevant table.
        -- We fetch the relevant constraint, get the constraint definition.
        --
        SELECT  pg_get_constraintdef(con.oid) as constraint_def
        FROM    pg_constraint con
                INNER JOIN pg_class rel ON rel.oid = con.conrelid
        WHERE   con.conname = ?
                AND rel.relname = ?;
      `, [constraintName, tableName])
        .then(async (result) => result.rows[0].constraint_def);
}
exports.getDatabaseConstraintDefinition = getDatabaseConstraintDefinition;
//# sourceMappingURL=helpers.js.map