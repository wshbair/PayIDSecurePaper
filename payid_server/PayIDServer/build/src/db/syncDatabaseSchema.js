"use strict";
/* eslint-disable no-await-in-loop --
 * We need to await in a loop because we _want_ to block each operation until the previous one completes.
 * Executing the SQL DDL statements and running migrations relies on a specific order of operations.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const pg_1 = require("pg");
const logger_1 = require("../utils/logger");
/**
 * Syncs the database schema with our database.
 * Depending on the config provided, it may seed the database with test values.
 *
 * @param databaseConfig - Contains the database connection configuration, and some options for controlling behavior.
 */
async function syncDatabaseSchema(databaseConfig) {
    // Define the list of directories holding '*.sql' files, in the order we want to execute them
    const sqlDirectories = [
        'extensions',
        'schema',
        'functions',
        'triggers',
        'migrations',
    ];
    // Run the seed script if we are seeding our database
    if (databaseConfig.options.seedDatabase) {
        sqlDirectories.push('seed');
    }
    // Loop through directories holding SQL files and execute them against the database
    for (const directory of sqlDirectories) {
        const files = await fs.promises.readdir(path.join(__dirname, directory));
        // Note that this loops through the files in alphabetical order
        for (const file of files) {
            await executeSqlFile(path.join(__dirname, directory, file), databaseConfig);
        }
    }
}
exports.default = syncDatabaseSchema;
/**
 * Run the SQL file containing DDL or DML on the database.
 *
 * @param file - A SQL file that we would like to execute against our database.
 * @param databaseConfig - A database config object that holds connection information.
 */
async function executeSqlFile(file, databaseConfig) {
    const sql = await fs.promises.readFile(file, 'utf8');
    const client = new pg_1.Client(databaseConfig.connection);
    try {
        // Connect to the database
        await client.connect();
        // Execute SQL query
        logger_1.default.debug(`Executing query:\n${sql}`);
        await client.query(sql);
        // Close the database connection
        await client.end();
    }
    catch (err) {
        logger_1.default.fatal('error running query', file, err.message);
        // If we can't execute our SQL, our app is in an indeterminate state, so kill it.
        process.exit(1);
    }
}
//# sourceMappingURL=syncDatabaseSchema.js.map