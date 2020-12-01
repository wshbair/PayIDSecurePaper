"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SIGNATURE = exports.XRPL_MAINNET_ADDRESS = exports.XRPL_TESTNET_ADDRESS = exports.XRPL_MAINNET_ACCEPT_HEADER = exports.XRPL_TESTNET_ACCEPT_HEADER = void 0;
const protocol_1 = require("../../../../src/types/protocol");
exports.XRPL_TESTNET_ACCEPT_HEADER = 'application/xrpl-testnet+json';
exports.XRPL_MAINNET_ACCEPT_HEADER = 'application/xrpl-mainnet+json';
exports.XRPL_TESTNET_ADDRESS = {
    paymentNetwork: 'XRPL',
    environment: 'TESTNET',
    addressDetailsType: protocol_1.AddressDetailsType.CryptoAddress,
    addressDetails: {
        address: 'rDk7FQvkQxQQNGTtfM2Fr66s7Nm3k87vdS',
    },
};
exports.XRPL_MAINNET_ADDRESS = {
    paymentNetwork: 'XRPL',
    environment: 'MAINNET',
    addressDetailsType: protocol_1.AddressDetailsType.CryptoAddress,
    addressDetails: {
        address: 'rw2ciyaNshpHe7bCHo4bRWq6pqqynnWKQg',
        tag: '67298042',
    },
};
exports.SIGNATURE = {
    name: 'identityKey',
    protected: 'aGV0IG1lIHNlZSB0aGVtIGNvcmdpcyBOT1cgb3IgcGF5IHRoZSBwcmljZQ==',
    signature: 'TG9vayBhdCBtZSEgd29vIEknbSB0ZXN0aW5nIHRoaW5ncyBhbmQgdGhpcyBpcyBhIHNpZ25hdHVyZQ==',
};
//# sourceMappingURL=payloads.js.map