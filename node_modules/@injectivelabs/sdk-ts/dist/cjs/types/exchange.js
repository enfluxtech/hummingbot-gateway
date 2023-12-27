"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderMaskMap = exports.TradeDirection = exports.TradeExecutionSide = exports.TradeExecutionType = void 0;
const core_proto_ts_1 = require("@injectivelabs/core-proto-ts");
var TradeExecutionType;
(function (TradeExecutionType) {
    TradeExecutionType["Market"] = "market";
    TradeExecutionType["LimitFill"] = "limitFill";
    TradeExecutionType["LimitMatchRestingOrder"] = "limitMatchRestingOrder";
    TradeExecutionType["LimitMatchNewOrder"] = "limitMatchNewOrder";
})(TradeExecutionType = exports.TradeExecutionType || (exports.TradeExecutionType = {}));
var TradeExecutionSide;
(function (TradeExecutionSide) {
    TradeExecutionSide["Maker"] = "maker";
    TradeExecutionSide["Taker"] = "taker";
})(TradeExecutionSide = exports.TradeExecutionSide || (exports.TradeExecutionSide = {}));
var TradeDirection;
(function (TradeDirection) {
    TradeDirection["Buy"] = "buy";
    TradeDirection["Sell"] = "sell";
    TradeDirection["Long"] = "long";
    TradeDirection["Short"] = "short";
})(TradeDirection = exports.TradeDirection || (exports.TradeDirection = {}));
exports.OrderMaskMap = core_proto_ts_1.InjectiveExchangeV1Beta1Exchange.OrderMask;
//# sourceMappingURL=exchange.js.map