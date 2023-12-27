"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketNotFoundError = exports.XRPLishError = exports.TransactionIntentType = exports.OrderType = exports.OrderStatus = exports.TradeType = exports.ISet = exports.IMap = void 0;
const immutable_1 = require("immutable");
exports.IMap = immutable_1.Map;
exports.ISet = immutable_1.Set;
var TradeType;
(function (TradeType) {
    TradeType["BUY"] = "BUY";
    TradeType["SELL"] = "SELL";
    TradeType["UNKNOWN"] = "UNKNOWN";
})(TradeType || (exports.TradeType = TradeType = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["OPEN"] = "OPEN";
    OrderStatus["CANCELED"] = "CANCELED";
    OrderStatus["FILLED"] = "FILLED";
    OrderStatus["PARTIALLY_FILLED"] = "PARTIALLY_FILLED";
    OrderStatus["PENDING_OPEN"] = "PENDING_OPEN";
    OrderStatus["PENDING_CANCEL"] = "PENDING_CANCEL";
    OrderStatus["FAILED"] = "FAILED";
    OrderStatus["OFFER_EXPIRED_OR_UNFUNDED"] = "OFFER_EXPIRED_OR_UNFUNDED";
    OrderStatus["UNKNOWN"] = "UNKNOWN";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var OrderType;
(function (OrderType) {
    OrderType["LIMIT"] = "LIMIT";
    OrderType["PASSIVE"] = "PASSIVE";
    OrderType["IOC"] = "IOC";
    OrderType["FOK"] = "FOK";
    OrderType["SELL"] = "SELL";
})(OrderType || (exports.OrderType = OrderType = {}));
var TransactionIntentType;
(function (TransactionIntentType) {
    TransactionIntentType["OFFER_CREATE_FINALIZED"] = "OfferCreateFinalized";
    TransactionIntentType["OFFER_CANCEL_FINALIZED"] = "OfferCancelFinalized";
    TransactionIntentType["OFFER_PARTIAL_FILL"] = "OfferPartialFill";
    TransactionIntentType["OFFER_FILL"] = "OfferFill";
    TransactionIntentType["OFFER_EXPIRED_OR_UNFUNDED"] = "OfferExpiredOrUnfunded";
    TransactionIntentType["UNKNOWN"] = "UNKNOWN";
})(TransactionIntentType || (exports.TransactionIntentType = TransactionIntentType = {}));
class XRPLishError extends Error {
}
exports.XRPLishError = XRPLishError;
class MarketNotFoundError extends XRPLishError {
}
exports.MarketNotFoundError = MarketNotFoundError;
//# sourceMappingURL=xrpl.types.js.map