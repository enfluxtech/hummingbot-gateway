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
exports.Uniswap = void 0;
const error_handler_1 = require("../../services/error-handler");
const validators_1 = require("../../services/validators");
const uniswap_config_1 = require("./uniswap.config");
const uniswap_v2_router_abi_json_1 = __importDefault(require("./uniswap_v2_router_abi.json"));
const smart_order_router_1 = require("@uniswap/smart-order-router");
const router_sdk_1 = require("@uniswap/router-sdk");
const v3_sdk_1 = require("@uniswap/v3-sdk");
const IUniswapV3Pool_json_1 = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");
const IUniswapV3Factory_json_1 = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json");
const sdk_core_1 = require("@uniswap/sdk-core");
const ethers_1 = require("ethers");
const logger_1 = require("../../services/logger");
const config_manager_v2_1 = require("../../services/config-manager-v2");
const ethereum_1 = require("../../chains/ethereum/ethereum");
const polygon_1 = require("../../chains/polygon/polygon");
const utils_1 = require("ethers/lib/utils");
class Uniswap {
    constructor(chain, network) {
        var _a;
        this.tokenList = {};
        this._ready = false;
        const config = uniswap_config_1.UniswapConfig.config;
        if (chain === 'ethereum') {
            this.chain = ethereum_1.Ethereum.getInstance(network);
        }
        else {
            this.chain = polygon_1.Polygon.getInstance(network);
        }
        this.chainId = this.chain.chainId;
        this._ttl = uniswap_config_1.UniswapConfig.config.ttl;
        this._maximumHops = uniswap_config_1.UniswapConfig.config.maximumHops;
        this._alphaRouter = new smart_order_router_1.AlphaRouter({
            chainId: this.chainId,
            provider: this.chain.provider,
        });
        this._routerAbi = uniswap_v2_router_abi_json_1.default.abi;
        this._gasLimitEstimate = uniswap_config_1.UniswapConfig.config.gasLimitEstimate;
        this._router = config.uniswapV3SmartOrderRouterAddress(network);
        if (config.useRouter === false && config.feeTier == null) {
            throw new Error('Must specify fee tier if not using router');
        }
        if (config.useRouter === false && config.quoterContractAddress == null) {
            throw new Error('Must specify quoter contract address if not using router');
        }
        this._useRouter = (_a = config.useRouter) !== null && _a !== void 0 ? _a : true;
        this._feeTier = config.feeTier
            ? v3_sdk_1.FeeAmount[config.feeTier]
            : v3_sdk_1.FeeAmount.MEDIUM;
        this._quoterContractAddress = config.quoterContractAddress(network);
    }
    static getInstance(chain, network) {
        if (Uniswap._instances === undefined) {
            Uniswap._instances = {};
        }
        if (!(chain + network in Uniswap._instances)) {
            Uniswap._instances[chain + network] = new Uniswap(chain, network);
        }
        return Uniswap._instances[chain + network];
    }
    getTokenByAddress(address) {
        return this.tokenList[(0, utils_1.getAddress)(address)];
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.chain.ready()) {
                yield this.chain.init();
            }
            for (const token of this.chain.storedTokenList) {
                this.tokenList[token.address] = new sdk_core_1.Token(this.chainId, token.address, token.decimals, token.symbol, token.name);
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
    get alphaRouter() {
        return this._alphaRouter;
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
            return new sdk_core_1.Percent(fractionSplit[0], fractionSplit[1]);
        }
        const allowedSlippage = uniswap_config_1.UniswapConfig.config.allowedSlippage;
        const nd = allowedSlippage.match(config_manager_v2_1.percentRegexp);
        if (nd)
            return new sdk_core_1.Percent(nd[1], nd[2]);
        throw new Error('Encountered a malformed percent string in the config for ALLOWED_SLIPPAGE.');
    }
    estimateSellTrade(baseToken, quoteToken, amount, allowedSlippage) {
        return __awaiter(this, void 0, void 0, function* () {
            const nativeTokenAmount = sdk_core_1.CurrencyAmount.fromRawAmount(baseToken, amount.toString());
            logger_1.logger.info(`Fetching trade data for ${baseToken.address}-${quoteToken.address}.`);
            if (this._useRouter) {
                const route = yield this._alphaRouter.route(nativeTokenAmount, quoteToken, sdk_core_1.TradeType.EXACT_INPUT, undefined, {
                    maxSwapsPerPath: this.maximumHops,
                });
                if (!route) {
                    throw new error_handler_1.UniswapishPriceError(`priceSwapIn: no trade pair found for ${baseToken.address} to ${quoteToken.address}.`);
                }
                logger_1.logger.info(`Best trade for ${baseToken.address}-${quoteToken.address}: ` +
                    `${route.trade.executionPrice.toFixed(6)}` +
                    `${baseToken.symbol}.`);
                const expectedAmount = route.trade.minimumAmountOut(this.getAllowedSlippage(allowedSlippage));
                return { trade: route.trade, expectedAmount };
            }
            else {
                const pool = yield this.getPool(baseToken, quoteToken, this._feeTier);
                if (!pool) {
                    throw new error_handler_1.UniswapishPriceError(`priceSwapIn: no trade pair found for ${baseToken.address} to ${quoteToken.address}.`);
                }
                const swapRoute = new v3_sdk_1.Route([pool], baseToken, quoteToken);
                const quotedAmount = yield this.getQuote(swapRoute, quoteToken, nativeTokenAmount, sdk_core_1.TradeType.EXACT_INPUT);
                const trade = v3_sdk_1.Trade.createUncheckedTrade({
                    route: swapRoute,
                    inputAmount: nativeTokenAmount,
                    outputAmount: quotedAmount,
                    tradeType: sdk_core_1.TradeType.EXACT_INPUT,
                });
                logger_1.logger.info(`Best trade for ${baseToken.address}-${quoteToken.address}: ` +
                    `${trade.executionPrice.toFixed(6)}` +
                    `${baseToken.symbol}.`);
                const expectedAmount = trade.minimumAmountOut(this.getAllowedSlippage(allowedSlippage));
                return { trade, expectedAmount };
            }
        });
    }
    estimateBuyTrade(quoteToken, baseToken, amount, allowedSlippage) {
        return __awaiter(this, void 0, void 0, function* () {
            const nativeTokenAmount = sdk_core_1.CurrencyAmount.fromRawAmount(baseToken, amount.toString());
            logger_1.logger.info(`Fetching pair data for ${quoteToken.address}-${baseToken.address}.`);
            if (this._useRouter) {
                const route = yield this._alphaRouter.route(nativeTokenAmount, quoteToken, sdk_core_1.TradeType.EXACT_OUTPUT, undefined, {
                    maxSwapsPerPath: this.maximumHops,
                });
                if (!route) {
                    throw new error_handler_1.UniswapishPriceError(`priceSwapOut: no trade pair found for ${quoteToken.address} to ${baseToken.address}.`);
                }
                logger_1.logger.info(`Best trade for ${quoteToken.address}-${baseToken.address}: ` +
                    `${route.trade.executionPrice.invert().toFixed(6)} ` +
                    `${baseToken.symbol}.`);
                const expectedAmount = route.trade.maximumAmountIn(this.getAllowedSlippage(allowedSlippage));
                return { trade: route.trade, expectedAmount };
            }
            else {
                const pool = yield this.getPool(quoteToken, baseToken, this._feeTier);
                if (!pool) {
                    throw new error_handler_1.UniswapishPriceError(`priceSwapOut: no trade pair found for ${quoteToken.address} to ${baseToken.address}.`);
                }
                const swapRoute = new v3_sdk_1.Route([pool], quoteToken, baseToken);
                const quotedAmount = yield this.getQuote(swapRoute, quoteToken, nativeTokenAmount, sdk_core_1.TradeType.EXACT_OUTPUT);
                const trade = v3_sdk_1.Trade.createUncheckedTrade({
                    route: swapRoute,
                    inputAmount: quotedAmount,
                    outputAmount: nativeTokenAmount,
                    tradeType: sdk_core_1.TradeType.EXACT_OUTPUT,
                });
                logger_1.logger.info(`Best trade for ${baseToken.address}-${quoteToken.address}: ` +
                    `${trade.executionPrice.invert().toFixed(6)}` +
                    `${baseToken.symbol}.`);
                const expectedAmount = trade.maximumAmountIn(this.getAllowedSlippage(allowedSlippage));
                return { trade, expectedAmount };
            }
        });
    }
    executeTrade(wallet, trade, gasPrice, uniswapRouter, ttl, _abi, gasLimit, nonce, maxFeePerGas, maxPriorityFeePerGas, allowedSlippage) {
        return __awaiter(this, void 0, void 0, function* () {
            const methodParameters = router_sdk_1.SwapRouter.swapCallParameters(trade, {
                deadlineOrPreviousBlockhash: Math.floor(Date.now() / 1000 + ttl),
                recipient: wallet.address,
                slippageTolerance: this.getAllowedSlippage(allowedSlippage),
            });
            return this.chain.nonceManager.provideNonce(nonce, wallet.address, (nextNonce) => __awaiter(this, void 0, void 0, function* () {
                let tx;
                if (maxFeePerGas !== undefined || maxPriorityFeePerGas !== undefined) {
                    tx = yield wallet.sendTransaction({
                        data: methodParameters.calldata,
                        to: uniswapRouter,
                        gasLimit: gasLimit.toFixed(0),
                        value: methodParameters.value,
                        nonce: nextNonce,
                        maxFeePerGas,
                        maxPriorityFeePerGas,
                    });
                }
                else {
                    tx = yield wallet.sendTransaction({
                        data: methodParameters.calldata,
                        to: uniswapRouter,
                        gasPrice: (gasPrice * 1e9).toFixed(0),
                        gasLimit: gasLimit.toFixed(0),
                        value: methodParameters.value,
                        nonce: nextNonce,
                    });
                }
                logger_1.logger.info(JSON.stringify(tx));
                return tx;
            }));
        });
    }
    getPool(tokenA, tokenB, feeTier) {
        return __awaiter(this, void 0, void 0, function* () {
            const uniswapFactory = new ethers_1.Contract(v3_sdk_1.FACTORY_ADDRESS, IUniswapV3Factory_json_1.abi, this.chain.provider);
            const poolAddress = yield uniswapFactory.getPool(tokenA.address, tokenB.address, feeTier);
            if (poolAddress === ethers_1.constants.AddressZero) {
                return null;
            }
            const poolContract = new ethers_1.Contract(poolAddress, IUniswapV3Pool_json_1.abi, this.chain.provider);
            const [liquidity, slot0] = yield Promise.all([
                poolContract.liquidity(),
                poolContract.slot0(),
            ]);
            const [sqrtPriceX96, tick] = slot0;
            const pool = new v3_sdk_1.Pool(tokenA, tokenB, this._feeTier, sqrtPriceX96, liquidity, tick);
            return pool;
        });
    }
    getQuote(swapRoute, quoteToken, amount, tradeType) {
        return __awaiter(this, void 0, void 0, function* () {
            const { calldata } = yield v3_sdk_1.SwapQuoter.quoteCallParameters(swapRoute, amount, tradeType, { useQuoterV2: true });
            const quoteCallReturnData = yield this.chain.provider.call({
                to: this._quoterContractAddress,
                data: calldata,
            });
            const quoteTokenRawAmount = ethers_1.utils.defaultAbiCoder.decode(['uint256'], quoteCallReturnData);
            const qouteTokenAmount = sdk_core_1.CurrencyAmount.fromRawAmount(quoteToken, quoteTokenRawAmount.toString());
            return qouteTokenAmount;
        });
    }
}
exports.Uniswap = Uniswap;
//# sourceMappingURL=uniswap.js.map