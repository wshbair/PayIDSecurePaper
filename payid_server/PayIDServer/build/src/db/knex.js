"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const knexInit = require("knex");
const knexStringcase = require("knex-stringcase");
const config_1 = require("../config");
const errors_1 = require("../utils/errors");
const knexConfig = {
    client: 'pg',
    connection: config_1.default.database.connection,
    pool: {
        /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types --
         * Knex doesn't have great types for the afterCreate parameters
         */
        /**
         * A function automatically called by Knex after we initialize our database connection pool.
         * Ensures the database timezone is set to UTC and queries only timeout after 3 seconds.
         *
         * @param conn - A Knex database connection.
         * @param done - A callback to handle the asynchronous nature of database queries.
         */
        afterCreate(conn, done) {
            conn.query('SET timezone="UTC";', async (err) => {
                if (err) {
                    return done(err, conn);
                }
                conn.query('SET statement_timeout TO 3000;', async (error) => {
                    // if err is not falsy, connection is discarded from pool
                    done(error, conn);
                });
                return undefined;
            });
        },
    },
};
// Convert between camelCase in the Node app to snake_case in the DB
const knex = knexInit(knexStringcase(knexConfig));
// Handle all database errors by listening on the callback
knex.on('query-error', (error) => {
    errors_1.handleDatabaseError(error);
});
exports.default = knex;
//# sourceMappingURL=knex.js.map