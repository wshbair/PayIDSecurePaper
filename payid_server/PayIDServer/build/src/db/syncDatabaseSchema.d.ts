import config from '../config';
/**
 * Syncs the database schema with our database.
 * Depending on the config provided, it may seed the database with test values.
 *
 * @param databaseConfig - Contains the database connection configuration, and some options for controlling behavior.
 */
export default function syncDatabaseSchema(databaseConfig: typeof config.database): Promise<void>;
//# sourceMappingURL=syncDatabaseSchema.d.ts.map