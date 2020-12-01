"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const basePayId_1 = require("../../src/services/basePayId");
const protocol_1 = require("../../src/types/protocol");
const version1dot0 = '1.0';
const version1dot1 = '1.1';
describe('Base PayID - getAddressDetailsType()', function () {
    it('Returns FiatAddressDetails for addressDetailsType when formatting ACH AddressInformation', function () {
        // GIVEN an array of AddressInformation with a single ACH (empty environment) entry
        const addressInfo = {
            paymentNetwork: 'ACH',
            environment: null,
            details: {
                accountNumber: '000123456789',
                routingNumber: '123456789',
            },
        };
        // WHEN we get the address details type
        const addressDetailsType = basePayId_1.getAddressDetailsType(addressInfo, version1dot1);
        // THEN we get back an AddressDetailsType of FiatAddress
        chai_1.assert.deepStrictEqual(addressDetailsType, protocol_1.AddressDetailsType.FiatAddress);
    });
    it('If using version 1.0, returns AchAddressDetails for addressDetailsType when formatting ACH AddressInformation', function () {
        // GIVEN an array of AddressInformation with a single ACH (empty environment) entry
        const addressInfo = {
            paymentNetwork: 'ACH',
            environment: null,
            details: {
                accountNumber: '000123456789',
                routingNumber: '123456789',
            },
        };
        // WHEN we get the address details type
        const addressDetailsType = basePayId_1.getAddressDetailsType(addressInfo, version1dot0);
        // THEN we get back an AddressDetailsType of FiatAddress
        chai_1.assert.deepStrictEqual(addressDetailsType, protocol_1.AddressDetailsType.AchAddress);
    });
    it('Returns CryptoAddressDetails for addressDetailsType when formatting XRP AddressInformation', function () {
        // GIVEN an array of AddressInformation with a single XRP entry
        const addressInfo = {
            paymentNetwork: 'XRP',
            environment: 'TESTNET',
            details: {
                address: 'rDk7FQvkQxQQNGTtfM2Fr66s7Nm3k87vdS',
            },
        };
        // WHEN we get the address details type
        const addressDetailsType = basePayId_1.getAddressDetailsType(addressInfo, version1dot1);
        // THEN we get back an AddressDetailsType of CryptoAddress
        chai_1.assert.deepStrictEqual(addressDetailsType, protocol_1.AddressDetailsType.CryptoAddress);
    });
});
//# sourceMappingURL=getAddressDetailsType.test.js.map