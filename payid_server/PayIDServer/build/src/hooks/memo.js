"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This function is expected to be overwritten by companies deploying
 * PayID servers. It is expected that this function would query other
 * internal systems to attach metadata to a transaction.
 *
 * @param _paymentInformation - A PaymentInformation object to potentially be used in generating the memo.
 * @returns A string to be attached as memo.
 */
function createMemo(_paymentInformation) {
    return '';
}
exports.default = createMemo;
//# sourceMappingURL=memo.js.map