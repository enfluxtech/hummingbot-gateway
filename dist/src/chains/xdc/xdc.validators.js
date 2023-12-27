"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateXdcAllowancesRequest = exports.validateXdcApproveRequest = exports.validateSpender = exports.invalidSpenderError = exports.isAddress = void 0;
const validators_1 = require("../../services/validators");
const ethereum_validators_1 = require("../ethereum/ethereum.validators");
const isAddress = (str) => {
    return /^(0x|xdc)[a-fA-F0-9]{40}$/.test(str);
};
exports.isAddress = isAddress;
exports.invalidSpenderError = 'The spender param is invalid xdc address (0x or xdc followed by 40 hexidecimal characters).';
exports.validateSpender = (0, validators_1.mkValidator)('spender', exports.invalidSpenderError, (val) => typeof val === 'string' && (val === 'xsswap' || (0, exports.isAddress)(val)));
exports.validateXdcApproveRequest = (0, validators_1.mkRequestValidator)([
    ethereum_validators_1.validateAddress,
    exports.validateSpender,
    validators_1.validateToken,
    validators_1.validateAmount,
    ethereum_validators_1.validateNonce,
]);
exports.validateXdcAllowancesRequest = (0, validators_1.mkRequestValidator)([ethereum_validators_1.validateAddress, exports.validateSpender, validators_1.validateTokenSymbols]);
//# sourceMappingURL=xdc.validators.js.map