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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuoteTokenFromMarketId = exports.getBaseTokenFromMarketId = exports.getNetworkId = exports.promiseAllInBatches = exports.sleep = exports.getNotNullOrThrowError = void 0;
const xrpl_constants_1 = __importDefault(require("./../../chains/xrpl/xrpl.constants"));
const xrpl_requests_1 = require("./xrpl.requests");
const getNotNullOrThrowError = (value, errorMessage = 'Value is null or undefined') => {
    if (value === undefined || value === null)
        throw new Error(errorMessage);
    return value;
};
exports.getNotNullOrThrowError = getNotNullOrThrowError;
const sleep = (milliseconds) => new Promise((callback) => setTimeout(callback, milliseconds));
exports.sleep = sleep;
const promiseAllInBatches = (task, items, batchSize = xrpl_constants_1.default.parallel.all.batchSize, delayBetweenBatches = xrpl_constants_1.default.parallel.all.delayBetweenBatches) => __awaiter(void 0, void 0, void 0, function* () {
    let position = 0;
    let results = [];
    if (!batchSize) {
        batchSize = items.length;
    }
    while (position < items.length) {
        const itemsForBatch = items.slice(position, position + batchSize);
        results = [
            ...results,
            ...(yield Promise.all(itemsForBatch.map((item) => task(item)))),
        ];
        position += batchSize;
        if (position < items.length) {
            if (delayBetweenBatches > 0) {
                yield (0, exports.sleep)(delayBetweenBatches);
            }
        }
    }
    return results;
});
exports.promiseAllInBatches = promiseAllInBatches;
function getNetworkId(network = '') {
    switch (network) {
        case 'mainnet':
            return xrpl_requests_1.XRPLNetworkID.MAINNET;
        case 'testnet':
            return xrpl_requests_1.XRPLNetworkID.TESTNET;
        case 'devnet':
            return xrpl_requests_1.XRPLNetworkID.DEVNET;
        default:
            return 0;
    }
}
exports.getNetworkId = getNetworkId;
function getBaseTokenFromMarketId(marketId) {
    return marketId.split('-')[0];
}
exports.getBaseTokenFromMarketId = getBaseTokenFromMarketId;
function getQuoteTokenFromMarketId(marketId) {
    return marketId.split('-')[1];
}
exports.getQuoteTokenFromMarketId = getQuoteTokenFromMarketId;
//# sourceMappingURL=xrpl.helpers.js.map