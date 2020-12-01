/**
 * Gets the full URL from request components. To be used to create the PayID.
 *
 * @param protocol - The URL protocol (http(s)).
 * @param hostname - Used to create the host in the PayID (user$host).
 * @param path - Used to create the "user" in the PayID (user$host).
 * @param port - Used in the PayID if included (optional).
 *
 * @returns A constructed URL.
 */
export declare function constructUrl(protocol: string, hostname: string, path: string, port?: string): string;
/**
 * Converts a PayID from `https://...` URL representation to `user$...` representation.
 *
 * @param url - The url string to convert to a PayId.
 *
 * @returns A PayID in the $ format.
 */
export declare function urlToPayId(url: string): string;
//# sourceMappingURL=urls.d.ts.map