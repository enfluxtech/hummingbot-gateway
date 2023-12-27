"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePerpLastTradePrice = exports.validatePositionsRequest = exports.validateBatchOrdersRequest = exports.validateFundingPaymentsRequest = exports.validateFundingInfoRequest = exports.validatePerpOrderRequest = exports.validatePerpTradesRequest = exports.validateOrderRequest = exports.validatePostPerpOrderRequest = exports.validatePostOrderRequest = exports.validateMarketRequest = exports.validateBasicRequest = exports.validateOrderType = exports.validateOrderId = exports.validateWallet = exports.validatePrice = exports.validateEndTime = exports.validateLimit = exports.validateLeverage = exports.validateSkip = exports.validateMarkets = exports.validateMarket = exports.invalidLeverageError = exports.invalidOrderTypeError = exports.invalidOrderIdError = exports.invalidWalletError = exports.invalidPriceError = exports.invalidEndTimeError = exports.invalidLimitError = exports.invalidSkipError = exports.invalidMarketError = void 0;
const validators_1 = require("../services/validators");
const ethereum_validators_1 = require("../chains/ethereum/ethereum.validators");
const xrpl_validators_1 = require("../chains/xrpl/xrpl.validators");
const amm_validators_1 = require("../amm/amm.validators");
const kujira_helpers_1 = require("../connectors/kujira/kujira.helpers");
exports.invalidMarketError = 'The market param is not a valid market. Market should be in {base}-{quote} format.';
exports.invalidSkipError = 'skip is not valid. It should either be undefined or a non-negative integer.';
exports.invalidLimitError = 'limit is not valid. It should either be undefined or an integer between 0 and 100.';
exports.invalidEndTimeError = 'endTime is not valid. It should either be undefined or a timestamp.';
exports.invalidPriceError = 'The price param may be null or a string of a float or integer number.';
exports.invalidWalletError = 'The address param is not a valid address.';
exports.invalidOrderIdError = 'The OrderId param is not a valid orderId.';
exports.invalidOrderTypeError = 'The orderType specified is invalid. Valid value is either `LIMIT` or `LIMIT_MAKER`';
exports.invalidLeverageError = 'The leverage param must be a number.';
exports.validateMarket = (0, validators_1.mkValidator)('market', exports.invalidMarketError, (val) => typeof val === 'string' && val.split('-').length === 2);
exports.validateMarkets = (0, validators_1.mkValidator)('markets', exports.invalidMarketError, (val) => typeof val === 'object' && val.map((x) => typeof x === 'string'));
exports.validateSkip = (0, validators_1.mkValidator)('skip', exports.invalidSkipError, (val) => typeof val === 'number' && val >= 0, true);
exports.validateLeverage = (0, validators_1.mkValidator)('leverage', exports.invalidLimitError, (val) => typeof val === 'number');
exports.validateLimit = (0, validators_1.mkValidator)('limit', exports.invalidLimitError, (val) => typeof val === 'number' && val >= 0 && val <= 100, true);
exports.validateEndTime = (0, validators_1.mkValidator)('endTime', exports.invalidEndTimeError, (val) => typeof val === 'number' && val >= 0, true);
exports.validatePrice = (0, validators_1.mkValidator)('price', exports.invalidPriceError, (val) => typeof val === 'string' && (0, validators_1.isFloatString)(val), true);
exports.validateWallet = (0, validators_1.mkValidator)('address', exports.invalidWalletError, (val) => {
    return (typeof val === 'string' &&
        ((0, ethereum_validators_1.isAddress)(val.slice(0, 42)) ||
            (0, kujira_helpers_1.isValidKujiraPublicKey)(val) ||
            (0, xrpl_validators_1.isXRPLAddress)(val)));
});
exports.validateOrderId = (0, validators_1.mkValidator)('orderId', exports.invalidOrderIdError, (val) => typeof val === 'string');
exports.validateOrderType = (0, validators_1.mkValidator)('orderType', exports.invalidOrderTypeError, (val) => typeof val === 'string' &&
    (val === 'LIMIT' || val === 'LIMIT_MAKER' || val === 'MARKET'));
const NETWORK_VALIDATIONS = [amm_validators_1.validateConnector, ethereum_validators_1.validateChain, ethereum_validators_1.validateNetwork];
exports.validateBasicRequest = (0, validators_1.mkRequestValidator)(NETWORK_VALIDATIONS);
exports.validateMarketRequest = (0, validators_1.mkRequestValidator)(NETWORK_VALIDATIONS.concat([exports.validateMarket]));
exports.validatePostOrderRequest = (0, validators_1.mkRequestValidator)(NETWORK_VALIDATIONS.concat([
    amm_validators_1.validateAmount,
    exports.validateWallet,
    amm_validators_1.validateSide,
    exports.validateOrderType,
    exports.validatePrice,
]));
exports.validatePostPerpOrderRequest = (0, validators_1.mkRequestValidator)(NETWORK_VALIDATIONS.concat([
    amm_validators_1.validateAmount,
    exports.validateWallet,
    amm_validators_1.validateSide,
    exports.validateOrderType,
    exports.validatePrice,
    exports.validateLeverage,
]));
exports.validateOrderRequest = (0, validators_1.mkRequestValidator)(NETWORK_VALIDATIONS.concat([exports.validateOrderId]));
exports.validatePerpTradesRequest = (0, validators_1.mkRequestValidator)(NETWORK_VALIDATIONS.concat([exports.validateOrderId, exports.validateWallet, exports.validateMarket]));
exports.validatePerpOrderRequest = (0, validators_1.mkRequestValidator)(NETWORK_VALIDATIONS.concat([exports.validateWallet, exports.validateMarket]));
exports.validateFundingInfoRequest = (0, validators_1.mkRequestValidator)(NETWORK_VALIDATIONS.concat([exports.validateMarket]));
exports.validateFundingPaymentsRequest = (0, validators_1.mkRequestValidator)(NETWORK_VALIDATIONS.concat([exports.validateWallet, exports.validateMarket]));
exports.validateBatchOrdersRequest = (0, validators_1.mkRequestValidator)(NETWORK_VALIDATIONS);
exports.validatePositionsRequest = (0, validators_1.mkRequestValidator)(NETWORK_VALIDATIONS.concat([exports.validateWallet, exports.validateMarkets]));
exports.validatePerpLastTradePrice = (0, validators_1.mkRequestValidator)(NETWORK_VALIDATIONS.concat([exports.validateMarket]));
//# sourceMappingURL=clob.validators.js.map