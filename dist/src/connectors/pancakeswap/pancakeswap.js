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
exports.PancakeSwap = void 0;
const sdk_1 = require("@pancakeswap/sdk");
const binance_smart_chain_1 = require("../../chains/binance-smart-chain/binance-smart-chain");
const config_manager_v2_1 = require("../../services/config-manager-v2");
const error_handler_1 = require("../../services/error-handler");
const logger_1 = require("../../services/logger");
const validators_1 = require("../../services/validators");
const pancakeswap_config_1 = require("./pancakeswap.config");
const pancakeswap_router_abi_json_1 = __importDefault(require("./pancakeswap_router_abi.json"));
const viem_1 = require("viem");
const graphql_request_1 = require("graphql-request");
const smart_router_1 = require("@pancakeswap/smart-router");
const chains_1 = require("@wagmi/chains");
class PancakeSwap {
    constructor(chain, network) {
        var _a;
        this.tokenList = {};
        this._ready = false;
        const config = pancakeswap_config_1.PancakeSwapConfig.config;
        this.bsc = binance_smart_chain_1.BinanceSmartChain.getInstance(network);
        this.chainId = this.bsc.chainId;
        this._chain = chain;
        this._router = config.routerAddress(network);
        this._ttl = config.ttl;
        this._maximumHops = (_a = config.maximumHops) !== null && _a !== void 0 ? _a : 1;
        this._routerAbi = pancakeswap_router_abi_json_1.default.abi;
        this._gasLimitEstimate = config.gasLimitEstimate;
    }
    static getInstance(chain, network) {
        if (PancakeSwap._instances === undefined) {
            PancakeSwap._instances = {};
        }
        if (!(chain + network in PancakeSwap._instances)) {
            PancakeSwap._instances[chain + network] = new PancakeSwap(chain, network);
        }
        return PancakeSwap._instances[chain + network];
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._chain == 'binance-smart-chain' && !this.bsc.ready())
                throw new error_handler_1.InitializationError((0, error_handler_1.SERVICE_UNITIALIZED_ERROR_MESSAGE)('BinanceSmartChain'), error_handler_1.SERVICE_UNITIALIZED_ERROR_CODE);
            for (const token of this.bsc.storedTokenList) {
                this.tokenList[token.address] = new sdk_1.Token(this.chainId, token.address, token.decimals, token.symbol, token.name);
            }
            this._ready = true;
        });
    }
    getTokenByAddress(address) {
        return this.tokenList[(0, viem_1.getAddress)(address)];
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
        return this._ttl;
    }
    get maximumHops() {
        return this._maximumHops;
    }
    getAllowedSlippage(allowedSlippageStr) {
        if (allowedSlippageStr != null && (0, validators_1.isFractionString)(allowedSlippageStr)) {
            const fractionSplit = allowedSlippageStr.split('/');
            return new sdk_1.Percent(fractionSplit[0], fractionSplit[1]);
        }
        const allowedSlippage = pancakeswap_config_1.PancakeSwapConfig.config.allowedSlippage;
        const matches = allowedSlippage.match(config_manager_v2_1.percentRegexp);
        if (matches)
            return new sdk_1.Percent(matches[1], matches[2]);
        throw new Error('Encountered a malformed percent string in the config for ALLOWED_SLIPPAGE.');
    }
    estimateBuyTrade(quoteToken, baseToken, amount, _allowedSlippage) {
        return __awaiter(this, void 0, void 0, function* () {
            const nativeTokenAmount = sdk_1.CurrencyAmount.fromRawAmount(baseToken, amount.toString());
            logger_1.logger.info(`Fetching pair data for ${quoteToken.address}-${baseToken.address}.`);
            const quoteProvider = smart_router_1.SmartRouter.createQuoteProvider({
                onChainProvider: () => this.createPublicClient(),
            });
            const pools = yield this.getPools(baseToken, quoteToken);
            const trade = yield smart_router_1.SmartRouter.getBestTrade(nativeTokenAmount, quoteToken, sdk_1.TradeType.EXACT_OUTPUT, {
                gasPriceWei: () => this.createPublicClient().getGasPrice(),
                maxHops: this._maximumHops,
                maxSplits: 1,
                poolProvider: smart_router_1.SmartRouter.createStaticPoolProvider(pools),
                quoteProvider,
                quoterOptimization: true,
            });
            if (!trade) {
                throw new error_handler_1.UniswapishPriceError(`priceSwapOut: no trade pair found for ${baseToken.address} to ${quoteToken.address}.`);
            }
            logger_1.logger.info(`Best trade for ${baseToken.address}-${quoteToken.address}: ` +
                `${trade.inputAmount.toExact()}` +
                `${baseToken.symbol}.`);
            return {
                trade: Object.assign(Object.assign({}, trade), { executionPrice: smart_router_1.SmartRouter.getExecutionPrice(trade) }),
                expectedAmount: trade.inputAmount,
            };
        });
    }
    estimateSellTrade(baseToken, quoteToken, amount, _allowedSlippage) {
        return __awaiter(this, void 0, void 0, function* () {
            const nativeTokenAmount = sdk_1.CurrencyAmount.fromRawAmount(baseToken, amount.toString());
            logger_1.logger.info(`Fetching pair data for ${baseToken.address}-${quoteToken.address}.`);
            const quoteProvider = smart_router_1.SmartRouter.createQuoteProvider({
                onChainProvider: () => this.createPublicClient(),
            });
            const pools = yield this.getPools(baseToken, quoteToken);
            const trade = yield smart_router_1.SmartRouter.getBestTrade(nativeTokenAmount, quoteToken, sdk_1.TradeType.EXACT_INPUT, {
                gasPriceWei: () => this.createPublicClient().getGasPrice(),
                maxHops: this._maximumHops,
                maxSplits: 1,
                poolProvider: smart_router_1.SmartRouter.createStaticPoolProvider(pools),
                quoteProvider,
                quoterOptimization: true,
            });
            if (!trade) {
                throw new error_handler_1.UniswapishPriceError(`priceSwapIn: no trade pair found for ${baseToken.address} to ${quoteToken.address}.`);
            }
            logger_1.logger.info(`Best trade for ${baseToken.address}-${quoteToken.address}: ` +
                `${trade.outputAmount.toExact()}` +
                `${baseToken.symbol}.`);
            return {
                trade: Object.assign(Object.assign({}, trade), { executionPrice: smart_router_1.SmartRouter.getExecutionPrice(trade) }),
                expectedAmount: trade.outputAmount,
            };
        });
    }
    executeTrade(wallet, trade, gasPrice, pancakeswapRouter, ttl, _abi, gasLimit, nonce, maxFeePerGas, maxPriorityFeePerGas, allowedSlippage) {
        return __awaiter(this, void 0, void 0, function* () {
            const methodParameters = smart_router_1.SwapRouter.swapCallParameters(trade, {
                deadlineOrPreviousBlockhash: Math.floor(Date.now() / 1000 + ttl),
                recipient: (0, viem_1.getAddress)(wallet.address),
                slippageTolerance: this.getAllowedSlippage(allowedSlippage),
            });
            if (nonce === undefined) {
                nonce = yield this.bsc.nonceManager.getNextNonce(wallet.address);
            }
            let tx;
            if (maxFeePerGas !== undefined || maxPriorityFeePerGas !== undefined) {
                tx = yield wallet.sendTransaction({
                    data: methodParameters.calldata,
                    to: pancakeswapRouter,
                    gasLimit: gasLimit.toFixed(0),
                    value: methodParameters.value,
                    nonce: nonce,
                    maxFeePerGas,
                    maxPriorityFeePerGas,
                });
            }
            else {
                tx = yield wallet.sendTransaction({
                    data: methodParameters.calldata,
                    to: pancakeswapRouter,
                    gasPrice: (gasPrice * 1e9).toFixed(0),
                    gasLimit: gasLimit.toFixed(0),
                    value: methodParameters.value,
                    nonce: nonce,
                });
            }
            logger_1.logger.info(`Transaction Details: ${JSON.stringify(tx)}`);
            yield this.bsc.nonceManager.commitNonce(wallet.address, nonce);
            return tx;
        });
    }
    getPools(currencyA, currencyB) {
        return __awaiter(this, void 0, void 0, function* () {
            const v3SubgraphClient = new graphql_request_1.GraphQLClient('https://api.thegraph.com/subgraphs/name/pancakeswap/exchange-v3-bsc');
            const v2SubgraphClient = new graphql_request_1.GraphQLClient('https://proxy-worker-api.pancakeswap.com/bsc-exchange');
            const pairs = smart_router_1.SmartRouter.getPairCombinations(currencyA, currencyB);
            const getV2PoolsByCommonTokenPrices = smart_router_1.SmartRouter.createV2PoolsProviderByCommonTokenPrices(smart_router_1.SmartRouter.getCommonTokenPricesBySubgraph);
            const getV2CandidatePools = smart_router_1.SmartRouter.createGetV2CandidatePools(getV2PoolsByCommonTokenPrices);
            const getV3CandidatePools = smart_router_1.SmartRouter.createGetV3CandidatePools(smart_router_1.SmartRouter.getV3PoolsWithTvlFromOnChain, {
                fallbacks: [],
                fallbackTimeout: 1500,
            });
            const allPools = yield Promise.allSettled([
                smart_router_1.SmartRouter.getStablePoolsOnChain(pairs, () => this.createPublicClient()),
                getV2CandidatePools({
                    onChainProvider: () => this.createPublicClient(),
                    v2SubgraphProvider: () => v2SubgraphClient,
                    v3SubgraphProvider: () => v3SubgraphClient,
                    currencyA,
                    currencyB,
                }),
                getV3CandidatePools({
                    onChainProvider: () => this.createPublicClient(),
                    subgraphProvider: () => v3SubgraphClient,
                    currencyA,
                    currencyB,
                    subgraphCacheFallback: true,
                }),
            ]);
            const fulfilledPools = allPools.reduce((acc, pool) => {
                if (pool.status === 'fulfilled') {
                    return [...acc, ...pool.value];
                }
                return acc;
            }, []);
            return fulfilledPools.flat();
        });
    }
    createPublicClient() {
        const transportUrl = this.bsc.rpcUrl;
        return (0, viem_1.createPublicClient)({
            chain: this.chainId === 56 ? chains_1.bsc : chains_1.bscTestnet,
            transport: (0, viem_1.http)(transportUrl),
            batch: {
                multicall: {
                    batchSize: 1024 * 200,
                },
            },
        });
    }
}
exports.PancakeSwap = PancakeSwap;
//# sourceMappingURL=pancakeswap.js.map