"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletPublicKeyNotFoundError = exports.TransactionNotFoundError = exports.OrderNotFoundError = exports.TickerNotFoundError = exports.OrderBookNotFoundError = exports.BalanceNotFoundError = exports.MarketNotFoundError = exports.TokenNotFoundError = exports.CLOBishError = exports.RESTfulMethod = exports.RequestStrategy = exports.ConvertOrderType = exports.OrderType = exports.OrderStatus = exports.OrderSide = exports.IMap = void 0;
const immutable_1 = require("immutable");
exports.IMap = immutable_1.Map;
var OrderSide;
(function (OrderSide) {
    OrderSide["BUY"] = "BUY";
    OrderSide["SELL"] = "SELL";
})(OrderSide || (exports.OrderSide = OrderSide = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["OPEN"] = "OPEN";
    OrderStatus["CANCELLED"] = "CANCELLED";
    OrderStatus["PARTIALLY_FILLED"] = "PARTIALLY_FILLED";
    OrderStatus["FILLED"] = "FILLED";
    OrderStatus["CREATION_PENDING"] = "CREATION_PENDING";
    OrderStatus["CANCELLATION_PENDING"] = "CANCELLATION_PENDING";
    OrderStatus["UNKNOWN"] = "UNKNOWN";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var OrderType;
(function (OrderType) {
    OrderType["MARKET"] = "MARKET";
    OrderType["LIMIT"] = "LIMIT";
    OrderType["IOC"] = "IOC";
})(OrderType || (exports.OrderType = OrderType = {}));
var ConvertOrderType;
(function (ConvertOrderType) {
    ConvertOrderType["GET_ORDERS"] = "getOrders";
    ConvertOrderType["PLACE_ORDERS"] = "placeOrders";
    ConvertOrderType["CANCELLED_ORDERS"] = "cancelledOrders";
})(ConvertOrderType || (exports.ConvertOrderType = ConvertOrderType = {}));
var RequestStrategy;
(function (RequestStrategy) {
    RequestStrategy["RESTful"] = "RESTful";
    RequestStrategy["Controller"] = "Controller";
})(RequestStrategy || (exports.RequestStrategy = RequestStrategy = {}));
var RESTfulMethod;
(function (RESTfulMethod) {
    RESTfulMethod["GET"] = "GET";
    RESTfulMethod["POST"] = "POST";
    RESTfulMethod["PUT"] = "PUT";
    RESTfulMethod["PATCH"] = "PATCH";
    RESTfulMethod["DELETE"] = "DELETE";
})(RESTfulMethod || (exports.RESTfulMethod = RESTfulMethod = {}));
class CLOBishError extends Error {
}
exports.CLOBishError = CLOBishError;
class TokenNotFoundError extends CLOBishError {
}
exports.TokenNotFoundError = TokenNotFoundError;
class MarketNotFoundError extends CLOBishError {
}
exports.MarketNotFoundError = MarketNotFoundError;
class BalanceNotFoundError extends CLOBishError {
}
exports.BalanceNotFoundError = BalanceNotFoundError;
class OrderBookNotFoundError extends CLOBishError {
}
exports.OrderBookNotFoundError = OrderBookNotFoundError;
class TickerNotFoundError extends CLOBishError {
}
exports.TickerNotFoundError = TickerNotFoundError;
class OrderNotFoundError extends CLOBishError {
}
exports.OrderNotFoundError = OrderNotFoundError;
class TransactionNotFoundError extends CLOBishError {
}
exports.TransactionNotFoundError = TransactionNotFoundError;
class WalletPublicKeyNotFoundError extends CLOBishError {
}
exports.WalletPublicKeyNotFoundError = WalletPublicKeyNotFoundError;
//# sourceMappingURL=kujira.types.js.map