import App from '../../src/app';
/**
 * Boots up the Express application for testing purposes.
 * The first time this is run it will initialize the database connection pool.
 *
 * @returns The Express application.
 */
export declare function appSetup(): Promise<App>;
/**
 * Shuts down the Express application, so there are not running processes when testing ends.
 *
 * @param app - The Express app.
 */
export declare function appCleanup(app: App): void;
export declare function seedDatabase(): Promise<void>;
/**
 * Gets the definition of a database constraint.
 *
 * @param constraintName - The name of the constraint.
 * @param tableName - The name of the table associated with the constraint.
 *
 * @returns The constraint definition from the database.
 */
export declare function getDatabaseConstraintDefinition(constraintName: string, tableName: string): Promise<string>;
//# sourceMappingURL=helpers.d.ts.map