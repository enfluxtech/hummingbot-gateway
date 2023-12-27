"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.PancakeswapLPHelper = void 0;
const error_handler_1 = require("../../services/error-handler");
const pancakeswap_config_1 = require("./pancakeswap.config");
const contracts_1 = require("@ethersproject/contracts");
const swap_sdk_core_1 = require("@pancakeswap/swap-sdk-core");
const v3 = __importStar(require("@pancakeswap/v3-sdk"));
const ethers_1 = require("ethers");
const config_manager_v2_1 = require("../../services/config-manager-v2");
const math = __importStar(require("mathjs"));
const utils_1 = require("ethers/lib/utils");
const binance_smart_chain_1 = require("../../chains/binance-smart-chain/binance-smart-chain");
class PancakeswapLPHelper {
    constructor(chain, network) {
        this.tokenList = {};
        this._ready = false;
        this.chain = binance_smart_chain_1.BinanceSmartChain.getInstance(network);
        this._chainName = chain;
        this.chainId = this.chain.chainId;
        this._alphaRouter = undefined;
        this._router =
            pancakeswap_config_1.PancakeSwapConfig.config.pancakeswapV3SmartOrderRouterAddress(network);
        this._nftManager =
            pancakeswap_config_1.PancakeSwapConfig.config.pancakeswapV3NftManagerAddress(network);
        this._ttl = pancakeswap_config_1.PancakeSwapConfig.config.ttl;
        this._routerAbi =
            require('@pancakeswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json').abi;
        this._nftAbi =
            require('@pancakeswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json').abi;
        this._poolAbi =
            require('@pancakeswap/v3-core/artifacts/contracts/interfaces/IPancakeV3Pool.sol/IPancakeV3Pool.json').abi;
        this.abiDecoder = require('abi-decoder');
        this.abiDecoder.addABI(this._nftAbi);
        this.abiDecoder.addABI(this._routerAbi);
    }
    ready() {
        return this._ready;
    }
    get alphaRouter() {
        return this._alphaRouter;
    }
    get router() {
        return this._router;
    }
    get nftManager() {
        return this._nftManager;
    }
    get ttl() {
        return parseInt(String(Date.now() / 1000)) + this._ttl;
    }
    get routerAbi() {
        return this._routerAbi;
    }
    get nftAbi() {
        return this._nftAbi;
    }
    get poolAbi() {
        return this._poolAbi;
    }
    getTokenByAddress(address) {
        return this.tokenList[(0, utils_1.getAddress)(address)];
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._chainName == 'binance-smart-chain' && !this.chain.ready())
                throw new error_handler_1.InitializationError((0, error_handler_1.SERVICE_UNITIALIZED_ERROR_MESSAGE)('BinanceSmartChain'), error_handler_1.SERVICE_UNITIALIZED_ERROR_CODE);
            for (const token of this.chain.storedTokenList) {
                this.tokenList[token.address] = new swap_sdk_core_1.Token(this.chainId, token.address, token.decimals, token.symbol, token.name);
            }
            this._ready = true;
        });
    }
    getPercentage(rawPercent) {
        const slippage = math.fraction(rawPercent);
        return new swap_sdk_core_1.Percent(slippage.n, slippage.d * 100);
    }
    getSlippagePercentage() {
        const allowedSlippage = pancakeswap_config_1.PancakeSwapConfig.config.allowedSlippage;
        const nd = allowedSlippage.match(config_manager_v2_1.percentRegexp);
        if (nd)
            return new swap_sdk_core_1.Percent(nd[1], nd[2]);
        throw new Error('Encountered a malformed percent string in the config for ALLOWED_SLIPPAGE.');
    }
    getContract(contract, signer) {
        if (contract === 'router') {
            return new contracts_1.Contract(this.router, this.routerAbi, signer);
        }
        else {
            return new contracts_1.Contract(this.nftManager, this.nftAbi, signer);
        }
    }
    getPoolContract(pool, wallet) {
        return new contracts_1.Contract(pool, this.poolAbi, wallet);
    }
    getPoolState(poolAddress, fee) {
        return __awaiter(this, void 0, void 0, function* () {
            const poolContract = this.getPoolContract(poolAddress, this.chain.provider);
            const minTick = v3.nearestUsableTick(v3.TickMath.MIN_TICK, v3.TICK_SPACINGS[fee]);
            const maxTick = v3.nearestUsableTick(v3.TickMath.MAX_TICK, v3.TICK_SPACINGS[fee]);
            const poolDataReq = yield Promise.allSettled([
                poolContract.liquidity(),
                poolContract.slot0(),
                poolContract.ticks(minTick),
                poolContract.ticks(maxTick),
            ]);
            const rejected = poolDataReq.filter((r) => r.status === 'rejected');
            if (rejected.length > 0)
                throw new Error('Unable to fetch pool state');
            const poolData = poolDataReq.filter((r) => r.status === 'fulfilled').map((r) => r.value);
            return {
                liquidity: poolData[0],
                sqrtPriceX96: poolData[1][0],
                tick: poolData[1][1],
                observationIndex: poolData[1][2],
                observationCardinality: poolData[1][3],
                observationCardinalityNext: poolData[1][4],
                feeProtocol: poolData[1][5],
                unlocked: poolData[1][6],
                fee: fee,
                tickProvider: [
                    {
                        index: minTick,
                        liquidityNet: poolData[2][1],
                        liquidityGross: poolData[2][0],
                    },
                    {
                        index: maxTick,
                        liquidityNet: poolData[3][1],
                        liquidityGross: poolData[3][0],
                    },
                ],
            };
        });
    }
    poolPrice(token0, token1, tier, period = 1, interval = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            const fetchPriceTime = [];
            const prices = [];
            const fee = v3.FeeAmount[tier];
            const poolContract = new contracts_1.Contract(v3.Pool.getAddress(token0, token1, fee), this.poolAbi, this.chain.provider);
            for (let x = Math.ceil(period / interval) * interval; x >= 0; x -= interval) {
                fetchPriceTime.push(x);
            }
            try {
                const response = yield poolContract.observe(fetchPriceTime);
                for (let twap = 0; twap < response.tickCumulatives.length - 1; twap++) {
                    prices.push(v3
                        .tickToPrice(token0, token1, Math.ceil(response.tickCumulatives[twap + 1].sub(response.tickCumulatives[twap].toNumber()) / interval))
                        .toFixed(8));
                }
            }
            catch (e) {
                return ['0'];
            }
            return prices;
        });
    }
    getRawPosition(wallet, tokenId) {
        return __awaiter(this, void 0, void 0, function* () {
            const contract = this.getContract('nft', wallet);
            const requests = [contract.positions(tokenId)];
            const positionInfoReq = yield Promise.allSettled(requests);
            const rejected = positionInfoReq.filter((r) => r.status === 'rejected');
            if (rejected.length > 0)
                throw new Error('Unable to fetch position');
            const positionInfo = positionInfoReq.filter((r) => r.status === 'fulfilled').map((r) => r.value);
            return positionInfo[0];
        });
    }
    getReduceLiquidityData(percent, tokenId, token0, token1, wallet) {
        return {
            tokenId: tokenId,
            liquidityPercentage: this.getPercentage(percent),
            slippageTolerance: this.getSlippagePercentage(),
            deadline: this.ttl,
            burnToken: false,
            collectOptions: {
                expectedCurrencyOwed0: swap_sdk_core_1.CurrencyAmount.fromRawAmount(token0, '0'),
                expectedCurrencyOwed1: swap_sdk_core_1.CurrencyAmount.fromRawAmount(token1, '0'),
                recipient: wallet.address,
            },
        };
    }
    addPositionHelper(wallet, token0, token1, amount0, amount1, fee, lowerPrice, upperPrice, tokenId = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            if (token1.sortsBefore(token0)) {
                [token0, token1] = [token1, token0];
                [amount0, amount1] = [amount1, amount0];
                [lowerPrice, upperPrice] = [1 / upperPrice, 1 / lowerPrice];
            }
            const lowerPriceInFraction = math.fraction(lowerPrice);
            const upperPriceInFraction = math.fraction(upperPrice);
            const poolData = yield this.getPoolState(v3.Pool.getAddress(token0, token1, fee), fee);
            const pool = new v3.Pool(token0, token1, poolData.fee, poolData.sqrtPriceX96.toString(), poolData.liquidity.toString(), poolData.tick);
            const addLiquidityOptions = {
                recipient: wallet.address,
                tokenId: tokenId ? tokenId : 0,
            };
            const swapOptions = {
                recipient: wallet.address,
                slippageTolerance: this.getSlippagePercentage(),
                deadline: this.ttl,
            };
            const tickLower = v3.nearestUsableTick(v3.priceToClosestTick(new swap_sdk_core_1.Price(token0, token1, ethers_1.utils
                .parseUnits(lowerPriceInFraction.d.toString(), token0.decimals)
                .toString(), ethers_1.utils
                .parseUnits(lowerPriceInFraction.n.toString(), token1.decimals)
                .toString())), v3.TICK_SPACINGS[fee]);
            const tickUpper = v3.nearestUsableTick(v3.priceToClosestTick(new swap_sdk_core_1.Price(token0, token1, ethers_1.utils
                .parseUnits(upperPriceInFraction.d.toString(), token0.decimals)
                .toString(), ethers_1.utils
                .parseUnits(upperPriceInFraction.n.toString(), token1.decimals)
                .toString())), v3.TICK_SPACINGS[fee]);
            const position = v3.Position.fromAmounts({
                pool: pool,
                tickLower: tickLower === tickUpper ? tickLower - v3.TICK_SPACINGS[fee] : tickLower,
                tickUpper: tickUpper,
                amount0: ethers_1.utils.parseUnits(amount0, token0.decimals).toString(),
                amount1: ethers_1.utils.parseUnits(amount1, token1.decimals).toString(),
                useFullPrecision: true,
            });
            const methodParameters = v3.NonfungiblePositionManager.addCallParameters(position, Object.assign(Object.assign({}, swapOptions), addLiquidityOptions));
            return Object.assign(Object.assign({}, methodParameters), { swapRequired: false });
        });
    }
    reducePositionHelper(wallet, tokenId, decreasePercent) {
        return __awaiter(this, void 0, void 0, function* () {
            const positionData = yield this.getRawPosition(wallet, tokenId);
            const token0 = this.getTokenByAddress(positionData.token0);
            const token1 = this.getTokenByAddress(positionData.token1);
            const fee = positionData.fee;
            if (!token0 || !token1) {
                throw new Error(`One of the tokens in this position isn't recognized. $token0: ${token0}, $token1: ${token1}`);
            }
            const poolAddress = v3.Pool.getAddress(token0, token1, fee);
            const poolData = yield this.getPoolState(poolAddress, fee);
            const position = new v3.Position({
                pool: new v3.Pool(token0, token1, poolData.fee, poolData.sqrtPriceX96.toString(), poolData.liquidity.toString(), poolData.tick),
                tickLower: positionData.tickLower,
                tickUpper: positionData.tickUpper,
                liquidity: positionData.liquidity,
            });
            return v3.NonfungiblePositionManager.removeCallParameters(position, this.getReduceLiquidityData(decreasePercent, tokenId, token0, token1, wallet));
        });
    }
}
exports.PancakeswapLPHelper = PancakeswapLPHelper;
//# sourceMappingURL=pancakeswap.lp.helper.js.map