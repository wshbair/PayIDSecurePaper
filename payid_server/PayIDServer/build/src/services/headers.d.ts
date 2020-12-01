import { ParsedAcceptHeader } from '../types/headers';
/**
 * Parses a list of accept headers to confirm they adhere to the PayID accept header syntax.
 *
 * @param acceptHeaders - A list of accept headers.
 *
 * @returns A parsed list of accept headers.
 *
 * @throws A custom ParseError when the Accept Header is missing.
 */
export declare function parseAcceptHeaders(acceptHeaders: string[]): readonly ParsedAcceptHeader[];
/**
 * Parses an accept header for valid syntax.
 *
 * @param acceptHeader - A string representation of an accept header to validate.
 *
 * @returns A parsed accept header.
 *
 * @throws A custom ParseError when the Accept Header is invalid.
 */
export declare function parseAcceptHeader(acceptHeader: string): ParsedAcceptHeader;
//# sourceMappingURL=headers.d.ts.map