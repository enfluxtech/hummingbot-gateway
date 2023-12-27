"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTezosApproveRequest = exports.validateTezosAllowancesRequest = exports.validateTezosTokenRequest = exports.validateTezosBalanceRequest = exports.validateTezosPollRequest = exports.validateTezosNonceRequest = exports.validateTezosTokenSymbols = exports.validateTezosNetwork = exports.validateTezosChain = exports.validateTezosTxHash = exports.validateTezosNonce = exports.validateTezosSpender = exports.validateTezosAddress = exports.isTxHash = exports.isAddress = exports.invalidNetworkError = exports.invalidChainError = exports.invalidMaxPriorityFeePerGasError = exports.invalidMaxFeePerGasError = exports.invalidTxHashError = exports.invalidNonceError = exports.invalidSpenderError = exports.invalidAddressError = void 0;
const utils_1 = require("@taquito/utils");
const validators_1 = require("../../services/validators");
exports.invalidAddressError = 'The address param is not a valid Tezos address.';
exports.invalidSpenderError = 'The spender param is not a valid Tezos address or connector name.';
exports.invalidNonceError = 'If nonce is included it must be a non-negative integer.';
exports.invalidTxHashError = 'The txHash param is not a valid Tezos transaction hash.';
exports.invalidMaxFeePerGasError = 'If maxFeePerGas is included it must be a string of a non-negative integer.';
exports.invalidMaxPriorityFeePerGasError = 'If maxPriorityFeePerGas is included it must be a string of a non-negative integer.';
exports.invalidChainError = 'The chain param is not a string.';
exports.invalidNetworkError = 'The network param is not a string.';
const isAddress = (str) => {
    return (0, utils_1.validateAddress)(str) === utils_1.ValidationResult.VALID;
};
exports.isAddress = isAddress;
const isTxHash = (str) => {
    return (0, utils_1.validateOperation)(str) === utils_1.ValidationResult.VALID;
};
exports.isTxHash = isTxHash;
exports.validateTezosAddress = (0, validators_1.mkValidator)('address', exports.invalidAddressError, (val) => typeof val === 'string' && (0, exports.isAddress)(val));
exports.validateTezosSpender = (0, validators_1.mkValidator)('spender', exports.invalidSpenderError, (val) => typeof val === 'string' &&
    (val === 'plenty' ||
        (0, exports.isAddress)(val)));
exports.validateTezosNonce = (0, validators_1.mkValidator)('nonce', exports.invalidNonceError, (val) => typeof val === 'undefined' ||
    (typeof val === 'number' && val >= 0 && Number.isInteger(val)), true);
exports.validateTezosTxHash = (0, validators_1.mkValidator)('txHash', exports.invalidTxHashError, (val) => typeof val === 'string' && (0, exports.isTxHash)(val));
exports.validateTezosChain = (0, validators_1.mkValidator)('chain', exports.invalidChainError, (val) => typeof val === 'string');
exports.validateTezosNetwork = (0, validators_1.mkValidator)('network', exports.invalidNetworkError, (val) => typeof val === 'string');
const validateTezosTokenSymbols = (req) => {
    const errors = [];
    if (req.tokenSymbols) {
        if (Array.isArray(req.tokenSymbols)) {
            req.tokenSymbols.forEach((symbol) => {
                if (typeof symbol !== 'string') {
                    errors.push(validators_1.invalidTokenSymbolsError);
                }
            });
        }
        else {
            errors.push(validators_1.invalidTokenSymbolsError);
        }
    }
    return errors;
};
exports.validateTezosTokenSymbols = validateTezosTokenSymbols;
exports.validateTezosNonceRequest = (0, validators_1.mkRequestValidator)([
    exports.validateTezosAddress,
]);
exports.validateTezosPollRequest = (0, validators_1.mkRequestValidator)([
    exports.validateTezosTxHash,
    exports.validateTezosNetwork,
    exports.validateTezosChain,
]);
exports.validateTezosBalanceRequest = (0, validators_1.mkRequestValidator)([
    exports.validateTezosAddress,
    validators_1.validateTokenSymbols,
]);
exports.validateTezosTokenRequest = (0, validators_1.mkRequestValidator)([
    exports.validateTezosChain,
    exports.validateTezosTokenSymbols,
    exports.validateTezosNetwork
]);
exports.validateTezosAllowancesRequest = (0, validators_1.mkRequestValidator)([
    exports.validateTezosAddress,
    exports.validateTezosSpender,
    validators_1.validateTokenSymbols,
]);
exports.validateTezosApproveRequest = (0, validators_1.mkRequestValidator)([
    exports.validateTezosAddress,
    exports.validateTezosSpender,
    validators_1.validateToken,
    validators_1.validateAmount,
    exports.validateTezosNonce,
]);
//# sourceMappingURL=tezos.validators.js.map