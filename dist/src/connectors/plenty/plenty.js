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
exports.Plenty = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const validators_1 = require("../../services/validators");
const plenty_config_1 = require("./plenty.config");
const error_handler_1 = require("../../services/error-handler");
const wrappers_1 = require("./utils/wrappers");
const paths_1 = require("./utils/paths");
const router_1 = require("./utils/router");
const logger_1 = require("../../services/logger");
class Plenty {
    constructor(network) {
        this._tokenList = {};
        this._pools = {};
        this._ready = false;
        this._skipTokens = ['SEB', 'PEPE', 'TKEY-X'];
        this.isPlenty = true;
        const config = plenty_config_1.PlentyConfig.config;
        this._router = config.routerAddress(network);
        this._poolsApi = config.poolsApi(network);
        this._analyticsApi = config.analyticsApi(network);
        this._gasLimitEstimate = config.gasLimitEstimate;
    }
    static getInstance(network) {
        if (Plenty._instances === undefined) {
            Plenty._instances = {};
        }
        if (!(network in Plenty._instances)) {
            Plenty._instances[network] = new Plenty(network);
        }
        return Plenty._instances[network];
    }
    getTokenBySymbol(symbol) {
        return this._tokenList[symbol.toLocaleUpperCase()];
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.ready()) {
                const apiResponse = yield fetch(this._poolsApi);
                const apiJson = yield apiResponse.json();
                for (const poolAddress in apiJson) {
                    const pool = apiJson[poolAddress];
                    pool.token1.symbol = pool.token1.symbol.toUpperCase();
                    pool.token2.symbol = pool.token2.symbol.toUpperCase();
                    pool.token1.pairs = pool.token1.pairs.map((pair) => pair.toUpperCase());
                    pool.token2.pairs = pool.token2.pairs.map((pair) => pair.toUpperCase());
                    if (this._skipTokens.includes(pool.token1.symbol) || this._skipTokens.includes(pool.token2.symbol))
                        continue;
                    let tokensKey = pool.token1.symbol + '-' + pool.token2.symbol;
                    if (pool.token1.symbol > pool.token2.symbol) {
                        tokensKey = pool.token2.symbol + '-' + pool.token1.symbol;
                    }
                    this._pools[tokensKey] = pool;
                    if (!(pool.token1.symbol in this._tokenList)) {
                        this._tokenList[pool.token1.symbol] = pool.token1;
                    }
                    if (!(pool.token2.symbol in this._tokenList)) {
                        this._tokenList[pool.token2.symbol] = pool.token2;
                    }
                }
            }
            this._ready = true;
        });
    }
    ready() {
        return this._ready;
    }
    getPool(token1, token2) {
        let tokensKey = token1 + '-' + token2;
        if (token1 > token2) {
            tokensKey = token2 + '-' + token1;
        }
        const pool = this._pools[tokensKey];
        if (!pool) {
            throw new error_handler_1.UniswapishPriceError(`Plenty priceSwap: no trade pair found for ${token1} to ${token2}.`);
        }
        return pool;
    }
    getAnalytics() {
        return __awaiter(this, void 0, void 0, function* () {
            const apiResponse = yield fetch(this._analyticsApi);
            return yield apiResponse.json();
        });
    }
    get tokenList() {
        return this._tokenList;
    }
    get router() {
        return this._router;
    }
    get gasLimitEstimate() {
        return this._gasLimitEstimate;
    }
    getAllowedSlippage(allowedSlippageStr) {
        if (allowedSlippageStr != null && (0, validators_1.isFractionString)(allowedSlippageStr)) {
            const fractionSplit = allowedSlippageStr.split('/');
            if (fractionSplit[0] !== '0')
                return allowedSlippageStr;
            else
                return plenty_config_1.PlentyConfig.config.allowedSlippage;
        }
        else
            return plenty_config_1.PlentyConfig.config.allowedSlippage;
    }
    estimateSellTrade(tezos, baseToken, quoteToken, amount, allowedSlippage) {
        return __awaiter(this, void 0, void 0, function* () {
            process.env.LOG_PLENTY && logger_1.logger.info('\t\tallPaths');
            const paths = yield (0, paths_1.allPaths)(tezos, this, baseToken.symbol, quoteToken.symbol, true);
            const swapAmount = amount.dividedBy(new bignumber_js_1.default(10).pow(baseToken.decimals));
            const path = (0, wrappers_1.computeAllPathsWrapper)(this, paths.paths, swapAmount, this.getAllowedSlippage(allowedSlippage), paths.swapData);
            return {
                expectedAmount: path.tokenOutAmount,
                trade: {
                    executionPrice: path.exchangeRate,
                    routeParams: path,
                    amountIn: amount,
                }
            };
        });
    }
    estimateBuyTrade(tezos, quoteToken, baseToken, amount, allowedSlippage) {
        return __awaiter(this, void 0, void 0, function* () {
            process.env.LOG_PLENTY && logger_1.logger.info('\t\tallPaths');
            const paths = (0, paths_1.allPaths)(tezos, this, quoteToken.symbol, baseToken.symbol, true);
            process.env.LOG_PLENTY && logger_1.logger.info('\t\tallPathsRev');
            const pathsRev = (0, paths_1.allPaths)(tezos, this, baseToken.symbol, quoteToken.symbol, true);
            const bothPaths = yield Promise.all([paths, pathsRev]);
            const pathsResolved = bothPaths[0];
            const pathsRevResolved = bothPaths[1];
            const swapAmount = amount.dividedBy(new bignumber_js_1.default(10).pow(baseToken.decimals));
            const path = (0, wrappers_1.computeReverseCalculationWrapper)(this, pathsRevResolved.paths, swapAmount, this.getAllowedSlippage(allowedSlippage), pathsRevResolved.swapData, pathsResolved.paths, pathsResolved.swapData);
            return {
                expectedAmount: path.tokenOutAmount,
                trade: {
                    executionPrice: (0, bignumber_js_1.default)(1).dividedBy(path.exchangeRate),
                    routeParams: path,
                    amountIn: path.tokenOutAmount.multipliedBy(Math.pow(10, quoteToken.decimals)),
                }
            };
        });
    }
    executeTrade(tezos, expectedTrade) {
        return __awaiter(this, void 0, void 0, function* () {
            const address = yield tezos.provider.signer.publicKeyHash();
            process.env.LOG_PLENTY && logger_1.logger.info('\t\trouterSwap');
            const swapParams = yield (0, router_1.routerSwap)(tezos, this, expectedTrade.routeParams.path, expectedTrade.routeParams.minimumTokenOut, address, address, expectedTrade.amountIn);
            const batch = tezos.provider.contract.batch(swapParams);
            process.env.LOG_PLENTY && logger_1.logger.info('\t\tbatchSend');
            const batchOp = yield batch.send();
            const status = batchOp.status;
            if (status === "applied") {
                return {
                    hash: batchOp.hash,
                    operations: batchOp.results
                };
            }
            else {
                throw new error_handler_1.UniswapishPriceError('Plenty: trade failed' + status);
            }
        });
    }
}
exports.Plenty = Plenty;
//# sourceMappingURL=plenty.js.map