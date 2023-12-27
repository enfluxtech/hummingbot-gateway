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
exports.Traderjoe = void 0;
const config_manager_v2_1 = require("../../services/config-manager-v2");
const error_handler_1 = require("../../services/error-handler");
const ethers_1 = require("ethers");
const validators_1 = require("../../services/validators");
const traderjoe_config_1 = require("./traderjoe.config");
const logger_1 = require("../../services/logger");
const avalanche_1 = require("../../chains/avalanche/avalanche");
const sdk_1 = require("@traderjoe-xyz/sdk");
const sdk_v2_1 = require("@traderjoe-xyz/sdk-v2");
const evm_broadcaster_1 = require("../../chains/ethereum/evm.broadcaster");
const viem_1 = require("viem");
const chains_1 = require("viem/chains");
const utils_1 = require("ethers/lib/utils");
const MAX_HOPS = 2;
const BASES = ['USDT', 'USDC', 'WAVAX'];
class Traderjoe {
    constructor(network) {
        this.tokenList = {};
        this.bases = [];
        this._ready = false;
        const config = traderjoe_config_1.TraderjoeConfig.config;
        this.avalanche = avalanche_1.Avalanche.getInstance(network);
        this.chainId = this.avalanche.chainId;
        this._router = config.routerAddress(network);
        this._ttl = config.ttl;
        this._routerAbi = sdk_v2_1.LBRouterV21ABI;
        this._gasLimitEstimate = config.gasLimitEstimate;
        this._client = (0, viem_1.createPublicClient)({
            chain: network === 'avalanche' ? chains_1.avalanche : chains_1.avalancheFuji,
            transport: (0, viem_1.http)(),
        });
    }
    static getInstance(chain, network) {
        if (Traderjoe._instances === undefined) {
            Traderjoe._instances = {};
        }
        if (!(chain + network in Traderjoe._instances)) {
            Traderjoe._instances[chain + network] = new Traderjoe(network);
        }
        return Traderjoe._instances[chain + network];
    }
    getTokenByAddress(address) {
        return this.tokenList[(0, utils_1.getAddress)(address)];
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.avalanche.ready()) {
                yield this.avalanche.init();
            }
            this.bases = [];
            for (const token of this.avalanche.storedTokenList) {
                const tokenObj = new sdk_1.Token(this.chainId, token.address, token.decimals, token.symbol, token.name);
                this.tokenList[token.address] = tokenObj;
                if (BASES.includes(token.symbol))
                    this.bases.push(tokenObj);
            }
            this._ready = true;
        });
    }
    ready() {
        return this._ready;
    }
    get router() {
        return this._router;
    }
    get routerAbi() {
        return this._routerAbi;
    }
    get gasLimitEstimate() {
        return this._gasLimitEstimate;
    }
    get ttl() {
        return Math.floor(new Date().getTime() / 1000) + this._ttl;
    }
    getAllowedSlippage(allowedSlippageStr) {
        if (allowedSlippageStr != null && (0, validators_1.isFractionString)(allowedSlippageStr)) {
            const fractionSplit = allowedSlippageStr.split('/');
            return new sdk_1.Percent(sdk_1.JSBI.BigInt(fractionSplit[0]), sdk_1.JSBI.BigInt(fractionSplit[1]));
        }
        const allowedSlippage = traderjoe_config_1.TraderjoeConfig.config.allowedSlippage;
        const nd = allowedSlippage.match(config_manager_v2_1.percentRegexp);
        if (nd)
            return new sdk_1.Percent(nd[1], nd[2]);
        throw new Error('Encountered a malformed percent string in the config for ALLOWED_SLIPPAGE.');
    }
    getRoutes(inputToken, outputToken) {
        const allTokenPairs = sdk_v2_1.PairV2.createAllTokenPairs(inputToken, outputToken, this.bases);
        const allPairs = sdk_v2_1.PairV2.initPairs(allTokenPairs);
        return sdk_v2_1.RouteV2.createAllRoutes(allPairs, inputToken, outputToken, MAX_HOPS);
    }
    estimateSellTrade(baseToken, quoteToken, amount, allowedSlippage) {
        return __awaiter(this, void 0, void 0, function* () {
            const amountIn = new sdk_1.TokenAmount(baseToken, amount.toString());
            logger_1.logger.info(`Fetching pair data for ${baseToken.address}-${quoteToken.address}.`);
            const allRoutes = this.getRoutes(baseToken, quoteToken);
            const trades = yield sdk_v2_1.TradeV2.getTradesExactIn(allRoutes, amountIn, quoteToken, false, false, this._client, this.avalanche.chainId);
            if (!trades || trades.length === 0) {
                throw new error_handler_1.UniswapishPriceError(`priceSwapIn: no trade pair found for ${baseToken} to ${quoteToken}.`);
            }
            const bestTrade = (sdk_v2_1.TradeV2.chooseBestTrade(trades, true));
            logger_1.logger.info(`Best trade for ${baseToken.address}-${quoteToken.address}: ${bestTrade.toLog()}`);
            const expectedAmount = bestTrade.minimumAmountOut(this.getAllowedSlippage(allowedSlippage));
            return { trade: bestTrade, expectedAmount };
        });
    }
    estimateBuyTrade(quoteToken, baseToken, amount, allowedSlippage) {
        return __awaiter(this, void 0, void 0, function* () {
            const amountIn = new sdk_1.TokenAmount(baseToken, amount.toString());
            logger_1.logger.info(`Fetching pair data for ${quoteToken.address}-${baseToken.address}.`);
            const allRoutes = this.getRoutes(baseToken, quoteToken);
            const trades = yield sdk_v2_1.TradeV2.getTradesExactOut(allRoutes, amountIn, quoteToken, false, false, this._client, this.avalanche.chainId);
            if (!trades || trades.length === 0) {
                throw new error_handler_1.UniswapishPriceError(`priceSwapOut: no trade pair found for ${quoteToken.address} to ${baseToken.address}.`);
            }
            const bestTrade = (sdk_v2_1.TradeV2.chooseBestTrade(trades, false));
            logger_1.logger.info(`Best trade for ${quoteToken.address}-${baseToken.address}: ${bestTrade.toLog()}`);
            const expectedAmount = bestTrade.maximumAmountIn(this.getAllowedSlippage(allowedSlippage));
            return { trade: bestTrade, expectedAmount };
        });
    }
    executeTrade(wallet, trade, gasPrice, traderjoeRouter, ttl, abi, gasLimit, nonce, maxFeePerGas, maxPriorityFeePerGas, allowedSlippage) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = trade.swapCallParameters({
                deadline: ttl,
                recipient: wallet.address,
                allowedSlippage: this.getAllowedSlippage(allowedSlippage),
            });
            const contract = new ethers_1.Contract(traderjoeRouter, abi, wallet);
            let txData;
            if (maxFeePerGas || maxPriorityFeePerGas) {
                txData = yield contract.populateTransaction[result.methodName](...result.args, {
                    gasLimit: gasLimit,
                    value: result.value,
                    maxFeePerGas,
                    maxPriorityFeePerGas,
                });
            }
            else {
                txData = yield contract.populateTransaction[result.methodName](...result.args, {
                    gasPrice: (gasPrice * 1e9).toFixed(0),
                    gasLimit: gasLimit.toFixed(0),
                    value: result.value,
                });
            }
            const tx = yield evm_broadcaster_1.EVMTxBroadcaster.getInstance(this.avalanche, wallet.address).broadcast(txData, nonce);
            logger_1.logger.info(JSON.stringify(tx));
            return tx;
        });
    }
}
exports.Traderjoe = Traderjoe;
//# sourceMappingURL=traderjoe.js.map