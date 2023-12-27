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
exports.estimateGas = exports.trade = exports.price = void 0;
const decimal_js_light_1 = __importDefault(require("decimal.js-light"));
const error_handler_1 = require("../../services/error-handler");
const base_1 = require("../../services/base");
const logger_1 = require("../../services/logger");
function price(algorand, tinyman, req) {
    return __awaiter(this, void 0, void 0, function* () {
        const startTimestamp = Date.now();
        let trade;
        try {
            trade = yield tinyman.estimateTrade(req);
        }
        catch (e) {
            if (e instanceof Error) {
                throw new error_handler_1.HttpException(500, error_handler_1.PRICE_FAILED_ERROR_MESSAGE + e.message, error_handler_1.PRICE_FAILED_ERROR_CODE);
            }
            else {
                throw new error_handler_1.HttpException(500, error_handler_1.UNKNOWN_ERROR_MESSAGE, error_handler_1.UNKNOWN_ERROR_ERROR_CODE);
            }
        }
        return {
            network: algorand.network,
            timestamp: startTimestamp,
            latency: (0, base_1.latency)(startTimestamp, Date.now()),
            base: req.base,
            quote: req.quote,
            amount: req.amount,
            rawAmount: req.amount,
            expectedAmount: String(trade.expectedAmount),
            price: String(trade.expectedPrice),
            gasPrice: algorand.gasPrice,
            gasPriceToken: algorand.nativeTokenSymbol,
            gasLimit: algorand.gasLimit,
            gasCost: String(algorand.gasCost),
        };
    });
}
exports.price = price;
function trade(algorand, tinyman, req) {
    return __awaiter(this, void 0, void 0, function* () {
        const startTimestamp = Date.now();
        const limitPrice = req.limitPrice;
        const account = yield algorand.getAccountFromAddress(req.address);
        let trade;
        try {
            trade = yield tinyman.estimateTrade(req);
        }
        catch (e) {
            throw new error_handler_1.HttpException(500, error_handler_1.TRADE_FAILED_ERROR_MESSAGE, error_handler_1.TRADE_FAILED_ERROR_CODE);
        }
        const estimatedPrice = trade.expectedPrice;
        logger_1.logger.info(`Expected execution price is ${estimatedPrice}, ` +
            `limit price is ${limitPrice}.`);
        if (req.side === 'BUY') {
            if (limitPrice && new decimal_js_light_1.default(estimatedPrice).gt(new decimal_js_light_1.default(limitPrice))) {
                logger_1.logger.error('Swap price exceeded limit price.');
                throw new error_handler_1.HttpException(500, (0, error_handler_1.SWAP_PRICE_EXCEEDS_LIMIT_PRICE_ERROR_MESSAGE)(estimatedPrice, limitPrice), error_handler_1.SWAP_PRICE_EXCEEDS_LIMIT_PRICE_ERROR_CODE);
            }
        }
        else {
            if (limitPrice && new decimal_js_light_1.default(estimatedPrice).lt(new decimal_js_light_1.default(limitPrice))) {
                logger_1.logger.error('Swap price lower than limit price.');
                throw new error_handler_1.HttpException(500, (0, error_handler_1.SWAP_PRICE_LOWER_THAN_LIMIT_PRICE_ERROR_MESSAGE)(estimatedPrice, limitPrice), error_handler_1.SWAP_PRICE_LOWER_THAN_LIMIT_PRICE_ERROR_CODE);
            }
        }
        const tx = yield tinyman.executeTrade(account, trade.trade, req.side === 'BUY');
        logger_1.logger.info(`${req.side} swap has been executed.`);
        return {
            network: algorand.network,
            timestamp: startTimestamp,
            latency: (0, base_1.latency)(startTimestamp, Date.now()),
            base: req.base,
            quote: req.quote,
            amount: req.amount,
            rawAmount: req.amount,
            expectedIn: String(trade.expectedAmount),
            price: String(estimatedPrice),
            gasPrice: algorand.gasPrice,
            gasPriceToken: algorand.nativeTokenSymbol,
            gasLimit: algorand.gasLimit,
            gasCost: String(algorand.gasCost),
            txHash: tx.txnID,
        };
    });
}
exports.trade = trade;
function estimateGas(algorand, _tinyman) {
    return __awaiter(this, void 0, void 0, function* () {
        return {
            network: algorand.network,
            timestamp: Date.now(),
            gasPrice: algorand.gasPrice,
            gasPriceToken: algorand.nativeTokenSymbol,
            gasLimit: algorand.gasLimit,
            gasCost: String(algorand.gasCost),
        };
    });
}
exports.estimateGas = estimateGas;
//# sourceMappingURL=tinyman.controllers.js.map