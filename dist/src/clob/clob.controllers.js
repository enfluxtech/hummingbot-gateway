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
exports.perpBatchOrders = exports.perpLastTradePrice = exports.perpTrades = exports.perpPositions = exports.perpFundingPayments = exports.perpFundingInfo = exports.perpEstimateGas = exports.perpDeleteOrder = exports.perpPostOrder = exports.perpGetOrders = exports.perpGetTickers = exports.perpGetOrderBooks = exports.perpGetMarkets = exports.estimateGas = exports.batchOrders = exports.deleteOrder = exports.postOrder = exports.getOrders = exports.getTickers = exports.getOrderBooks = exports.getMarkets = void 0;
const base_1 = require("../services/base");
const connection_manager_1 = require("../services/connection-manager");
const error_handler_1 = require("../services/error-handler");
function getMarkets(request) {
    return __awaiter(this, void 0, void 0, function* () {
        const startTimestamp = Date.now();
        yield (0, connection_manager_1.getInitializedChain)(request.chain, request.network);
        const connector = yield (0, connection_manager_1.getConnector)(request.chain, request.network, request.connector);
        const result = yield connector.markets(request);
        return Object.assign({ network: request.network, timestamp: startTimestamp, latency: (0, base_1.latency)(startTimestamp, Date.now()) }, result);
    });
}
exports.getMarkets = getMarkets;
function getOrderBooks(request) {
    return __awaiter(this, void 0, void 0, function* () {
        const startTimestamp = Date.now();
        yield (0, connection_manager_1.getInitializedChain)(request.chain, request.network);
        const connector = yield (0, connection_manager_1.getConnector)(request.chain, request.network, request.connector);
        const result = yield connector.orderBook(request);
        return Object.assign({ network: request.network, timestamp: startTimestamp, latency: (0, base_1.latency)(startTimestamp, Date.now()) }, result);
    });
}
exports.getOrderBooks = getOrderBooks;
function getTickers(request) {
    return __awaiter(this, void 0, void 0, function* () {
        const startTimestamp = Date.now();
        yield (0, connection_manager_1.getInitializedChain)(request.chain, request.network);
        const connector = yield (0, connection_manager_1.getConnector)(request.chain, request.network, request.connector);
        const result = yield connector.ticker(request);
        return Object.assign({ network: request.network, timestamp: startTimestamp, latency: (0, base_1.latency)(startTimestamp, Date.now()) }, result);
    });
}
exports.getTickers = getTickers;
function getOrders(request) {
    return __awaiter(this, void 0, void 0, function* () {
        const startTimestamp = Date.now();
        yield (0, connection_manager_1.getInitializedChain)(request.chain, request.network);
        const connector = yield (0, connection_manager_1.getConnector)(request.chain, request.network, request.connector);
        const result = yield connector.orders(request);
        return Object.assign({ network: request.network, timestamp: startTimestamp, latency: (0, base_1.latency)(startTimestamp, Date.now()) }, result);
    });
}
exports.getOrders = getOrders;
function postOrder(request) {
    return __awaiter(this, void 0, void 0, function* () {
        const startTimestamp = Date.now();
        yield (0, connection_manager_1.getInitializedChain)(request.chain, request.network);
        const connector = yield (0, connection_manager_1.getConnector)(request.chain, request.network, request.connector);
        const result = yield connector.postOrder(request);
        return Object.assign({ network: request.network, timestamp: startTimestamp, latency: (0, base_1.latency)(startTimestamp, Date.now()) }, result);
    });
}
exports.postOrder = postOrder;
function deleteOrder(request) {
    return __awaiter(this, void 0, void 0, function* () {
        const startTimestamp = Date.now();
        yield (0, connection_manager_1.getInitializedChain)(request.chain, request.network);
        const connector = yield (0, connection_manager_1.getConnector)(request.chain, request.network, request.connector);
        const result = yield connector.deleteOrder(request);
        return Object.assign({ network: request.network, timestamp: startTimestamp, latency: (0, base_1.latency)(startTimestamp, Date.now()) }, result);
    });
}
exports.deleteOrder = deleteOrder;
function batchOrders(request) {
    return __awaiter(this, void 0, void 0, function* () {
        const startTimestamp = Date.now();
        yield (0, connection_manager_1.getInitializedChain)(request.chain, request.network);
        const connector = yield (0, connection_manager_1.getConnector)(request.chain, request.network, request.connector);
        const result = yield connector.batchOrders(request);
        return Object.assign({ network: request.network, timestamp: startTimestamp, latency: (0, base_1.latency)(startTimestamp, Date.now()) }, result);
    });
}
exports.batchOrders = batchOrders;
function estimateGas(request) {
    return __awaiter(this, void 0, void 0, function* () {
        const startTimestamp = Date.now();
        yield (0, connection_manager_1.getInitializedChain)(request.chain, request.network);
        const connector = yield (0, connection_manager_1.getConnector)(request.chain, request.network, request.connector);
        const gasEstimates = yield connector.estimateGas(request);
        return Object.assign({ network: request.network, timestamp: startTimestamp, latency: (0, base_1.latency)(startTimestamp, Date.now()) }, gasEstimates);
    });
}
exports.estimateGas = estimateGas;
function perpGetMarkets(request) {
    return __awaiter(this, void 0, void 0, function* () {
        const startTimestamp = Date.now();
        yield (0, connection_manager_1.getInitializedChain)(request.chain, request.network);
        const connector = yield (0, connection_manager_1.getConnector)(request.chain, request.network, request.connector);
        const result = yield connector.markets(request);
        return Object.assign({ network: request.network, timestamp: startTimestamp, latency: (0, base_1.latency)(startTimestamp, Date.now()) }, result);
    });
}
exports.perpGetMarkets = perpGetMarkets;
function perpGetOrderBooks(request) {
    return __awaiter(this, void 0, void 0, function* () {
        const startTimestamp = Date.now();
        yield (0, connection_manager_1.getInitializedChain)(request.chain, request.network);
        const connector = yield (0, connection_manager_1.getConnector)(request.chain, request.network, request.connector);
        const result = yield connector.orderBook(request);
        return Object.assign({ network: request.network, timestamp: startTimestamp, latency: (0, base_1.latency)(startTimestamp, Date.now()) }, result);
    });
}
exports.perpGetOrderBooks = perpGetOrderBooks;
function perpGetTickers(request) {
    return __awaiter(this, void 0, void 0, function* () {
        const startTimestamp = Date.now();
        yield (0, connection_manager_1.getInitializedChain)(request.chain, request.network);
        const connector = yield (0, connection_manager_1.getConnector)(request.chain, request.network, request.connector);
        const result = yield connector.ticker(request);
        return Object.assign({ network: request.network, timestamp: startTimestamp, latency: (0, base_1.latency)(startTimestamp, Date.now()) }, result);
    });
}
exports.perpGetTickers = perpGetTickers;
function perpGetOrders(request) {
    return __awaiter(this, void 0, void 0, function* () {
        const startTimestamp = Date.now();
        yield (0, connection_manager_1.getInitializedChain)(request.chain, request.network);
        const connector = yield (0, connection_manager_1.getConnector)(request.chain, request.network, request.connector);
        const orders = yield connector.orders(request);
        return {
            network: request.network,
            timestamp: startTimestamp,
            latency: (0, base_1.latency)(startTimestamp, Date.now()),
            orders,
        };
    });
}
exports.perpGetOrders = perpGetOrders;
function perpPostOrder(request) {
    return __awaiter(this, void 0, void 0, function* () {
        const startTimestamp = Date.now();
        yield (0, connection_manager_1.getInitializedChain)(request.chain, request.network);
        const connector = yield (0, connection_manager_1.getConnector)(request.chain, request.network, request.connector);
        const result = yield connector.postOrder(request);
        return Object.assign({ network: request.network, timestamp: startTimestamp, latency: (0, base_1.latency)(startTimestamp, Date.now()) }, result);
    });
}
exports.perpPostOrder = perpPostOrder;
function perpDeleteOrder(request) {
    return __awaiter(this, void 0, void 0, function* () {
        const startTimestamp = Date.now();
        yield (0, connection_manager_1.getInitializedChain)(request.chain, request.network);
        const connector = yield (0, connection_manager_1.getConnector)(request.chain, request.network, request.connector);
        const result = yield connector.deleteOrder(request);
        return Object.assign({ network: request.network, timestamp: startTimestamp, latency: (0, base_1.latency)(startTimestamp, Date.now()) }, result);
    });
}
exports.perpDeleteOrder = perpDeleteOrder;
function perpEstimateGas(request) {
    return __awaiter(this, void 0, void 0, function* () {
        const startTimestamp = Date.now();
        yield (0, connection_manager_1.getInitializedChain)(request.chain, request.network);
        const connector = yield (0, connection_manager_1.getConnector)(request.chain, request.network, request.connector);
        const gasEstimates = yield connector.estimateGas(request);
        return Object.assign({ network: request.network, timestamp: startTimestamp, latency: (0, base_1.latency)(startTimestamp, Date.now()) }, gasEstimates);
    });
}
exports.perpEstimateGas = perpEstimateGas;
function perpFundingInfo(request) {
    return __awaiter(this, void 0, void 0, function* () {
        const startTimestamp = Date.now();
        yield (0, connection_manager_1.getInitializedChain)(request.chain, request.network);
        const connector = yield (0, connection_manager_1.getConnector)(request.chain, request.network, request.connector);
        const result = yield connector.fundingInfo(request);
        return {
            network: request.network,
            timestamp: startTimestamp,
            latency: (0, base_1.latency)(startTimestamp, Date.now()),
            fundingInfo: result,
        };
    });
}
exports.perpFundingInfo = perpFundingInfo;
function perpFundingPayments(request) {
    return __awaiter(this, void 0, void 0, function* () {
        const startTimestamp = Date.now();
        yield (0, connection_manager_1.getInitializedChain)(request.chain, request.network);
        const connector = yield (0, connection_manager_1.getConnector)(request.chain, request.network, request.connector);
        const result = yield connector.fundingPayments(request);
        return {
            network: request.network,
            timestamp: startTimestamp,
            latency: (0, base_1.latency)(startTimestamp, Date.now()),
            fundingPayments: result,
        };
    });
}
exports.perpFundingPayments = perpFundingPayments;
function perpPositions(request) {
    return __awaiter(this, void 0, void 0, function* () {
        const startTimestamp = Date.now();
        yield (0, connection_manager_1.getInitializedChain)(request.chain, request.network);
        const connector = yield (0, connection_manager_1.getConnector)(request.chain, request.network, request.connector);
        const result = yield connector.positions(request);
        return {
            network: request.network,
            timestamp: startTimestamp,
            latency: (0, base_1.latency)(startTimestamp, Date.now()),
            positions: result,
        };
    });
}
exports.perpPositions = perpPositions;
function perpTrades(request) {
    return __awaiter(this, void 0, void 0, function* () {
        const startTimestamp = Date.now();
        yield (0, connection_manager_1.getInitializedChain)(request.chain, request.network);
        const connector = yield (0, connection_manager_1.getConnector)(request.chain, request.network, request.connector);
        const trades = yield connector.trades(request);
        return {
            network: request.network,
            timestamp: startTimestamp,
            latency: (0, base_1.latency)(startTimestamp, Date.now()),
            trades,
        };
    });
}
exports.perpTrades = perpTrades;
function perpLastTradePrice(request) {
    return __awaiter(this, void 0, void 0, function* () {
        const startTimestamp = Date.now();
        yield (0, connection_manager_1.getInitializedChain)(request.chain, request.network);
        const connector = yield (0, connection_manager_1.getConnector)(request.chain, request.network, request.connector);
        const lastTradePrice = yield connector.lastTradePrice(request);
        if (lastTradePrice === null) {
            throw new error_handler_1.HttpException(404, error_handler_1.TRADE_NOT_FOUND_ERROR_MESSAGE, error_handler_1.TRADE_NOT_FOUND_ERROR_CODE);
        }
        else {
            return {
                network: request.network,
                timestamp: startTimestamp,
                latency: (0, base_1.latency)(startTimestamp, Date.now()),
                lastTradePrice,
            };
        }
    });
}
exports.perpLastTradePrice = perpLastTradePrice;
function perpBatchOrders(request) {
    return __awaiter(this, void 0, void 0, function* () {
        const startTimestamp = Date.now();
        yield (0, connection_manager_1.getInitializedChain)(request.chain, request.network);
        const connector = yield (0, connection_manager_1.getConnector)(request.chain, request.network, request.connector);
        const result = yield connector.batchPerpOrders(request);
        return Object.assign({ network: request.network, timestamp: startTimestamp, latency: (0, base_1.latency)(startTimestamp, Date.now()) }, result);
    });
}
exports.perpBatchOrders = perpBatchOrders;
//# sourceMappingURL=clob.controllers.js.map