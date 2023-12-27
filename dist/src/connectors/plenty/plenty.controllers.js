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
exports.estimateGas = exports.getFullTokenFromSymbol = exports.trade = exports.price = exports.getPlentyTrade = void 0;
const decimal_js_light_1 = __importDefault(require("decimal.js-light"));
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const error_handler_1 = require("../../services/error-handler");
const base_1 = require("../../services/base");
const logger_1 = require("../../services/logger");
const router_1 = require("./utils/router");
function estimateTradeGasCost(tezosish, plenty, plentyTrade, caller) {
    return __awaiter(this, void 0, void 0, function* () {
        let wallet;
        try {
            process.env.LOG_PLENTY && logger_1.logger.info('\tgetWallet');
            wallet = yield tezosish.getWallet(caller, undefined, true);
        }
        catch (err) {
            logger_1.logger.error(`Tezos: wallet ${caller} not available.`);
            throw new error_handler_1.HttpException(500, error_handler_1.LOAD_WALLET_ERROR_MESSAGE + err, error_handler_1.LOAD_WALLET_ERROR_CODE);
        }
        const address = yield wallet.signer.publicKeyHash();
        process.env.LOG_PLENTY && logger_1.logger.info(`\trouterSwap`);
        const swapParams = yield (0, router_1.routerSwap)(tezosish, plenty, plentyTrade.routeParams.path, plentyTrade.routeParams.minimumTokenOut, address, address, plentyTrade.amountIn);
        process.env.LOG_PLENTY && logger_1.logger.info(`\twallet.estimate.batch`);
        const batchEstimate = yield wallet.estimate.batch(swapParams);
        let gasCost = 0, gasLimitTransaction = 0;
        batchEstimate.forEach(estimate => {
            gasCost += estimate.totalCost;
            gasLimitTransaction += estimate.gasLimit;
        });
        const gasPrice = tezosish.gasPrice / Math.pow(10, 6);
        return { gasCost, gasLimitTransaction, gasPrice };
    });
}
function getPlentyTrade(tezosish, plenty, baseAsset, quoteAsset, baseAmount, tradeSide, allowedSlippage) {
    return __awaiter(this, void 0, void 0, function* () {
        const baseToken = getFullTokenFromSymbol(plenty, baseAsset);
        const quoteToken = getFullTokenFromSymbol(plenty, quoteAsset);
        const requestAmount = new bignumber_js_1.default(baseAmount.toFixed(baseToken.decimals).replace('.', ''));
        let expectedTrade;
        if (tradeSide === 'BUY') {
            process.env.LOG_PLENTY && logger_1.logger.info('\testimateBuyTrade');
            expectedTrade = yield plenty.estimateBuyTrade(tezosish, quoteToken, baseToken, requestAmount, allowedSlippage);
        }
        else {
            process.env.LOG_PLENTY && logger_1.logger.info('\testimateSellTrade');
            expectedTrade = yield plenty.estimateSellTrade(tezosish, baseToken, quoteToken, requestAmount, allowedSlippage);
        }
        return expectedTrade;
    });
}
exports.getPlentyTrade = getPlentyTrade;
function price(tezosish, plenty, req) {
    return __awaiter(this, void 0, void 0, function* () {
        const startTimestamp = Date.now();
        let expectedTrade;
        process.env.LOG_PLENTY && logger_1.logger.info('getPlentyTrade');
        try {
            expectedTrade = yield getPlentyTrade(tezosish, plenty, req.base, req.quote, new decimal_js_light_1.default(req.amount), req.side, req.allowedSlippage);
        }
        catch (e) {
            if (e instanceof Error) {
                throw new error_handler_1.HttpException(500, error_handler_1.PRICE_FAILED_ERROR_MESSAGE + e.message, error_handler_1.PRICE_FAILED_ERROR_CODE);
            }
            else {
                throw new error_handler_1.HttpException(500, error_handler_1.UNKNOWN_ERROR_MESSAGE, error_handler_1.UNKNOWN_ERROR_ERROR_CODE);
            }
        }
        process.env.LOG_PLENTY && logger_1.logger.info('estimateTradeGasCost');
        const { gasCost, gasLimitTransaction, gasPrice } = yield estimateTradeGasCost(tezosish, plenty, expectedTrade.trade);
        const baseToken = getFullTokenFromSymbol(plenty, req.base);
        const quoteToken = getFullTokenFromSymbol(plenty, req.quote);
        process.env.LOG_PLENTY && logger_1.logger.info('return price');
        return {
            network: tezosish.chain,
            timestamp: startTimestamp,
            latency: (0, base_1.latency)(startTimestamp, Date.now()),
            base: baseToken.address,
            quote: quoteToken.address,
            amount: new decimal_js_light_1.default(req.amount).toFixed(baseToken.decimals),
            rawAmount: new decimal_js_light_1.default(req.amount).toFixed(baseToken.decimals).replace('.', ''),
            expectedAmount: new decimal_js_light_1.default(expectedTrade.expectedAmount.toString()).toFixed(quoteToken.decimals),
            price: new decimal_js_light_1.default(expectedTrade.trade.executionPrice.toString()).toFixed(8),
            gasPrice: gasPrice / Math.pow(10, 6),
            gasPriceToken: tezosish.nativeTokenSymbol,
            gasLimit: gasLimitTransaction,
            gasCost: new decimal_js_light_1.default(gasCost).dividedBy(Math.pow(10, 6)).toFixed(6),
        };
    });
}
exports.price = price;
function trade(tezosish, plenty, req) {
    return __awaiter(this, void 0, void 0, function* () {
        const startTimestamp = Date.now();
        const limitPrice = req.limitPrice;
        let expectedTrade;
        try {
            process.env.LOG_PLENTY && logger_1.logger.info('getPlentyTrade');
            expectedTrade = yield getPlentyTrade(tezosish, plenty, req.base, req.quote, new decimal_js_light_1.default(req.amount), req.side, req.allowedSlippage);
        }
        catch (e) {
            if (e instanceof Error) {
                logger_1.logger.error(`Plenty: could not get trade info - ${e.message}`);
                throw new error_handler_1.HttpException(500, error_handler_1.TRADE_FAILED_ERROR_MESSAGE + e.message, error_handler_1.TRADE_FAILED_ERROR_CODE);
            }
            else {
                logger_1.logger.error('Plenty: unknown error trying to get trade info');
                throw new error_handler_1.HttpException(500, error_handler_1.UNKNOWN_ERROR_MESSAGE, error_handler_1.UNKNOWN_ERROR_ERROR_CODE);
            }
        }
        process.env.LOG_PLENTY && logger_1.logger.info('estimateTradeGasCost');
        const { gasCost, gasLimitTransaction, gasPrice } = yield estimateTradeGasCost(tezosish, plenty, expectedTrade.trade, req.address);
        const baseToken = getFullTokenFromSymbol(plenty, req.base);
        const quoteToken = getFullTokenFromSymbol(plenty, req.quote);
        if (req.side === 'BUY') {
            const price = expectedTrade.trade.executionPrice;
            logger_1.logger.info(`Expected execution price is ${price.toString()}, ` +
                `limit price is ${limitPrice}.`);
            if (limitPrice &&
                price.gt(new bignumber_js_1.default(limitPrice))) {
                logger_1.logger.error('Plenty: swap price exceeded limit price for buy trade');
                throw new error_handler_1.HttpException(500, (0, error_handler_1.SWAP_PRICE_EXCEEDS_LIMIT_PRICE_ERROR_MESSAGE)(price.toString(), limitPrice), error_handler_1.SWAP_PRICE_EXCEEDS_LIMIT_PRICE_ERROR_CODE);
            }
            process.env.LOG_PLENTY && logger_1.logger.info('executeTrade');
            const tx = yield plenty.executeTrade(tezosish, expectedTrade.trade);
            logger_1.logger.info(`Trade has been executed, txHash is ${tx.hash}, gasPrice is ${gasPrice}.`);
            process.env.LOG_PLENTY && logger_1.logger.info('return trade');
            return {
                network: tezosish.chain,
                timestamp: startTimestamp,
                latency: (0, base_1.latency)(startTimestamp, Date.now()),
                base: baseToken.address,
                quote: quoteToken.address,
                amount: new decimal_js_light_1.default(req.amount).toFixed(baseToken.decimals),
                rawAmount: new decimal_js_light_1.default(req.amount).toFixed(baseToken.decimals).replace('.', ''),
                expectedIn: new decimal_js_light_1.default(expectedTrade.expectedAmount.toString()).toFixed(quoteToken.decimals),
                price: new decimal_js_light_1.default(price.toString()).toSignificantDigits(8).toString(),
                gasPrice: gasPrice / Math.pow(10, 6),
                gasPriceToken: tezosish.nativeTokenSymbol,
                gasLimit: gasLimitTransaction,
                gasCost: new decimal_js_light_1.default(gasCost).dividedBy(Math.pow(10, 6)).toFixed(6),
                txHash: tx.hash,
                nonce: parseInt(tx.operations[0].counter),
            };
        }
        else {
            const price = expectedTrade.trade.executionPrice;
            logger_1.logger.info(`Expected execution price is ${price.toString()}, ` +
                `limit price is ${limitPrice}.`);
            if (limitPrice &&
                price.lt(new bignumber_js_1.default(limitPrice))) {
                logger_1.logger.error('Plenty: swap price lower than limit price for sell trade');
                throw new error_handler_1.HttpException(500, (0, error_handler_1.SWAP_PRICE_LOWER_THAN_LIMIT_PRICE_ERROR_MESSAGE)(price, limitPrice), error_handler_1.SWAP_PRICE_LOWER_THAN_LIMIT_PRICE_ERROR_CODE);
            }
            process.env.LOG_PLENTY && logger_1.logger.info('executeTrade');
            const tx = yield plenty.executeTrade(tezosish, expectedTrade.trade);
            logger_1.logger.info(`Trade has been executed, txHash is ${tx.hash}, gasPrice is ${gasPrice}.`);
            process.env.LOG_PLENTY && logger_1.logger.info('return trade');
            return {
                network: tezosish.chain,
                timestamp: startTimestamp,
                latency: (0, base_1.latency)(startTimestamp, Date.now()),
                base: baseToken.address,
                quote: quoteToken.address,
                amount: new decimal_js_light_1.default(req.amount).toFixed(baseToken.decimals),
                rawAmount: new decimal_js_light_1.default(req.amount).toFixed(baseToken.decimals).replace('.', ''),
                expectedOut: new decimal_js_light_1.default(expectedTrade.expectedAmount.toString()).toFixed(quoteToken.decimals),
                price: new decimal_js_light_1.default(price.toString()).toSignificantDigits(8).toString(),
                gasPrice: gasPrice / Math.pow(10, 6),
                gasPriceToken: tezosish.nativeTokenSymbol,
                gasLimit: gasLimitTransaction,
                gasCost: new decimal_js_light_1.default(gasCost).dividedBy(Math.pow(10, 6)).toFixed(6),
                txHash: tx.hash,
                nonce: parseInt(tx.operations[0].counter),
            };
        }
    });
}
exports.trade = trade;
function getFullTokenFromSymbol(plenty, tokenSymbol) {
    try {
        return plenty.getTokenBySymbol(tokenSymbol);
    }
    catch (_a) {
        throw new error_handler_1.HttpException(500, error_handler_1.TOKEN_NOT_SUPPORTED_ERROR_MESSAGE + tokenSymbol, error_handler_1.TOKEN_NOT_SUPPORTED_ERROR_CODE);
    }
}
exports.getFullTokenFromSymbol = getFullTokenFromSymbol;
function estimateGas(tezosish, plenty) {
    const gasPrice = tezosish.gasPrice / Math.pow(10, 6);
    const gasLimitTransaction = tezosish.gasLimitTransaction;
    const gasLimitEstimate = plenty.gasLimitEstimate;
    return {
        network: tezosish.chain,
        timestamp: Date.now(),
        gasPrice,
        gasPriceToken: tezosish.nativeTokenSymbol,
        gasLimit: gasLimitTransaction,
        gasCost: new bignumber_js_1.default(Math.ceil(gasPrice * gasLimitEstimate)).dividedBy(Math.pow(10, 6)).toFixed(6),
    };
}
exports.estimateGas = estimateGas;
//# sourceMappingURL=plenty.controllers.js.map