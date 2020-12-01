"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const basePayId_1 = require("../../src/services/basePayId");
const protocol_1 = require("../../src/types/protocol");
const version1dot1 = '1.1';
describe('Base PayID - formatPaymentInfo()', function () {
    it('Returns CryptoAddressDetails & FiatAddressDetails for addressDetailsTypes when formatting array with multiple AddressInformation', function () {
        // GIVEN an array of AddressInformation with an ACH entry
        const payId = 'alice$example.com';
        const addressInfo = [
            {
                paymentNetwork: 'XRP',
                environment: 'TESTNET',
                details: {
                    address: 'rDk7FQvkQxQQNGTtfM2Fr66s7Nm3k87vdS',
                },
            },
            {
                paymentNetwork: 'ACH',
                environment: null,
                details: {
                    accountNumber: '000123456789',
                    routingNumber: '123456789',
                },
            },
        ];
        const expectedPaymentInfo = {
            addresses: [
                {
                    paymentNetwork: 'XRP',
                    environment: 'TESTNET',
                    addressDetailsType: protocol_1.AddressDetailsType.CryptoAddress,
                    addressDetails: {
                        address: 'rDk7FQvkQxQQNGTtfM2Fr66s7Nm3k87vdS',
                    },
                },
                {
                    paymentNetwork: 'ACH',
                    addressDetailsType: protocol_1.AddressDetailsType.FiatAddress,
                    addressDetails: {
                        accountNumber: '000123456789',
                        routingNumber: '123456789',
                    },
                },
            ],
            verifiedAddresses: [],
            payId: 'alice$example.com',
        };
        // WHEN we format it
        const paymentInfo = basePayId_1.formatPaymentInfo(addressInfo, [], '', version1dot1, payId);
        // THEN we get back a PaymentInformation object with the appropriate address details
        chai_1.assert.deepStrictEqual(paymentInfo, expectedPaymentInfo);
    });
    it('Does not return a environment field when it is not included in the address information', function () {
        // GIVEN an array of AddressInformation with an ACH entry (no environment)
        const payId = 'alice$example.com';
        const addressInfo = [
            {
                paymentNetwork: 'ACH',
                environment: null,
                details: {
                    accountNumber: '000123456789',
                    routingNumber: '123456789',
                },
            },
        ];
        const expectedPaymentInfo = {
            addresses: [
                {
                    paymentNetwork: 'ACH',
                    addressDetailsType: protocol_1.AddressDetailsType.FiatAddress,
                    addressDetails: {
                        accountNumber: '000123456789',
                        routingNumber: '123456789',
                    },
                },
            ],
            verifiedAddresses: [],
            payId,
        };
        // WHEN we format it
        const paymentInfo = basePayId_1.formatPaymentInfo(addressInfo, [], '', version1dot1, payId);
        // THEN we get back a PaymentInformation object with no environment
        chai_1.assert.deepStrictEqual(paymentInfo, expectedPaymentInfo);
    });
    it('Returns a memo field when using a memo function that returns a truthy string', function () {
        // GIVEN an array of AddressInformation with an XRP entry
        const payId = 'alice$example.com';
        const addressInfo = [
            {
                paymentNetwork: 'XRP',
                environment: 'TESTNET',
                details: {
                    address: 'rDk7FQvkQxQQNGTtfM2Fr66s7Nm3k87vdS',
                },
            },
        ];
        const expectedPaymentInfo = {
            addresses: [
                {
                    paymentNetwork: 'XRP',
                    environment: 'TESTNET',
                    addressDetailsType: protocol_1.AddressDetailsType.CryptoAddress,
                    addressDetails: {
                        address: 'rDk7FQvkQxQQNGTtfM2Fr66s7Nm3k87vdS',
                    },
                },
            ],
            verifiedAddresses: [],
            payId: 'alice$example.com',
            memo: 'memo',
        };
        // AND GIVEN a createMemo() that returns a truthy value
        const memoFn = () => 'memo';
        // WHEN we format the address information
        const paymentInfo = basePayId_1.formatPaymentInfo(addressInfo, [], '', version1dot1, payId, memoFn);
        // THEN we get back a PaymentInformation object with a memo
        chai_1.assert.deepStrictEqual(paymentInfo, expectedPaymentInfo);
    });
});
//# sourceMappingURL=formatPaymentInfoBasePayId.test.js.map