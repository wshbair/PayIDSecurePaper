"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const http_status_1 = require("@xpring-eng/http-status");
const chai_1 = require("chai");
const request = require("supertest");
const protocol_1 = require("../../../../src/types/protocol");
const helpers_1 = require("../../../helpers/helpers");
let app;
describe('E2E - publicAPIRouter - Verifiable PayID', function () {
    // Boot up Express application and initialize DB connection pool
    before(async function () {
        app = await helpers_1.appSetup();
    });
    it('Returns the correct MAINNET address for a known PayID', function (done) {
        // GIVEN a PayID known to have an associated xrpl-mainnet address
        const payId = '/johnwick';
        const acceptHeader = 'application/xrpl-mainnet+json';
        const expectedResponse = {
            addresses: [],
            payId: 'johnwick$127.0.0.1',
            verifiedAddresses: [
                {
                    payload: JSON.stringify({
                        payId: 'johnwick$127.0.0.1',
                        payIdAddress: {
                            paymentNetwork: 'XRPL',
                            environment: 'MAINNET',
                            addressDetailsType: protocol_1.AddressDetailsType.CryptoAddress,
                            addressDetails: {
                                address: 'rDk7FQvkQxQQNGTtfM2Fr66s7Nm3k87vdS',
                            },
                        },
                    }),
                    signatures: [
                        {
                            name: 'identityKey',
                            protected: 'aGV0IG1lIHNlZSB0aGVtIGNvcmdpcyBOT1cgb3IgcGF5IHRoZSBwcmljZQ==',
                            signature: 'TG9vayBhdCBtZSEgd29vIEknbSB0ZXN0aW5nIHRoaW5ncyBhbmQgdGhpcyBpcyBhIHNpZ25hdHVyZQ==',
                        },
                    ],
                },
            ],
        };
        // WHEN we make a GET request to the public endpoint to retrieve payment info with an Accept header specifying xrpl-mainnet
        request(app.publicApiExpress)
            .get(payId)
            .set('PayID-Version', '1.1')
            .set('Accept', acceptHeader)
            // THEN we get back our Accept header as the Content-Type
            .expect((res) => {
            chai_1.assert.strictEqual(res.get('Content-Type').split('; ')[0], acceptHeader);
        })
            // AND we get back the XRP address associated with that PayID for xrpl-mainnet.
            .expect(http_status_1.default.OK, expectedResponse, done);
    });
    it('Returns the correct TESTNET address for a known PayID', function (done) {
        // GIVEN a PayID known to have an associated xrpl-testnet address
        const payId = '/johnwick';
        const acceptHeader = 'application/xrpl-testnet+json';
        const expectedResponse = {
            addresses: [],
            payId: 'johnwick$127.0.0.1',
            verifiedAddresses: [
                {
                    payload: JSON.stringify({
                        payId: 'johnwick$127.0.0.1',
                        payIdAddress: {
                            paymentNetwork: 'XRPL',
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
                            protected: 'aGV0IG1lIHNlZSB0aGVtIGNvcmdpcyBOT1cgb3IgcGF5IHRoZSBwcmljZQ==',
                            signature: 'TG9vayBhdCBtZSEgd29vIEknbSB0ZXN0aW5nIHRoaW5ncyBhbmQgdGhpcyBpcyBhIHNpZ25hdHVyZQ==',
                        },
                    ],
                },
            ],
        };
        // WHEN we make a GET request to the public endpoint to retrieve payment info with an Accept header specifying xrpl-testnet
        request(app.publicApiExpress)
            .get(payId)
            .set('PayID-Version', '1.1')
            .set('Accept', acceptHeader)
            // THEN we get back our Accept header as the Content-Type
            .expect((res) => {
            chai_1.assert.strictEqual(res.get('Content-Type').split('; ')[0], acceptHeader);
        })
            // AND we get back the XRP address associated with that PayID for xrpl-testnet.
            .expect(http_status_1.default.OK, expectedResponse, done);
    });
    it('Returns the correct address for a known PayID and a non-XRPL header', function (done) {
        // GIVEN a PayID known to have an associated btc-testnet address
        const payId = '/johnwick';
        const acceptHeader = 'application/btc-testnet+json';
        const expectedResponse = {
            addresses: [],
            payId: 'johnwick$127.0.0.1',
            verifiedAddresses: [
                {
                    payload: JSON.stringify({
                        payId: 'johnwick$127.0.0.1',
                        payIdAddress: {
                            paymentNetwork: 'BTC',
                            environment: 'TESTNET',
                            addressDetailsType: protocol_1.AddressDetailsType.CryptoAddress,
                            addressDetails: {
                                address: '2NGZrVvZG92qGYqzTLjCAewvPZ7JE8S8VxE',
                            },
                        },
                    }),
                    signatures: [
                        {
                            name: 'identityKey',
                            protected: 'aGV0IG1lIHNlZSB0aGVtIGNvcmdpcyBOT1cgb3IgcGF5IHRoZSBwcmljZQ==',
                            signature: 'TG9vayBhdCBtZSEgd29vIEknbSB0ZXN0aW5nIHRoaW5ncyBhbmQgdGhpcyBpcyBhIHNpZ25hdHVyZQ==',
                        },
                    ],
                },
            ],
        };
        // WHEN we make a GET request to the public endpoint to retrieve payment info with an Accept header specifying btc-testnet
        request(app.publicApiExpress)
            .get(payId)
            .set('PayID-Version', '1.1')
            .set('Accept', acceptHeader)
            // THEN we get back our Accept header as the Content-Type
            .expect((res) => {
            chai_1.assert.strictEqual(res.get('Content-Type').split('; ')[0], acceptHeader);
        })
            // AND we get back the BTC address associated with that PayID for btc-testnet.
            .expect(http_status_1.default.OK, expectedResponse, done);
    });
    it('Returns the correct address for a known PayID and an ACH header (no environment)', function (done) {
        // GIVEN a PayID known to have an associated ACH address
        const payId = '/johnwick';
        const acceptHeader = 'application/ach+json';
        const expectedResponse = {
            addresses: [],
            payId: 'johnwick$127.0.0.1',
            verifiedAddresses: [
                {
                    payload: JSON.stringify({
                        payId: 'johnwick$127.0.0.1',
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
                            protected: 'aGV0IG1lIHNlZSB0aGVtIGNvcmdpcyBOT1cgb3IgcGF5IHRoZSBwcmljZQ==',
                            signature: 'TG9vayBhdCBtZSEgd29vIEknbSB0ZXN0aW5nIHRoaW5ncyBhbmQgdGhpcyBpcyBhIHNpZ25hdHVyZQ==',
                        },
                    ],
                },
            ],
        };
        // WHEN we make a GET request to the public endpoint to retrieve payment info with an Accept header specifying ACH
        request(app.publicApiExpress)
            .get(payId)
            .set('PayID-Version', '1.1')
            .set('Accept', acceptHeader)
            // THEN we get back our Accept header as the Content-Type
            .expect((res) => {
            chai_1.assert.strictEqual(res.get('Content-Type').split('; ')[0], acceptHeader);
        })
            // AND we get back the ACH account information associated with that PayID for ACH.
            .expect(http_status_1.default.OK, expectedResponse, done);
    });
    it('Returns all unverified & verified addresses for a known PayID and an all addresses header', function (done) {
        // GIVEN a PayID known to have an associated btc-testnet address
        const payId = '/johnwick';
        const acceptHeader = 'application/payid+json';
        const expectedResponse = {
            addresses: [
                {
                    paymentNetwork: 'BTC',
                    environment: 'MAINNET',
                    addressDetailsType: protocol_1.AddressDetailsType.CryptoAddress,
                    addressDetails: {
                        address: '2NGZrVvZG92qGYqzTLjCAewvPZ7JE8S8VxE',
                    },
                },
            ],
            payId: 'johnwick$127.0.0.1',
            verifiedAddresses: [
                {
                    payload: JSON.stringify({
                        payId: 'johnwick$127.0.0.1',
                        payIdAddress: {
                            paymentNetwork: 'BTC',
                            environment: 'TESTNET',
                            addressDetailsType: protocol_1.AddressDetailsType.CryptoAddress,
                            addressDetails: {
                                address: '2NGZrVvZG92qGYqzTLjCAewvPZ7JE8S8VxE',
                            },
                        },
                    }),
                    signatures: [
                        {
                            name: 'identityKey',
                            protected: 'aGV0IG1lIHNlZSB0aGVtIGNvcmdpcyBOT1cgb3IgcGF5IHRoZSBwcmljZQ==',
                            signature: 'TG9vayBhdCBtZSEgd29vIEknbSB0ZXN0aW5nIHRoaW5ncyBhbmQgdGhpcyBpcyBhIHNpZ25hdHVyZQ==',
                        },
                    ],
                },
                {
                    payload: JSON.stringify({
                        payId: 'johnwick$127.0.0.1',
                        payIdAddress: {
                            paymentNetwork: 'XRPL',
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
                            protected: 'aGV0IG1lIHNlZSB0aGVtIGNvcmdpcyBOT1cgb3IgcGF5IHRoZSBwcmljZQ==',
                            signature: 'TG9vayBhdCBtZSEgd29vIEknbSB0ZXN0aW5nIHRoaW5ncyBhbmQgdGhpcyBpcyBhIHNpZ25hdHVyZQ==',
                        },
                    ],
                },
                {
                    payload: JSON.stringify({
                        payId: 'johnwick$127.0.0.1',
                        payIdAddress: {
                            paymentNetwork: 'XRPL',
                            environment: 'MAINNET',
                            addressDetailsType: protocol_1.AddressDetailsType.CryptoAddress,
                            addressDetails: {
                                address: 'rDk7FQvkQxQQNGTtfM2Fr66s7Nm3k87vdS',
                            },
                        },
                    }),
                    signatures: [
                        {
                            name: 'identityKey',
                            protected: 'aGV0IG1lIHNlZSB0aGVtIGNvcmdpcyBOT1cgb3IgcGF5IHRoZSBwcmljZQ==',
                            signature: 'TG9vayBhdCBtZSEgd29vIEknbSB0ZXN0aW5nIHRoaW5ncyBhbmQgdGhpcyBpcyBhIHNpZ25hdHVyZQ==',
                        },
                    ],
                },
                {
                    payload: JSON.stringify({
                        payId: 'johnwick$127.0.0.1',
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
                            protected: 'aGV0IG1lIHNlZSB0aGVtIGNvcmdpcyBOT1cgb3IgcGF5IHRoZSBwcmljZQ==',
                            signature: 'TG9vayBhdCBtZSEgd29vIEknbSB0ZXN0aW5nIHRoaW5ncyBhbmQgdGhpcyBpcyBhIHNpZ25hdHVyZQ==',
                        },
                    ],
                },
            ],
        };
        // WHEN we make a GET request to the public endpoint to retrieve payment info with an Accept header specifying btc-testnet
        request(app.publicApiExpress)
            .get(payId)
            .set('PayID-Version', '1.1')
            .set('Accept', acceptHeader)
            // THEN we get back our Accept header as the Content-Type
            .expect((res) => {
            chai_1.assert.strictEqual(res.get('Content-Type').split('; ')[0], acceptHeader);
        })
            // AND we get back the BTC address associated with that PayID for btc-testnet.
            .expect(http_status_1.default.OK, expectedResponse, done);
    });
    it('Returns a 404 for a PayID without the relevant associated address', function (done) {
        // GIVEN a known PayID that exists but does not have an associated devnet XRP address
        const payId = '/johnwick';
        const acceptHeader = 'application/xrpl-devnet+json';
        const expectedErrorResponse = {
            statusCode: 404,
            error: 'Not Found',
            message: 'Payment information for johnwick$127.0.0.1 could not be found.',
        };
        // WHEN we make a GET request to the public endpoint to retrieve payment info with an Accept header specifying xrpl-devnet
        request(app.publicApiExpress)
            .get(payId)
            .set('PayID-Version', '1.1')
            .set('Accept', acceptHeader)
            .expect('Content-Type', /application\/json/u)
            // THEN we get back a 404 with the expected error response.
            .expect(http_status_1.default.NotFound, expectedErrorResponse, done);
    });
    // Shut down Express application and close DB connections
    after(function () {
        helpers_1.appCleanup(app);
    });
});
//# sourceMappingURL=verifiablePayId.test.js.map