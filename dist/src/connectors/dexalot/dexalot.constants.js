"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeInForce = exports.OrderType = exports.OrderSide = exports.OrderStatus = void 0;
exports.OrderStatus = {
    NEW: 0,
    REJECTED: 1,
    PARTIAL: 2,
    FILLED: 3,
    CANCELED: 4,
    EXPIRED: 5,
    KILLED: 6,
};
exports.OrderSide = {
    BUY: 0,
    SELL: 1,
};
exports.OrderType = {
    MARKET: 0,
    LIMIT: 1,
    STOP: 2,
    STOPLIMIT: 3,
};
exports.TimeInForce = {
    GTC: 0,
    FOK: 1,
    IOC: 2,
    PO: 3,
};
//# sourceMappingURL=dexalot.constants.js.map