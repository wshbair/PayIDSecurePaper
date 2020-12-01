"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const basePayId_1 = require("../../src/services/basePayId");
describe('Base PayID - getPreferredAddressInfo()', function () {
    let addressInfo;
    let verifiedAddressInfo;
    beforeEach(function () {
        addressInfo = [
            {
                paymentNetwork: 'XRPL',
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
        verifiedAddressInfo = [
            {
                paymentNetwork: 'XRPL',
                environment: 'TESTNET',
                details: {
                    address: 'rDk7FQvkQxQQNGTtfM2Fr66s7Nm3k87vdS',
                },
            },
            {
                paymentNetwork: 'ETH',
                environment: 'KOVAN',
                details: {
                    address: '0x43F14dFF256E8e44b839AE00BE8E0e02fA7D18Db',
                },
            },
        ];
    });
    it('Returns all addresses & payid media type if payment network is PAYID', function () {
        // GIVEN an array of addresses and array of AcceptMediaTypes
        const acceptMediaTypes = [
            {
                mediaType: 'application/payid+json',
                paymentNetwork: 'PAYID',
            },
        ];
        const expectedAddressInfo = [
            {
                mediaType: 'application/payid+json',
                paymentNetwork: 'PAYID',
            },
            addressInfo,
            verifiedAddressInfo,
        ];
        // WHEN we try get get the preferred addresses for PAYID payment network
        const preferredAddressInfo = basePayId_1.getPreferredAddressHeaderPair(addressInfo, verifiedAddressInfo, acceptMediaTypes);
        // THEN we return all the addresses we have
        chai_1.assert.deepStrictEqual(preferredAddressInfo, expectedAddressInfo);
    });
    it('Returns the first order preferred address when found', function () {
        // GIVEN an array of addresses and array of AcceptMediaTypes
        const acceptMediaTypes = [
            {
                mediaType: 'application/xrpl-testnet+json',
                environment: 'TESTNET',
                paymentNetwork: 'XRPL',
            },
        ];
        const expectedAddressInfo = [
            {
                mediaType: 'application/xrpl-testnet+json',
                environment: 'TESTNET',
                paymentNetwork: 'XRPL',
            },
            [addressInfo[0]],
            [verifiedAddressInfo[0]],
        ];
        // WHEN we try get get the preferred addresses for XRP payment network
        const preferredAddressInfo = basePayId_1.getPreferredAddressHeaderPair(addressInfo, verifiedAddressInfo, acceptMediaTypes);
        // THEN we get back the XRP addresses
        chai_1.assert.deepStrictEqual(preferredAddressInfo, expectedAddressInfo);
    });
    it('Returns the second order preferred address (unverified) when the first is not found', function () {
        // GIVEN an array of addresses and array of AcceptMediaTypes
        const acceptMediaTypes = [
            {
                mediaType: 'application/xrpl-mainnet+json',
                environment: 'MAINNET',
                paymentNetwork: 'XRPL',
            },
            {
                mediaType: 'application/ach+json',
                paymentNetwork: 'ACH',
            },
        ];
        const expectedAddressInfo = [
            {
                mediaType: 'application/ach+json',
                paymentNetwork: 'ACH',
            },
            [addressInfo[1]],
            [],
        ];
        // WHEN we try get get the preferred addresses for XRP, ACH payment network
        const preferredAddressInfo = basePayId_1.getPreferredAddressHeaderPair(addressInfo, verifiedAddressInfo, acceptMediaTypes);
        // THEN we get back the ACH addresses (because XRP was not found)
        chai_1.assert.deepStrictEqual(preferredAddressInfo, expectedAddressInfo);
    });
    it('Returns the second order preferred address (verified) when the first is not found', function () {
        // GIVEN an array of addresses and array of AcceptMediaTypes
        const acceptMediaTypes = [
            {
                mediaType: 'application/xrpl-mainnet+json',
                environment: 'MAINNET',
                paymentNetwork: 'XRPL',
            },
            {
                mediaType: 'application/eth-kovan+json',
                environment: 'KOVAN',
                paymentNetwork: 'ETH',
            },
        ];
        const expectedAddressInfo = [
            {
                mediaType: 'application/eth-kovan+json',
                environment: 'KOVAN',
                paymentNetwork: 'ETH',
            },
            [],
            [verifiedAddressInfo[1]],
        ];
        // WHEN we try get get the preferred addresses for XRP, ACH payment network
        const preferredAddressInfo = basePayId_1.getPreferredAddressHeaderPair(addressInfo, verifiedAddressInfo, acceptMediaTypes);
        // THEN we get back the ACH addresses (because XRP was not found)
        chai_1.assert.deepStrictEqual(preferredAddressInfo, expectedAddressInfo);
    });
    it('Returns undefined if no preferred address found', function () {
        // GIVEN an array of addresses and array of AcceptMediaTypes
        const acceptMediaTypes = [
            {
                mediaType: 'application/xrpl-mainnet+json',
                environment: 'MAINNET',
                paymentNetwork: 'XRPL',
            },
        ];
        // WHEN we try get get the preferred addresses for XRP network on mainnet
        const preferredAddressInfo = basePayId_1.getPreferredAddressHeaderPair(addressInfo, verifiedAddressInfo, acceptMediaTypes);
        // THEN we get back undefined, because XRP network on mainnet was not found
        chai_1.assert.deepStrictEqual(preferredAddressInfo, [undefined, [], []]);
    });
});
//# sourceMappingURL=getPreferredAddressInfo.test.js.map