"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEstimatedFees = exports.getCurrentBlock = exports.getTransactions = exports.getTransaction = exports.getWalletsPublicKeys = exports.getWalletPublicKey = exports.withdrawFromAllMarkets = exports.withdrawFromMarkets = exports.withdrawFromMarket = exports.cancelAllOrders = exports.cancelOrders = exports.cancelOrder = exports.placeOrders = exports.placeOrder = exports.getOrders = exports.getOrder = exports.getAllBalances = exports.getBalances = exports.getBalance = exports.getAllTickers = exports.getTickers = exports.getTicker = exports.getAllOrderBooks = exports.getOrderBooks = exports.getOrderBook = exports.getAllMarkets = exports.getMarkets = exports.getMarket = exports.getAllTokens = exports.getTokens = exports.getToken = exports.getRoot = void 0;
const http_status_codes_1 = require("http-status-codes");
const common_interfaces_1 = require("../../services/common-interfaces");
const error_handler_1 = require("../../services/error-handler");
const kujira_convertors_1 = require("./kujira.convertors");
const kujira_types_1 = require("./kujira.types");
const kujira_validators_1 = require("./kujira.validators");
function getRoot(connector, request) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = new common_interfaces_1.ResponseWrapper();
        response.body = (0, kujira_convertors_1.convertToResponseBody)(yield connector.getRoot(request));
        response.status = http_status_codes_1.StatusCodes.OK;
        return response;
    });
}
exports.getRoot = getRoot;
function getToken(connector, request) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, kujira_validators_1.validateGetTokenRequest)(request);
        const response = new common_interfaces_1.ResponseWrapper();
        try {
            response.body = (0, kujira_convertors_1.convertToResponseBody)(yield connector.getToken(request));
            response.status = http_status_codes_1.StatusCodes.OK;
            return response;
        }
        catch (exception) {
            if (exception instanceof kujira_types_1.TokenNotFoundError) {
                throw new error_handler_1.HttpException(http_status_codes_1.StatusCodes.NOT_FOUND, exception.message);
            }
            else {
                throw exception;
            }
        }
    });
}
exports.getToken = getToken;
function getTokens(connector, request) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, kujira_validators_1.validateGetTokensRequest)(request);
        const response = new common_interfaces_1.ResponseWrapper();
        try {
            response.body = (0, kujira_convertors_1.convertToResponseBody)(yield connector.getTokens(request));
            response.status = http_status_codes_1.StatusCodes.OK;
            return response;
        }
        catch (exception) {
            if (exception instanceof kujira_types_1.TokenNotFoundError) {
                throw new error_handler_1.HttpException(http_status_codes_1.StatusCodes.NOT_FOUND, exception.message);
            }
            else {
                throw exception;
            }
        }
    });
}
exports.getTokens = getTokens;
function getAllTokens(connector, request) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, kujira_validators_1.validateGetAllTokensRequest)(request);
        const response = new common_interfaces_1.ResponseWrapper();
        try {
            response.body = (0, kujira_convertors_1.convertToResponseBody)(yield connector.getAllTokens(request));
            response.status = http_status_codes_1.StatusCodes.OK;
            return response;
        }
        catch (exception) {
            if (exception instanceof kujira_types_1.TokenNotFoundError) {
                throw new error_handler_1.HttpException(http_status_codes_1.StatusCodes.NOT_FOUND, exception.message);
            }
            else {
                throw exception;
            }
        }
    });
}
exports.getAllTokens = getAllTokens;
function getMarket(connector, request) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, kujira_validators_1.validateGetMarketRequest)(request);
        const response = new common_interfaces_1.ResponseWrapper();
        try {
            response.body = (0, kujira_convertors_1.convertToResponseBody)(yield connector.getMarket(request));
            response.status = http_status_codes_1.StatusCodes.OK;
            return response;
        }
        catch (exception) {
            if (exception instanceof kujira_types_1.MarketNotFoundError) {
                throw new error_handler_1.HttpException(http_status_codes_1.StatusCodes.NOT_FOUND, exception.message);
            }
            else {
                throw exception;
            }
        }
    });
}
exports.getMarket = getMarket;
function getMarkets(connector, request) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, kujira_validators_1.validateGetMarketsRequest)(request);
        const response = new common_interfaces_1.ResponseWrapper();
        try {
            response.body = (0, kujira_convertors_1.convertToResponseBody)(yield connector.getMarkets(request));
            response.status = http_status_codes_1.StatusCodes.OK;
            return response;
        }
        catch (exception) {
            if (exception instanceof kujira_types_1.MarketNotFoundError) {
                throw new error_handler_1.HttpException(http_status_codes_1.StatusCodes.NOT_FOUND, exception.message);
            }
            else {
                throw exception;
            }
        }
    });
}
exports.getMarkets = getMarkets;
function getAllMarkets(connector, request) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, kujira_validators_1.validateGetAllMarketsRequest)(request);
        const response = new common_interfaces_1.ResponseWrapper();
        try {
            response.body = (0, kujira_convertors_1.convertToResponseBody)(yield connector.getAllMarkets(request));
            response.status = http_status_codes_1.StatusCodes.OK;
            return response;
        }
        catch (exception) {
            if (exception instanceof kujira_types_1.MarketNotFoundError) {
                throw new error_handler_1.HttpException(http_status_codes_1.StatusCodes.NOT_FOUND, exception.message);
            }
            else {
                throw exception;
            }
        }
    });
}
exports.getAllMarkets = getAllMarkets;
function getOrderBook(connector, request) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, kujira_validators_1.validateGetOrderBookRequest)(request);
        const response = new common_interfaces_1.ResponseWrapper();
        try {
            response.body = (0, kujira_convertors_1.convertToResponseBody)(yield connector.getOrderBook(request));
            response.status = http_status_codes_1.StatusCodes.OK;
            return response;
        }
        catch (exception) {
            if (exception instanceof kujira_types_1.OrderBookNotFoundError) {
                throw new error_handler_1.HttpException(http_status_codes_1.StatusCodes.NOT_FOUND, exception.message);
            }
            else {
                throw exception;
            }
        }
    });
}
exports.getOrderBook = getOrderBook;
function getOrderBooks(connector, request) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, kujira_validators_1.validateGetOrderBooksRequest)(request);
        const response = new common_interfaces_1.ResponseWrapper();
        try {
            response.body = (0, kujira_convertors_1.convertToResponseBody)(yield connector.getOrderBooks(request));
            response.status = http_status_codes_1.StatusCodes.OK;
            return response;
        }
        catch (exception) {
            if (exception instanceof kujira_types_1.OrderBookNotFoundError) {
                throw new error_handler_1.HttpException(http_status_codes_1.StatusCodes.NOT_FOUND, exception.message);
            }
            else {
                throw exception;
            }
        }
    });
}
exports.getOrderBooks = getOrderBooks;
function getAllOrderBooks(connector, request) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, kujira_validators_1.validateGetAllOrderBooksRequest)(request);
        const response = new common_interfaces_1.ResponseWrapper();
        try {
            response.body = (0, kujira_convertors_1.convertToResponseBody)(yield connector.getAllOrderBooks(request));
            response.status = http_status_codes_1.StatusCodes.OK;
            return response;
        }
        catch (exception) {
            if (exception instanceof kujira_types_1.OrderBookNotFoundError) {
                throw new error_handler_1.HttpException(http_status_codes_1.StatusCodes.NOT_FOUND, exception.message);
            }
            else {
                throw exception;
            }
        }
    });
}
exports.getAllOrderBooks = getAllOrderBooks;
function getTicker(connector, request) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, kujira_validators_1.validateGetTickerRequest)(request);
        const response = new common_interfaces_1.ResponseWrapper();
        try {
            response.body = (0, kujira_convertors_1.convertToResponseBody)(yield connector.getTicker(request));
            response.status = http_status_codes_1.StatusCodes.OK;
            return response;
        }
        catch (exception) {
            if (exception instanceof kujira_types_1.TickerNotFoundError) {
                throw new error_handler_1.HttpException(http_status_codes_1.StatusCodes.NOT_FOUND, exception.message);
            }
            else {
                throw exception;
            }
        }
    });
}
exports.getTicker = getTicker;
function getTickers(connector, request) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, kujira_validators_1.validateGetTickersRequest)(request);
        const response = new common_interfaces_1.ResponseWrapper();
        try {
            response.body = (0, kujira_convertors_1.convertToResponseBody)(yield connector.getTickers(request));
            response.status = http_status_codes_1.StatusCodes.OK;
            return response;
        }
        catch (exception) {
            if (exception instanceof kujira_types_1.TickerNotFoundError) {
                throw new error_handler_1.HttpException(http_status_codes_1.StatusCodes.NOT_FOUND, exception.message);
            }
            else {
                throw exception;
            }
        }
    });
}
exports.getTickers = getTickers;
function getAllTickers(connector, request) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, kujira_validators_1.validateGetAllTickersRequest)(request);
        const response = new common_interfaces_1.ResponseWrapper();
        try {
            response.body = (0, kujira_convertors_1.convertToResponseBody)(yield connector.getAllTickers(request));
            response.status = http_status_codes_1.StatusCodes.OK;
            return response;
        }
        catch (exception) {
            if (exception instanceof kujira_types_1.TickerNotFoundError) {
                throw new error_handler_1.HttpException(http_status_codes_1.StatusCodes.NOT_FOUND, exception.message);
            }
            else {
                throw exception;
            }
        }
    });
}
exports.getAllTickers = getAllTickers;
function getBalance(connector, request) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, kujira_validators_1.validateGetBalanceRequest)(request);
        const response = new common_interfaces_1.ResponseWrapper();
        try {
            response.body = (0, kujira_convertors_1.convertToResponseBody)(yield connector.getBalance(request));
            response.status = http_status_codes_1.StatusCodes.OK;
            return response;
        }
        catch (exception) {
            if (exception instanceof kujira_types_1.BalanceNotFoundError) {
                throw new error_handler_1.HttpException(http_status_codes_1.StatusCodes.NOT_FOUND, exception.message);
            }
            else {
                throw exception;
            }
        }
    });
}
exports.getBalance = getBalance;
function getBalances(connector, request) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, kujira_validators_1.validateGetBalancesRequest)(request);
        const response = new common_interfaces_1.ResponseWrapper();
        try {
            response.body = (0, kujira_convertors_1.convertToResponseBody)(yield connector.getBalances(request));
            response.status = http_status_codes_1.StatusCodes.OK;
            return response;
        }
        catch (exception) {
            if (exception instanceof kujira_types_1.BalanceNotFoundError) {
                throw new error_handler_1.HttpException(http_status_codes_1.StatusCodes.NOT_FOUND, exception.message);
            }
            else {
                throw exception;
            }
        }
    });
}
exports.getBalances = getBalances;
function getAllBalances(connector, request) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, kujira_validators_1.validateGetAllBalancesRequest)(request);
        const response = new common_interfaces_1.ResponseWrapper();
        try {
            response.body = (0, kujira_convertors_1.convertToResponseBody)(yield connector.getAllBalances(request));
            response.status = http_status_codes_1.StatusCodes.OK;
            return response;
        }
        catch (exception) {
            if (exception instanceof kujira_types_1.BalanceNotFoundError) {
                throw new error_handler_1.HttpException(http_status_codes_1.StatusCodes.NOT_FOUND, exception.message);
            }
            else {
                throw exception;
            }
        }
    });
}
exports.getAllBalances = getAllBalances;
function getOrder(connector, request) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, kujira_validators_1.validateGetOrderRequest)(request);
        const response = new common_interfaces_1.ResponseWrapper();
        try {
            response.body = (0, kujira_convertors_1.convertToResponseBody)(yield connector.getOrder(request));
            response.status = http_status_codes_1.StatusCodes.OK;
            return response;
        }
        catch (exception) {
            if (exception instanceof kujira_types_1.OrderNotFoundError) {
                throw new error_handler_1.HttpException(http_status_codes_1.StatusCodes.NOT_FOUND, exception.message);
            }
            else {
                throw exception;
            }
        }
    });
}
exports.getOrder = getOrder;
function getOrders(connector, request) {
    return __awaiter(this, void 0, void 0, function* () {
        if (request.ids) {
            (0, kujira_validators_1.validateGetOrdersRequest)(request);
        }
        else if (request.marketId ||
            request.marketIds ||
            request.marketName ||
            request.marketNames ||
            request.status ||
            request.statuses) {
            (0, kujira_validators_1.validateGetAllOrdersRequest)(request);
        }
        const response = new common_interfaces_1.ResponseWrapper();
        try {
            response.body = (0, kujira_convertors_1.convertToResponseBody)(yield connector.getOrders(request));
            response.status = http_status_codes_1.StatusCodes.OK;
            return response;
        }
        catch (exception) {
            if (exception instanceof kujira_types_1.OrderNotFoundError) {
                throw new error_handler_1.HttpException(http_status_codes_1.StatusCodes.NOT_FOUND, exception.message);
            }
            else {
                throw exception;
            }
        }
    });
}
exports.getOrders = getOrders;
function placeOrder(connector, request) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, kujira_validators_1.validatePlaceOrderRequest)(request);
        const response = new common_interfaces_1.ResponseWrapper();
        response.body = (0, kujira_convertors_1.convertToResponseBody)(yield connector.placeOrder(request));
        response.status = http_status_codes_1.StatusCodes.OK;
        return response;
    });
}
exports.placeOrder = placeOrder;
function placeOrders(connector, request) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, kujira_validators_1.validatePlaceOrdersRequest)(request);
        const response = new common_interfaces_1.ResponseWrapper();
        response.body = (0, kujira_convertors_1.convertToResponseBody)(yield connector.placeOrders(request));
        response.status = http_status_codes_1.StatusCodes.OK;
        return response;
    });
}
exports.placeOrders = placeOrders;
function cancelOrder(connector, request) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, kujira_validators_1.validateCancelOrderRequest)(request);
        const response = new common_interfaces_1.ResponseWrapper();
        try {
            response.body = (0, kujira_convertors_1.convertToResponseBody)(yield connector.cancelOrder(request));
            response.status = http_status_codes_1.StatusCodes.OK;
            return response;
        }
        catch (exception) {
            if (exception instanceof kujira_types_1.OrderNotFoundError) {
                throw new error_handler_1.HttpException(http_status_codes_1.StatusCodes.NOT_FOUND, exception.message);
            }
            else {
                throw exception;
            }
        }
    });
}
exports.cancelOrder = cancelOrder;
function cancelOrders(connector, request) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, kujira_validators_1.validateCancelOrdersRequest)(request);
        const response = new common_interfaces_1.ResponseWrapper();
        try {
            response.body = (0, kujira_convertors_1.convertToResponseBody)(yield connector.cancelOrders(request));
            response.status = http_status_codes_1.StatusCodes.OK;
            return response;
        }
        catch (exception) {
            if (exception instanceof kujira_types_1.OrderNotFoundError) {
                throw new error_handler_1.HttpException(http_status_codes_1.StatusCodes.NOT_FOUND, exception.message);
            }
            else {
                throw exception;
            }
        }
    });
}
exports.cancelOrders = cancelOrders;
function cancelAllOrders(connector, request) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, kujira_validators_1.validateCancelAllOrdersRequest)(request);
        const response = new common_interfaces_1.ResponseWrapper();
        response.body = (0, kujira_convertors_1.convertToResponseBody)(yield connector.cancelAllOrders(request));
        response.status = http_status_codes_1.StatusCodes.OK;
        return response;
    });
}
exports.cancelAllOrders = cancelAllOrders;
function withdrawFromMarket(connector, request) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, kujira_validators_1.validateSettleMarketFundsRequest)(request);
        const response = new common_interfaces_1.ResponseWrapper();
        try {
            response.body = (0, kujira_convertors_1.convertToResponseBody)(yield connector.withdrawFromMarket(request));
            response.status = http_status_codes_1.StatusCodes.OK;
            return response;
        }
        catch (exception) {
            if (exception instanceof kujira_types_1.MarketNotFoundError) {
                throw new error_handler_1.HttpException(http_status_codes_1.StatusCodes.NOT_FOUND, exception.message);
            }
            else {
                throw exception;
            }
        }
    });
}
exports.withdrawFromMarket = withdrawFromMarket;
function withdrawFromMarkets(connector, request) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, kujira_validators_1.validateSettleMarketsFundsRequest)(request);
        const response = new common_interfaces_1.ResponseWrapper();
        try {
            response.body = (0, kujira_convertors_1.convertToResponseBody)(yield connector.withdrawFromMarkets(request));
            response.status = http_status_codes_1.StatusCodes.OK;
            return response;
        }
        catch (exception) {
            if (exception instanceof kujira_types_1.MarketNotFoundError) {
                throw new error_handler_1.HttpException(http_status_codes_1.StatusCodes.NOT_FOUND, exception.message);
            }
            else {
                throw exception;
            }
        }
    });
}
exports.withdrawFromMarkets = withdrawFromMarkets;
function withdrawFromAllMarkets(connector, request) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, kujira_validators_1.validateSettleAllMarketsFundsRequest)(request);
        const response = new common_interfaces_1.ResponseWrapper();
        response.body = (0, kujira_convertors_1.convertToResponseBody)(yield connector.withdrawFromAllMarkets(request));
        response.status = http_status_codes_1.StatusCodes.OK;
        return response;
    });
}
exports.withdrawFromAllMarkets = withdrawFromAllMarkets;
function getWalletPublicKey(connector, request) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, kujira_validators_1.validateGetWalletPublicKeyRequest)(request);
        const response = new common_interfaces_1.ResponseWrapper();
        try {
            response.body = (0, kujira_convertors_1.convertToResponseBody)(yield connector.getWalletPublicKey(request));
            response.status = http_status_codes_1.StatusCodes.OK;
            return response;
        }
        catch (exception) {
            if (exception instanceof kujira_types_1.WalletPublicKeyNotFoundError) {
                throw new error_handler_1.HttpException(http_status_codes_1.StatusCodes.NOT_FOUND, exception.message);
            }
            else {
                throw exception;
            }
        }
    });
}
exports.getWalletPublicKey = getWalletPublicKey;
function getWalletsPublicKeys(connector, request) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, kujira_validators_1.validateGetWalletsPublicKeysRequest)(request);
        const response = new common_interfaces_1.ResponseWrapper();
        try {
            response.body = (0, kujira_convertors_1.convertToResponseBody)(connector.getWalletsPublicKeys(request));
            response.status = http_status_codes_1.StatusCodes.OK;
            return response;
        }
        catch (exception) {
            if (exception instanceof kujira_types_1.WalletPublicKeyNotFoundError) {
                throw new error_handler_1.HttpException(http_status_codes_1.StatusCodes.NOT_FOUND, exception.message);
            }
            else {
                throw exception;
            }
        }
    });
}
exports.getWalletsPublicKeys = getWalletsPublicKeys;
function getTransaction(connector, request) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, kujira_validators_1.validateGetTransactionRequest)(request);
        const response = new common_interfaces_1.ResponseWrapper();
        try {
            response.body = (0, kujira_convertors_1.convertToResponseBody)(yield connector.getTransaction(request));
            response.status = http_status_codes_1.StatusCodes.OK;
            return response;
        }
        catch (exception) {
            if (exception instanceof kujira_types_1.TransactionNotFoundError) {
                throw new error_handler_1.HttpException(http_status_codes_1.StatusCodes.NOT_FOUND, exception.message);
            }
            else {
                throw exception;
            }
        }
    });
}
exports.getTransaction = getTransaction;
function getTransactions(connector, request) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, kujira_validators_1.validateGetTransactionsRequest)(request);
        const response = new common_interfaces_1.ResponseWrapper();
        try {
            response.body = (0, kujira_convertors_1.convertToResponseBody)(yield connector.getTransactions(request));
            response.status = http_status_codes_1.StatusCodes.OK;
            return response;
        }
        catch (exception) {
            if (exception instanceof kujira_types_1.TransactionNotFoundError) {
                throw new error_handler_1.HttpException(http_status_codes_1.StatusCodes.NOT_FOUND, exception.message);
            }
            else {
                throw exception;
            }
        }
    });
}
exports.getTransactions = getTransactions;
function getCurrentBlock(connector, request) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, kujira_validators_1.validateGetCurrentBlockRequest)(request);
        const response = new common_interfaces_1.ResponseWrapper();
        response.body = (0, kujira_convertors_1.convertToResponseBody)(yield connector.getCurrentBlock(request));
        response.status = http_status_codes_1.StatusCodes.OK;
        return response;
    });
}
exports.getCurrentBlock = getCurrentBlock;
function getEstimatedFees(connector, request) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, kujira_validators_1.validateGetEstimatedFeesRequest)(request);
        const response = new common_interfaces_1.ResponseWrapper();
        response.body = (0, kujira_convertors_1.convertToResponseBody)(yield connector.getEstimatedFees(request));
        response.status = http_status_codes_1.StatusCodes.OK;
        return response;
    });
}
exports.getEstimatedFees = getEstimatedFees;
//# sourceMappingURL=kujira.controllers.js.map