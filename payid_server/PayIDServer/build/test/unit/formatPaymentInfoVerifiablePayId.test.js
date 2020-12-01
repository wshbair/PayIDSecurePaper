"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const basePayId_1 = require("../../src/services/basePayId");
const protocol_1 = require("../../src/types/protocol");
describe('Verifiable PayID - formatPaymentInfo()', function () {
    it('Returns properly formatted array for Verifiable PayID', function () {
        // GIVEN an array of AddressInformation with an ACH entry
        const version1dot1 = '1.1';
        const payId = 'alice$example.com';
        const verifiedAddressInfo = [
            {
                paymentNetwork: 'XRP',
                environment: 'TESTNET',
                details: {
                    address: 'rDk7FQvkQxQQNGTtfM2Fr66s7Nm3k87vdS',
                },
                identityKeySignature: 'xrpSignature',
            },
            {
                paymentNetwork: 'ACH',
                environment: null,
                details: {
                    accountNumber: '000123456789',
                    routingNumber: '123456789',
                },
                identityKeySignature: 'achSignature',
            },
        ];
        const expectedPaymentInfo = {
            addresses: [],
            verifiedAddresses: [
                {
                    payload: JSON.stringify({
                        payId: 'alice$example.com',
                        payIdAddress: {
                            paymentNetwork: 'XRP',
                            environment: 'TESTNET',
                            addressDetailsType: protocol_1.AddressDetailsType.CryptoAddress,
                            addressDetails: {
                                address: 'rDk7FQvkQxQQNGTtfM2Fr66s7Nm3k87vdS',
                            },
                        },
                    }),
                    signatures: [
                        {
                            name: 'identityKey',
                            protected: 'anIdentityKey',
                            signature: 'xrpSignature',
                        },
                    ],
                },
                {
                    payload: JSON.stringify({
                        payId: 'alice$example.com',
                        payIdAddress: {
                            paymentNetwork: 'ACH',
                            addressDetailsType: protocol_1.AddressDetailsType.FiatAddress,
                            addressDetails: {
                                accountNumber: '000123456789',
                                routingNumber: '123456789',
                            },
                        },
                    }),
                    signatures: [
                        {
                            name: 'identityKey',
                            protected: 'anIdentityKey',
                            signature: 'achSignature',
                        },
                    ],
                },
            ],
            payId: 'alice$example.com',
        };
        // WHEN we format it
        const paymentInfo = basePayId_1.formatPaymentInfo([], verifiedAddressInfo, 'anIdentityKey', version1dot1, payId);
        // THEN we get back a PaymentInformation object with the appropriate address details
        chai_1.assert.deepStrictEqual(paymentInfo, expectedPaymentInfo);
    });
});
//# sourceMappingURL=formatPaymentInfoVerifiablePayId.test.js.map