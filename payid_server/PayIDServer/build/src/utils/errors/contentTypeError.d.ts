import PayIDError from './payIdError';
/**
 * A custom error type to organize logic around 415 - Unsupported Media Type errors.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/415|MDN Unsupported Media Type (415)}.
 */
export default class ContentTypeError extends PayIDError {
    readonly kind: string;
    /**
     * The constructor for new ContentTypeError.
     *
     * @param mediaType - The Media Type (also called Content Type) required by the request.
     */
    constructor(mediaType: 'application/json' | 'application/merge-patch+json');
}
//# sourceMappingURL=contentTypeError.d.ts.map