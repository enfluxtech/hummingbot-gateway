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
exports.Tinyman = void 0;
const tinyman_js_sdk_1 = require("@tinymanorg/tinyman-js-sdk");
const lru_cache_1 = __importDefault(require("lru-cache"));
const mathjs_1 = require("mathjs");
const algorand_1 = require("../../chains/algorand/algorand");
const algorand_config_1 = require("../../chains/algorand/algorand.config");
const config_manager_v2_1 = require("../../services/config-manager-v2");
const error_handler_1 = require("../../services/error-handler");
const logger_1 = require("../../services/logger");
const tinyman_config_1 = require("./tinyman.config");
class Tinyman {
    get swap() {
        return this._swap;
    }
    constructor(network) {
        this._ready = false;
        this._config = tinyman_config_1.TinymanConfig.config;
        this.chain = algorand_1.Algorand.getInstance(network);
        this._swap = tinyman_js_sdk_1.Swap;
    }
    static getInstance(network) {
        const config = (0, algorand_config_1.getAlgorandConfig)(network);
        if (Tinyman._instances === undefined) {
            Tinyman._instances = new lru_cache_1.default({
                max: config.network.maxLRUCacheInstances,
            });
        }
        if (!Tinyman._instances.has(network)) {
            if (network !== null) {
                Tinyman._instances.set(network, new Tinyman(network));
            }
            else {
                throw new Error(`Tinyman.getInstance received an unexpected network: ${network}.`);
            }
        }
        return Tinyman._instances.get(network);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.chain.ready()) {
                yield this.chain.init();
            }
            this._ready = true;
        });
    }
    ready() {
        return this._ready;
    }
    getSlippage() {
        const allowedSlippage = this._config.allowedSlippage;
        const nd = allowedSlippage.match(config_manager_v2_1.percentRegexp);
        let slippage = 0.0;
        if (nd)
            slippage = Number(nd[1]) / Number(nd[2]);
        return slippage;
    }
    fetchData(baseToken, quoteToken) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`Fetching pair data for ${baseToken.symbol}-${quoteToken.symbol}.`);
            return yield tinyman_js_sdk_1.poolUtils.v2.getPoolInfo({
                network: this.chain.network,
                client: this.chain.algod,
                asset1ID: baseToken.assetId,
                asset2ID: quoteToken.assetId,
            });
        });
    }
    estimateTrade(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const baseToken = this.chain.getAssetForSymbol(req.base);
            const quoteToken = this.chain.getAssetForSymbol(req.quote);
            if (baseToken === null || quoteToken === null)
                throw new error_handler_1.HttpException(500, error_handler_1.TOKEN_NOT_SUPPORTED_ERROR_MESSAGE, error_handler_1.TOKEN_NOT_SUPPORTED_ERROR_CODE);
            const baseAsset = { id: baseToken.assetId, decimals: baseToken.decimals };
            const quoteAsset = {
                id: quoteToken.assetId,
                decimals: quoteToken.decimals,
            };
            const amount = Number(req.amount) * (0, mathjs_1.pow)(10, baseToken.decimals);
            const isBuy = req.side === 'BUY';
            const pool = yield this.fetchData(baseToken, quoteToken);
            const quote = yield this.swap.v2.getQuote({
                type: isBuy === true ? tinyman_js_sdk_1.SwapType.FixedOutput : tinyman_js_sdk_1.SwapType.FixedInput,
                amount: Number(amount.toString()),
                assetIn: isBuy === true ? quoteAsset : baseAsset,
                assetOut: isBuy === true ? baseAsset : quoteAsset,
                pool,
                network: this.chain.network,
                isSwapRouterEnabled: false,
            });
            const price = quote.type === tinyman_js_sdk_1.SwapQuoteType.Direct ? quote.data.quote.rate : 0;
            logger_1.logger.info(`Best quote for ${baseToken.symbol}-${quoteToken.symbol}: ` +
                `${price}` +
                `${baseToken.symbol}.`);
            const expectedPrice = isBuy === true ? 1 / price : price;
            const expectedAmount = req.side === 'BUY'
                ? Number(req.amount)
                : expectedPrice * Number(req.amount);
            return { trade: quote, expectedAmount, expectedPrice };
        });
    }
    executeTrade(account, quote, isBuy) {
        return __awaiter(this, void 0, void 0, function* () {
            const network = this.chain.network;
            const fixedSwapTxns = yield this.swap.v2.generateTxns({
                client: this.chain.algod,
                network,
                swapType: isBuy === true ? tinyman_js_sdk_1.SwapType.FixedOutput : tinyman_js_sdk_1.SwapType.FixedInput,
                quote,
                slippage: this.getSlippage(),
                initiatorAddr: account.addr,
            });
            const signedTxns = yield this.swap.v2.signTxns({
                txGroup: fixedSwapTxns,
                initiatorSigner: this.signerWithSecretKey(account),
            });
            const tx = yield this.swap.v2.execute({
                client: this.chain.algod,
                quote,
                txGroup: fixedSwapTxns,
                signedTxns,
            });
            logger_1.logger.info(`Swap transaction Id: ${tx.txnID}`);
            return tx;
        });
    }
    signerWithSecretKey(account) {
        return function (txGroups) {
            const txnsToBeSigned = txGroups.flatMap((txGroup) => txGroup.filter((item) => { var _a; return (_a = item.signers) === null || _a === void 0 ? void 0 : _a.includes(account.addr); }));
            const signedTxns = txnsToBeSigned.map(({ txn }) => txn.signTxn(account.sk));
            return new Promise((resolve) => {
                resolve(signedTxns);
            });
        };
    }
}
exports.Tinyman = Tinyman;
//# sourceMappingURL=tinyman.js.map