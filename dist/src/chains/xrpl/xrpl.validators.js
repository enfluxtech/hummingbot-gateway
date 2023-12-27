"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateXRPLGetTokenRequest = exports.validateXRPLPollRequest = exports.validateXRPLBalanceRequest = exports.validateXRPLAddress = exports.isXRPLSeedKey = exports.isXRPLAddress = exports.invalidXRPLPrivateKeyError = exports.invalidXRPLAddressError = void 0;
const validators_1 = require("../../services/validators");
exports.invalidXRPLAddressError = 'The spender param is not a valid XRPL address (20 bytes, base 58 encoded).';
exports.invalidXRPLPrivateKeyError = 'The privateKey param is not a valid XRPL seed key (16 bytes, base 58 encoded).';
const isXRPLAddress = (str) => {
    return (0, validators_1.isBase58)(str) && str.length <= 35 && str.charAt(0) == 'r';
};
exports.isXRPLAddress = isXRPLAddress;
const isXRPLSeedKey = (str) => {
    return (0, validators_1.isBase58)(str) && str.charAt(0) == 's';
};
exports.isXRPLSeedKey = isXRPLSeedKey;
exports.validateXRPLAddress = (0, validators_1.mkValidator)('address', exports.invalidXRPLAddressError, (val) => typeof val === 'string' && (0, exports.isXRPLAddress)(val));
exports.validateXRPLBalanceRequest = (0, validators_1.mkRequestValidator)([
    exports.validateXRPLAddress,
]);
exports.validateXRPLPollRequest = (0, validators_1.mkRequestValidator)([
    validators_1.validateTxHash,
]);
exports.validateXRPLGetTokenRequest = (0, validators_1.mkRequestValidator)([validators_1.validateTokenSymbols]);
//# sourceMappingURL=xrpl.validators.js.map