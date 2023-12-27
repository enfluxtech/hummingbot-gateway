"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateOptInRequest = exports.validateAssetsRequest = exports.validateAssetSymbol = exports.validateAssetSymbols = exports.validateAlgorandBalanceRequest = exports.validateAlgorandPollRequest = void 0;
const validators_1 = require("../../services/validators");
const ethereum_validators_1 = require("../ethereum/ethereum.validators");
const near_validators_1 = require("../near/near.validators");
const invalidTxHashError = 'The txHash param must be a string.';
const validateTxHash = (0, validators_1.mkValidator)('txHash', invalidTxHashError, (val) => typeof val === 'string');
const validateAlgorandChain = (0, validators_1.mkValidator)('chain', near_validators_1.invalidChainError, (val) => typeof val === 'string' && val === 'algorand');
const validateAlgorandAddress = (0, validators_1.mkValidator)('address', ethereum_validators_1.invalidAddressError, (val) => typeof val === 'string' && /[A-Z0-9]{58}/.test(val));
exports.validateAlgorandPollRequest = (0, validators_1.mkRequestValidator)([ethereum_validators_1.validateNetwork, validateTxHash]);
exports.validateAlgorandBalanceRequest = (0, validators_1.mkRequestValidator)([
    validateAlgorandChain,
    ethereum_validators_1.validateNetwork,
    validateAlgorandAddress,
    validators_1.validateTokenSymbols,
]);
const validateAssetSymbols = (req) => {
    const errors = [];
    if (req.assetSymbols) {
        if (Array.isArray(req.assetSymbols)) {
            req.tokenSymbols.forEach((symbol) => {
                if (typeof symbol !== 'string') {
                    errors.push(validators_1.invalidTokenSymbolsError);
                }
            });
        }
        else if (typeof req.assetSymbols !== 'string') {
            errors.push(validators_1.invalidTokenSymbolsError);
        }
    }
    return errors;
};
exports.validateAssetSymbols = validateAssetSymbols;
exports.validateAssetSymbol = (0, validators_1.mkValidator)('assetSymbol', validators_1.invalidTokenSymbolsError, (val) => typeof val === 'string');
exports.validateAssetsRequest = (0, validators_1.mkRequestValidator)([
    ethereum_validators_1.validateNetwork,
    exports.validateAssetSymbols,
]);
exports.validateOptInRequest = (0, validators_1.mkRequestValidator)([
    ethereum_validators_1.validateNetwork,
    validateAlgorandAddress,
    exports.validateAssetSymbol,
]);
//# sourceMappingURL=algorand.validators.js.map