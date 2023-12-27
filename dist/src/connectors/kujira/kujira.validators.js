"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateGetTransactionRequest = exports.validateGetWalletsPublicKeysRequest = exports.validateGetWalletPublicKeyRequest = exports.validateSettleAllMarketsFundsRequest = exports.validateSettleMarketsFundsRequest = exports.validateSettleMarketFundsRequest = exports.validateCancelAllOrdersRequest = exports.validateCancelOrdersRequest = exports.validateCancelOrderRequest = exports.validatePlaceOrdersRequest = exports.validatePlaceOrderRequest = exports.validateGetAllOrdersRequest = exports.validateGetOrdersRequest = exports.validateGetOrderRequest = exports.validateGetAllBalancesRequest = exports.validateGetBalancesRequest = exports.validateGetBalanceRequest = exports.validateGetAllTickersRequest = exports.validateGetTickersRequest = exports.validateGetTickerRequest = exports.validateGetAllOrderBooksRequest = exports.validateGetOrderBooksRequest = exports.validateGetOrderBookRequest = exports.validateGetAllMarketsRequest = exports.validateGetMarketsRequest = exports.validateGetMarketRequest = exports.validateGetAllTokensRequest = exports.validateGetTokensRequest = exports.validateGetTokenRequest = exports.validateIfExistsMarketIdOrMarketName = exports.validateGetTokens = exports.validateOrderStatuses = exports.validateOrderStatus = exports.validateOrderType = exports.validateOrderAmount = exports.validateOrderPrice = exports.validateOrderSide = exports.validateOrderOwnerAddresses = exports.validateOrderOwnerAddress = exports.validateAllMarketIds = exports.validateOrderMarketId = exports.validateOrderMarketNames = exports.validateOrderMarketName = exports.validateOrderExchangeIds = exports.validateOrderExchangeId = exports.validateOrderClientIds = exports.validateOrderClientId = exports.throwIfErrorsExist = exports.createBatchValidator = exports.createRequestValidator = void 0;
exports.validateGetEstimatedFeesRequest = exports.validateGetCurrentBlockRequest = exports.validateGetTransactionsRequest = void 0;
const http_status_codes_1 = require("http-status-codes");
const error_handler_1 = require("../../services/error-handler");
const bignumber_js_1 = require("bignumber.js");
const validators_1 = require("../../services/validators");
const kujira_types_1 = require("./kujira.types");
const createValidator = (accessor, validation, error, optional = false) => {
    return (item, index) => {
        const warnings = [];
        const errors = [];
        let target;
        if (item === undefined && accessor) {
            errors.push(`Request with undefined value informed when it shouldn't.`);
        }
        else if (item === null && accessor) {
            errors.push(`Request with null value informed when it shouldn't.`);
        }
        else if (!accessor) {
            target = item;
        }
        else if (typeof accessor === 'string') {
            if (!(`${accessor}` in item) && !optional) {
                errors.push(`The request is missing the key/property "${accessor}".`);
            }
            else {
                target = item[accessor];
            }
        }
        else {
            target = accessor(item);
        }
        if (!validation(item, target)) {
            if (typeof error === 'string') {
                if (optional) {
                    warnings.push(error);
                }
                else {
                    errors.push(error);
                }
            }
            else {
                if (optional) {
                    warnings.push(error(item, target, accessor, index));
                }
                else {
                    errors.push(error(item, target, accessor, index));
                }
            }
        }
        return {
            warnings,
            errors,
        };
    };
};
const createRequestValidator = (validators, statusCode, headerMessage, errorNumber) => {
    return (request) => {
        let warnings = [];
        let errors = [];
        for (const validator of validators) {
            const result = validator(request);
            warnings = [...warnings, ...result.warnings];
            errors = [...errors, ...result.errors];
        }
        (0, exports.throwIfErrorsExist)(errors, statusCode, request, headerMessage, errorNumber);
        return { warnings, errors };
    };
};
exports.createRequestValidator = createRequestValidator;
const createBatchValidator = (validators, headerItemMessage, accessor = undefined) => {
    return (input) => {
        let warnings = [];
        let errors = [];
        let items = [];
        if (input === undefined && accessor) {
            errors.push(`Request with undefined value informed when it shouldn't.`);
        }
        else if (input === null && accessor) {
            errors.push(`Request with null value informed when it shouldn't.`);
        }
        else if (!accessor) {
            items = input;
        }
        else if (typeof accessor === 'string') {
            if (!(`${accessor}` in input)) {
                errors.push(`The request is missing the key/property "${accessor}".`);
            }
            else {
                items = input[accessor];
            }
        }
        else {
            items = accessor(input);
        }
        let index = 0;
        for (const item of items) {
            for (const validator of validators) {
                const itemResult = validator(item, index);
                if (itemResult.warnings && itemResult.warnings.length > 0) {
                    if (headerItemMessage)
                        warnings.push(headerItemMessage(item, index));
                }
                if (itemResult.errors && itemResult.errors.length > 0) {
                    if (headerItemMessage)
                        errors.push(headerItemMessage(item, index));
                }
                warnings = [...warnings, ...itemResult.warnings];
                errors = [...errors, ...itemResult.errors];
            }
            index++;
        }
        return { warnings, errors };
    };
};
exports.createBatchValidator = createBatchValidator;
const throwIfErrorsExist = (errors, statusCode = http_status_codes_1.StatusCodes.NOT_FOUND, request, headerMessage, errorNumber) => {
    if (errors.length > 0) {
        let message = headerMessage
            ? `${headerMessage(request, errorNumber)}\n`
            : '';
        message += errors.join('\n');
        throw new error_handler_1.HttpException(statusCode, message);
    }
};
exports.throwIfErrorsExist = throwIfErrorsExist;
const validateOrderClientId = (optional = false) => {
    return createValidator(null, (target, _) => typeof target === 'object'
        ? (0, validators_1.isNaturalNumberString)(target.clientId)
        : target, (target, _) => {
        const id = typeof target === 'object' ? target.clientId : target;
        return `Invalid client id (${id}), it needs to be in big number format.`;
    }, optional);
};
exports.validateOrderClientId = validateOrderClientId;
const validateOrderClientIds = (optional = false) => {
    return createValidator('clientIds', (_, values) => {
        let ok = true;
        values === undefined
            ? (ok = true)
            : values.map((item) => {
                const id = typeof item === 'object'
                    ? (0, validators_1.isNaturalNumberString)(item.clientId)
                    : item;
                ok = (0, validators_1.isNaturalNumberString)(id) && ok;
            });
        return ok;
    }, `Invalid client ids, it needs to be an array of big numbers.`, optional);
};
exports.validateOrderClientIds = validateOrderClientIds;
const validateOrderExchangeId = (optional = false) => {
    return createValidator(null, (target, _) => typeof target == 'object' && 'id' in target
        ? (0, validators_1.isNaturalNumberString)(target.id)
        : target, (target, _) => {
        const id = typeof target == 'object' ? target.id : target;
        return `Invalid exchange id (${id}), it needs to be in big number format.`;
    }, optional);
};
exports.validateOrderExchangeId = validateOrderExchangeId;
const validateOrderExchangeIds = (optional = false) => {
    return createValidator('ids', (_, values) => {
        let ok = true;
        values === undefined
            ? (ok = true)
            : values.map((item) => {
                const id = typeof item == 'object' ? item.id : item;
                ok = (0, validators_1.isNaturalNumberString)(id) && ok;
            });
        return ok;
    }, `Invalid exchange ids, it needs to be an array of big numbers.`, optional);
};
exports.validateOrderExchangeIds = validateOrderExchangeIds;
const validateOrderMarketName = (optional = false) => {
    return createValidator('marketName', (_, value) => (value === undefined ? true : value.trim().length), (_, value) => `Invalid market name (${value}).`, optional);
};
exports.validateOrderMarketName = validateOrderMarketName;
const validateOrderMarketNames = (optional = false) => {
    return createValidator('marketNames', (_, values) => {
        let ok = true;
        values === undefined
            ? (ok = true)
            : values.map((item) => (ok = item.trim().length && ok));
        return ok;
    }, `Invalid market names, it needs to be an array of strings.`, optional);
};
exports.validateOrderMarketNames = validateOrderMarketNames;
const validateOrderMarketId = (optional = false) => {
    return createValidator('marketId', (_, value) => value === undefined
        ? true
        : value.trim().length && value.trim().slice(0, 6) === 'kujira', (_, value) => `Invalid market id (${value}).`, optional);
};
exports.validateOrderMarketId = validateOrderMarketId;
const validateAllMarketIds = (optional = false) => {
    return createValidator('marketIds', (_, values) => {
        let ok = true;
        values === undefined
            ? (ok = true)
            : values.map((item) => (ok = item.trim().length && item.trim().slice(0, 6) === 'kujira'));
        return ok;
    }, `Invalid market ids, it needs to be an array of strings.`, optional);
};
exports.validateAllMarketIds = validateAllMarketIds;
const validateOrderOwnerAddress = (optional = false) => {
    return createValidator('ownerAddress', (_, value) => /^kujira[a-z0-9]{39}$/.test(value), (_, value) => `Invalid owner address (${value}).`, optional);
};
exports.validateOrderOwnerAddress = validateOrderOwnerAddress;
const validateOrderOwnerAddresses = (optional = false) => {
    return createValidator('ownerAddresses', (_, values) => {
        let ok = true;
        values === undefined
            ? (ok = true)
            : values.map((item) => /^kujira[a-z0-9]{39}$/.test(item));
        return ok;
    }, `Invalid owner addresses...`, optional);
};
exports.validateOrderOwnerAddresses = validateOrderOwnerAddresses;
const validateOrderSide = (optional = false) => {
    return createValidator('side', (_, value) => value &&
        Object.values(kujira_types_1.OrderSide)
            .map((i) => i.toLowerCase())
            .includes(value.toLowerCase()), (_, value) => `Invalid order side (${value}).`, optional);
};
exports.validateOrderSide = validateOrderSide;
const validateOrderPrice = (optional = false) => {
    return createValidator('price', (_, value) => typeof value === 'undefined'
        ? true
        : typeof value === 'number' ||
            value instanceof bignumber_js_1.BigNumber ||
            (0, validators_1.isFloatString)(value), (_, value) => `Invalid order price (${value}).`, optional);
};
exports.validateOrderPrice = validateOrderPrice;
const validateOrderAmount = (optional = false) => {
    return createValidator('amount', (_, value) => typeof value === 'number' ||
        value instanceof bignumber_js_1.BigNumber ||
        (0, validators_1.isFloatString)(value), (_, value) => `Invalid order amount (${value}).`, optional);
};
exports.validateOrderAmount = validateOrderAmount;
const validateOrderType = (optional = false) => {
    return createValidator('type', (_, value) => value === undefined
        ? true
        : Object.values(kujira_types_1.OrderType)
            .map((item) => item.toLowerCase())
            .includes(value.toLowerCase()), (_, value) => `Invalid order type (${value}).`, optional);
};
exports.validateOrderType = validateOrderType;
const validateOrderStatus = (optional = false) => {
    return createValidator('status', (_, value) => value === undefined ? true : Object.values(kujira_types_1.OrderStatus).includes(value), (_, value) => `Invalid order(s) status (${value}).`, optional);
};
exports.validateOrderStatus = validateOrderStatus;
const validateOrderStatuses = (optional = false) => {
    return createValidator('statuses', (_, values) => values === undefined ? true : Object.values(kujira_types_1.OrderStatus).includes(values), (_, values) => `Invalid order(s) status (${values}).`, optional);
};
exports.validateOrderStatuses = validateOrderStatuses;
const validateGetTokens = (optional = false) => {
    return createValidator(null, (request) => (request.names && request.names.length) ||
        (request.ids && request.ids.length) ||
        (request.symbols && request.symbols.length), `No tokens were informed. If you want to get all tokens, please do not inform the parameter "names" or "ids".`, optional);
};
exports.validateGetTokens = validateGetTokens;
const validateIfExistsMarketIdOrMarketName = (optional = false) => {
    return createValidator(null, (request) => request.marketId || request.marketName, `No market name was informed. please inform the parameter marketId or marketName.`, optional);
};
exports.validateIfExistsMarketIdOrMarketName = validateIfExistsMarketIdOrMarketName;
exports.validateGetTokenRequest = (0, exports.createRequestValidator)([
    createValidator(null, (request) => request.id || request.name || request.symbol, `No token was informed. If you want to get a token, please inform the parameter "id".`, false),
], http_status_codes_1.StatusCodes.BAD_REQUEST);
exports.validateGetTokensRequest = (0, exports.createRequestValidator)([(0, exports.validateGetTokens)(false)], http_status_codes_1.StatusCodes.BAD_REQUEST);
exports.validateGetAllTokensRequest = (0, exports.createRequestValidator)([createValidator(null, (_request) => true, ``, false)], http_status_codes_1.StatusCodes.BAD_REQUEST);
exports.validateGetMarketRequest = (0, exports.createRequestValidator)([
    createValidator(null, (request) => request.id || request.name, `No market was informed. If you want to get a market, please inform the parameter id or name.`, false),
], http_status_codes_1.StatusCodes.BAD_REQUEST);
exports.validateGetMarketsRequest = (0, exports.createRequestValidator)([
    createValidator(null, (_request) => true, `Error occur when acessing /markets endpoint`, false),
], http_status_codes_1.StatusCodes.BAD_REQUEST);
exports.validateGetAllMarketsRequest = (0, exports.createRequestValidator)([createValidator(null, (_request) => true, ``, false)], http_status_codes_1.StatusCodes.BAD_REQUEST);
exports.validateGetOrderBookRequest = (0, exports.createRequestValidator)([
    createValidator(null, (request) => request.marketId || request.marketName, `No market name was informed. If you want to get an order book, please inform the parameter marketId or marketName.`, false),
], http_status_codes_1.StatusCodes.BAD_REQUEST);
exports.validateGetOrderBooksRequest = (0, exports.createRequestValidator)([
    createValidator(null, (request) => (request.marketIds && request.marketIds.length) ||
        (request.marketNames && request.marketNames.length), `No market names or maket ids were informed. Please inform the parameter marketIds or marketNames. If you want to get all order books, please do not inform the parameter "marketIds".`, false),
], http_status_codes_1.StatusCodes.BAD_REQUEST);
exports.validateGetAllOrderBooksRequest = (0, exports.createRequestValidator)([createValidator(null, (_request) => true, ``, false)], http_status_codes_1.StatusCodes.BAD_REQUEST);
exports.validateGetTickerRequest = (0, exports.createRequestValidator)([
    (0, exports.validateIfExistsMarketIdOrMarketName)(),
    (0, exports.validateOrderMarketId)(true),
    (0, exports.validateOrderMarketName)(true),
], http_status_codes_1.StatusCodes.BAD_REQUEST);
exports.validateGetTickersRequest = (0, exports.createRequestValidator)([
    createValidator(null, (request) => (request.marketIds && request.marketIds.length) ||
        (request.marketNames && request.marketNames.length), `No market names were informed. please do not inform the parameter "marketIds".`, false),
], http_status_codes_1.StatusCodes.BAD_REQUEST);
exports.validateGetAllTickersRequest = (0, exports.createRequestValidator)([createValidator(null, (_request) => true, ``, false)], http_status_codes_1.StatusCodes.BAD_REQUEST);
exports.validateGetBalanceRequest = (0, exports.createRequestValidator)([
    createValidator(null, (request) => (request.tokenId && request.ownerAddress) ||
        (request.tokenSymbol && request.ownerAddress), `No market name was informed. If you want to get a balance, please inform the parameter "marketId".`, false),
], http_status_codes_1.StatusCodes.BAD_REQUEST);
exports.validateGetBalancesRequest = (0, exports.createRequestValidator)([
    createValidator(null, (request) => (request.tokenIds && request.ownerAddress) ||
        (request.tokenSymbols && request.ownerAddress), `No market names were informed. If you want to get all balances, please do not inform the parameter "marketIds".`, false),
], http_status_codes_1.StatusCodes.BAD_REQUEST);
exports.validateGetAllBalancesRequest = (0, exports.createRequestValidator)([createValidator(null, (request) => !!request.ownerAddress, ``, false)], http_status_codes_1.StatusCodes.BAD_REQUEST);
exports.validateGetOrderRequest = (0, exports.createRequestValidator)([
    createValidator(null, (request) => request && (request.id || request.clientId), `No id or client id was informed.`, false),
    (0, exports.validateOrderClientId)(true),
    (0, exports.validateOrderExchangeId)(true),
    (0, exports.validateOrderOwnerAddress)(),
], http_status_codes_1.StatusCodes.BAD_REQUEST, (request) => `Error when trying to get order "${request.id}"`);
exports.validateGetOrdersRequest = (0, exports.createRequestValidator)([
    createValidator(null, (request) => request &&
        ((request.ids && request.ids.length) ||
            (request.clientIds && request.clientIds.length)), `No orders were informed.`, false),
    (0, exports.validateOrderClientIds)(true),
    (0, exports.validateOrderExchangeIds)(),
    (0, exports.validateOrderOwnerAddress)(),
], http_status_codes_1.StatusCodes.BAD_REQUEST);
exports.validateGetAllOrdersRequest = (0, exports.createRequestValidator)([
    createValidator(null, (request) => request &&
        (request.ownerAddress ||
            (request.ownerAddresses && request.ownerAddresses.length)), `No owner address informed.`, false),
    (0, exports.validateOrderOwnerAddress)(true),
    (0, exports.validateOrderOwnerAddresses)(true),
    createValidator(null, (request) => request.status || (request.statuses && request.statuses.length), `No order status informed.`, true),
    (0, exports.validateOrderStatus)(true),
    (0, exports.validateOrderStatuses)(true),
    (0, exports.validateOrderMarketId)(true),
    (0, exports.validateAllMarketIds)(true),
    (0, exports.validateOrderMarketName)(true),
    (0, exports.validateOrderMarketNames)(true),
], http_status_codes_1.StatusCodes.BAD_REQUEST, (request) => `Error when trying to get all orders for markets "${request.marketId} ? "${request.marketId} : "${request.marketId} "`);
exports.validatePlaceOrderRequest = (0, exports.createRequestValidator)([
    createValidator(null, (request) => request.marketId || request.marketName, `No market informed. Inform a marketIdd or marketName.`, false),
    (0, exports.validateOrderMarketId)(true),
    (0, exports.validateOrderMarketName)(true),
    (0, exports.validateOrderOwnerAddress)(),
    (0, exports.validateOrderSide)(),
    (0, exports.validateOrderPrice)(true),
    (0, exports.validateOrderAmount)(),
    (0, exports.validateOrderType)(),
], http_status_codes_1.StatusCodes.BAD_REQUEST, (request) => `Error when trying to create order "${request.id}"`);
exports.validatePlaceOrdersRequest = (0, exports.createRequestValidator)([
    createValidator(null, (request) => request.orders && request.orders.length, `No orders were informed.`, false),
    (0, exports.validateOrderOwnerAddress)(true),
    (0, exports.createBatchValidator)([
        createValidator(null, (request) => request.marketId || request.marketName, `marketId or maketName must be informed.`, false),
        (0, exports.validateOrderMarketId)(true),
        (0, exports.validateOrderMarketName)(true),
        (0, exports.validateOrderOwnerAddress)(true),
        (0, exports.validateOrderSide)(),
        (0, exports.validateOrderPrice)(true),
        (0, exports.validateOrderAmount)(),
        (0, exports.validateOrderType)(),
    ], (index) => `Invalid order request body  at position ${index}`, 'orders'),
], http_status_codes_1.StatusCodes.BAD_REQUEST);
exports.validateCancelOrderRequest = (0, exports.createRequestValidator)([
    createValidator(null, (request) => request && (request.marketId || request.marketName), `No market informed. Inform a market id or market name.`, false),
    (0, exports.validateOrderMarketId)(true),
    (0, exports.validateOrderMarketName)(true),
    (0, exports.validateOrderExchangeId)(true),
    (0, exports.validateOrderOwnerAddress)(),
], http_status_codes_1.StatusCodes.BAD_REQUEST, (request) => `Error when trying to cancel order "${request.id}"`);
exports.validateCancelOrdersRequest = (0, exports.createRequestValidator)([
    createValidator(null, (request) => request &&
        (request.marketId ||
            request.marketName ||
            (request.marketIds && request.marketIds.length)), `No market informed. Inform a marketId, marketName ou marketNames.`, false),
    (0, exports.validateOrderMarketId)(true),
    (0, exports.validateOrderMarketName)(true),
    createValidator(null, (values) => values && values.ids, `No orders were informed.`, true),
    (0, exports.validateOrderExchangeIds)(true),
    (0, exports.validateAllMarketIds)(true),
    createValidator(null, (request) => request.ownerAddress || request.ownerAddresses, `No owner address informed. Please inform the parameter ownerAddress or ownerAddresses`, false),
    (0, exports.validateOrderOwnerAddress)(true),
    (0, exports.validateOrderOwnerAddresses)(true),
], http_status_codes_1.StatusCodes.BAD_REQUEST);
exports.validateCancelAllOrdersRequest = (0, exports.createRequestValidator)([
    createValidator(null, (request) => request.ownerAddress || request.ownerAddresses, `No owner address informed.`, false),
    (0, exports.validateOrderOwnerAddress)(true),
    (0, exports.validateOrderOwnerAddresses)(true),
    createValidator(null, (request) => request.marketId ||
        (request.marketIds && request.marketIds.length) ||
        request.marketName ||
        (request.marketNames && request.marketNames.length), `No market informed. Inform a market id or market name.`, true),
    (0, exports.validateOrderMarketId)(true),
    (0, exports.validateAllMarketIds)(true),
    (0, exports.validateOrderMarketName)(true),
    (0, exports.validateOrderMarketNames)(true),
], http_status_codes_1.StatusCodes.BAD_REQUEST);
exports.validateSettleMarketFundsRequest = (0, exports.createRequestValidator)([
    createValidator(null, (request) => request.ownerAddress ||
        (request.ownerAddresses && request.ownerAddresses.length), `No owner address informed.`, false),
    (0, exports.validateOrderOwnerAddress)(true),
    (0, exports.validateOrderOwnerAddresses)(true),
    createValidator(null, (request) => request.marketId || request.marketName, `No market informed. Inform a marketId or marketName.`, false),
    (0, exports.validateOrderMarketName)(true),
    (0, exports.validateOrderMarketId)(true),
], http_status_codes_1.StatusCodes.BAD_REQUEST, (request) => `Error when trying to settle funds for market "${request.marketId}."`);
exports.validateSettleMarketsFundsRequest = (0, exports.createRequestValidator)([
    createValidator(null, (request) => request.ownerAddresses || request.ownerAddress, `No owner address informed.`, false),
    (0, exports.validateOrderOwnerAddress)(true),
    (0, exports.validateOrderOwnerAddresses)(true),
    createValidator(null, (request) => (request.marketIds && request.marketIds.length) ||
        (request.marketNames && request.marketNames.length), `No markets informed. Inform market ids or market names.`, true),
    (0, exports.validateAllMarketIds)(true),
    (0, exports.validateOrderMarketNames)(true),
], http_status_codes_1.StatusCodes.BAD_REQUEST);
exports.validateSettleAllMarketsFundsRequest = (0, exports.createRequestValidator)([(0, exports.validateOrderOwnerAddress)()], http_status_codes_1.StatusCodes.BAD_REQUEST);
exports.validateGetWalletPublicKeyRequest = (0, exports.createRequestValidator)([], http_status_codes_1.StatusCodes.BAD_REQUEST);
exports.validateGetWalletsPublicKeysRequest = (0, exports.createRequestValidator)([], http_status_codes_1.StatusCodes.BAD_REQUEST);
exports.validateGetTransactionRequest = (0, exports.createRequestValidator)([], http_status_codes_1.StatusCodes.BAD_REQUEST);
exports.validateGetTransactionsRequest = (0, exports.createRequestValidator)([], http_status_codes_1.StatusCodes.BAD_REQUEST);
exports.validateGetCurrentBlockRequest = (0, exports.createRequestValidator)([], http_status_codes_1.StatusCodes.BAD_REQUEST);
exports.validateGetEstimatedFeesRequest = (0, exports.createRequestValidator)([], http_status_codes_1.StatusCodes.BAD_REQUEST);
//# sourceMappingURL=kujira.validators.js.map