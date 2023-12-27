"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBook = exports.parseOrderInfo = exports.parseMarkerInfo = exports.toUtf8 = exports.fromUtf8 = void 0;
const ethers_1 = require("ethers");
const dexalot_constants_1 = require("./dexalot.constants");
const fromUtf8 = (txt) => {
    return ethers_1.utils.formatBytes32String(txt);
};
exports.fromUtf8 = fromUtf8;
const toUtf8 = (txt) => {
    return ethers_1.utils.parseBytes32String(txt);
};
exports.toUtf8 = toUtf8;
const parseMarkerInfo = (marketInfo) => {
    return {
        baseSymbol: (0, exports.toUtf8)(marketInfo.baseSymbol),
        quoteSymbol: (0, exports.toUtf8)(marketInfo.quoteSymbol),
        buyBookId: (0, exports.toUtf8)(marketInfo.buyBookId),
        sellBookId: (0, exports.toUtf8)(marketInfo.sellBookId),
        minTradeAmount: marketInfo.minTradeAmount.toString(),
        maxTradeAmount: marketInfo.maxTradeAmount.toString(),
        auctionPrice: marketInfo.auctionPrice.toString(),
        auctionMode: marketInfo.auctionMode,
        makerRate: marketInfo.makerRate / 10000,
        takerRate: marketInfo.takerRate / 10000,
        baseDecimals: marketInfo.baseDecimals,
        baseDisplayDecimals: marketInfo.baseDisplayDecimals,
        quoteDecimals: marketInfo.quoteDecimals,
        quoteDisplayDecimals: marketInfo.quoteDisplayDecimals,
        allowedSlippagePercent: marketInfo.allowedSlippagePercent,
        addOrderPaused: marketInfo.addOrderPaused,
        pairPaused: marketInfo.pairPaused,
        postOnly: marketInfo.postOnly,
    };
};
exports.parseMarkerInfo = parseMarkerInfo;
const parseOrderInfo = (orderInfo) => {
    return {
        id: orderInfo.id,
        clientOrderId: orderInfo.clientOrderId,
        tradePairId: orderInfo.tradePairId,
        price: orderInfo.price.toString(),
        totalAmount: orderInfo.totalAmount.toString(),
        quantity: orderInfo.quantity.toString(),
        quantityFilled: orderInfo.quantityFilled.toString(),
        totalFee: orderInfo.totalFee.toString(),
        traderaddress: orderInfo.traderaddress,
        side: Object.keys(dexalot_constants_1.OrderSide)[Object.values(dexalot_constants_1.OrderSide).indexOf(orderInfo.side)],
        type1: Object.keys(dexalot_constants_1.OrderType)[Object.values(dexalot_constants_1.OrderType).indexOf(orderInfo.type1)],
        type2: Object.keys(dexalot_constants_1.TimeInForce)[Object.values(dexalot_constants_1.TimeInForce).indexOf(orderInfo.type1)],
        status: Object.keys(dexalot_constants_1.OrderStatus)[Object.values(dexalot_constants_1.OrderStatus).indexOf(orderInfo.status)],
    };
};
exports.parseOrderInfo = parseOrderInfo;
const createBook = (rawBook, timestamps, marketInfo) => {
    const book = [];
    if (rawBook[0].length === timestamps.length) {
        for (let val = 0; val < rawBook[0].length; val++) {
            book.push({
                price: ethers_1.utils
                    .formatUnits(rawBook[0][val], marketInfo.quoteDecimals)
                    .toString(),
                quantity: ethers_1.utils
                    .formatUnits(rawBook[1][val], marketInfo.baseDecimals)
                    .toString(),
                timestamp: Number(timestamps[val]),
            });
        }
    }
    return book;
};
exports.createBook = createBook;
//# sourceMappingURL=dexalot.utils.js.map