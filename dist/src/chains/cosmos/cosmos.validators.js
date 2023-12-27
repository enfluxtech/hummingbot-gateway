"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCosmosPollRequest = exports.validateCosmosBalanceRequest = exports.validatePublicKey = exports.isValidCosmosAddress = exports.invalidCosmosAddressError = void 0;
const validators_1 = require("../../services/validators");
const encoding_1 = require("@cosmjs/encoding");
exports.invalidCosmosAddressError = 'The spender param is not a valid Cosmos address. (Bech32 format)';
const isValidCosmosAddress = (str) => {
    try {
        (0, encoding_1.normalizeBech32)(str);
        return true;
    }
    catch (e) {
        return false;
    }
};
exports.isValidCosmosAddress = isValidCosmosAddress;
exports.validatePublicKey = (0, validators_1.mkValidator)('address', exports.invalidCosmosAddressError, (val) => typeof val === 'string' && (0, exports.isValidCosmosAddress)(val));
exports.validateCosmosBalanceRequest = (0, validators_1.mkRequestValidator)([exports.validatePublicKey, validators_1.validateTokenSymbols]);
exports.validateCosmosPollRequest = (0, validators_1.mkRequestValidator)([
    validators_1.validateTxHash,
]);
//# sourceMappingURL=cosmos.validators.js.map