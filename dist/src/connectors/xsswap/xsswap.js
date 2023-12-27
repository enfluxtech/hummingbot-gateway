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
exports.Xsswap = void 0;
const ethers_xdc_1 = require("ethers-xdc");
const xsswap_sdk_1 = require("xsswap-sdk");
const xdc_1 = require("../../chains/xdc/xdc");
const config_manager_v2_1 = require("../../services/config-manager-v2");
const error_handler_1 = require("../../services/error-handler");
const logger_1 = require("../../services/logger");
const validators_1 = require("../../services/validators");
const wallet_controllers_1 = require("../../services/wallet/wallet.controllers");
const xsswap_config_1 = require("./xsswap.config");
const xsswap_v2_router_abi_json_1 = __importDefault(require("./xsswap_v2_router_abi.json"));
class Xsswap {
    constructor(network) {
        this.tokenList = {};
        this._ready = false;
        const config = xsswap_config_1.XsswapConfig.config;
        this.xdc = xdc_1.Xdc.getInstance(network);
        this.chainId = this.xdc.chainId;
        this._router = config.routerAddress(network);
        this._ttl = config.ttl;
        this._routerAbi = xsswap_v2_router_abi_json_1.default.abi;
        this._gasLimitEstimate = config.gasLimitEstimate;
    }
    static getInstance(chain, network) {
        if (Xsswap._instances === undefined) {
            Xsswap._instances = {};
        }
        if (!(chain + network in Xsswap._instances)) {
            Xsswap._instances[chain + network] = new Xsswap(network);
        }
        return Xsswap._instances[chain + network];
    }
    getTokenByAddress(address) {
        return this.tokenList[(0, wallet_controllers_1.convertXdcAddressToEthAddress)(address)];
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.xdc.ready()) {
                yield this.xdc.init();
            }
            for (const token of this.xdc.storedTokenList) {
                const ethAddress = (0, wallet_controllers_1.convertXdcAddressToEthAddress)(token.address);
                this.tokenList[ethAddress] = new xsswap_sdk_1.Token(this.chainId, ethAddress, token.decimals, token.symbol, token.name);
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
        return this._ttl;
    }
    getAllowedSlippage(allowedSlippageStr) {
        if (allowedSlippageStr != null && (0, validators_1.isFractionString)(allowedSlippageStr)) {
            const fractionSplit = allowedSlippageStr.split('/');
            return new xsswap_sdk_1.Percent(fractionSplit[0], fractionSplit[1]);
        }
        const allowedSlippage = xsswap_config_1.XsswapConfig.config.allowedSlippage;
        const nd = allowedSlippage.match(config_manager_v2_1.percentRegexp);
        if (nd)
            return new xsswap_sdk_1.Percent(nd[1], nd[2]);
        throw new Error('Encountered a malformed percent string in the config for ALLOWED_SLIPPAGE.');
    }
    estimateSellTrade(baseToken, quoteToken, amount, allowedSlippage) {
        return __awaiter(this, void 0, void 0, function* () {
            const nativeTokenAmount = new xsswap_sdk_1.TokenAmount(baseToken, amount.toString());
            logger_1.logger.info(`Fetching pair data for ${baseToken.address}-${quoteToken.address}.`);
            const pair = yield xsswap_sdk_1.Fetcher.fetchPairData(baseToken, quoteToken, this.xdc.provider);
            const trades = xsswap_sdk_1.Trade.bestTradeExactIn([pair], nativeTokenAmount, quoteToken, { maxHops: 1 });
            if (!trades || trades.length === 0) {
                throw new error_handler_1.UniswapishPriceError(`priceSwapIn: no trade pair found for ${baseToken} to ${quoteToken}.`);
            }
            logger_1.logger.info(`Best trade for ${baseToken.address}-${quoteToken.address}: ${trades[0]}`);
            const expectedAmount = trades[0].minimumAmountOut(this.getAllowedSlippage(allowedSlippage));
            return { trade: trades[0], expectedAmount };
        });
    }
    estimateBuyTrade(quoteToken, baseToken, amount, allowedSlippage) {
        return __awaiter(this, void 0, void 0, function* () {
            const nativeTokenAmount = new xsswap_sdk_1.TokenAmount(baseToken, amount.toString());
            logger_1.logger.info(`Fetching pair data for ${quoteToken.address}-${baseToken.address}.`);
            const pair = yield xsswap_sdk_1.Fetcher.fetchPairData(quoteToken, baseToken, this.xdc.provider);
            const trades = xsswap_sdk_1.Trade.bestTradeExactOut([pair], quoteToken, nativeTokenAmount, { maxHops: 1 });
            if (!trades || trades.length === 0) {
                throw new error_handler_1.UniswapishPriceError(`priceSwapOut: no trade pair found for ${quoteToken.address} to ${baseToken.address}.`);
            }
            logger_1.logger.info(`Best trade for ${quoteToken.address}-${baseToken.address}: ${trades[0]}`);
            const expectedAmount = trades[0].maximumAmountIn(this.getAllowedSlippage(allowedSlippage));
            return { trade: trades[0], expectedAmount };
        });
    }
    executeTrade(wallet, trade, gasPrice, xsswapRouter, ttl, abi, gasLimit, nonce, maxFeePerGas, maxPriorityFeePerGas, allowedSlippage) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = xsswap_sdk_1.Router.swapCallParameters(trade, {
                ttl,
                recipient: wallet.address,
                allowedSlippage: this.getAllowedSlippage(allowedSlippage),
            });
            const contract = new ethers_xdc_1.Contract(xsswapRouter, abi, wallet);
            if (!nonce) {
                nonce = yield this.xdc.nonceManager.getNextNonce(wallet.address);
            }
            let tx;
            if (maxFeePerGas || maxPriorityFeePerGas) {
                tx = yield contract[result.methodName](...result.args, {
                    gasLimit: gasLimit.toFixed(0),
                    value: result.value,
                    nonce: nonce,
                    maxFeePerGas,
                    maxPriorityFeePerGas,
                });
            }
            else {
                tx = yield contract[result.methodName](...result.args, {
                    gasPrice: (gasPrice * 1e9).toFixed(0),
                    gasLimit: gasLimit.toFixed(0),
                    value: result.value,
                    nonce: nonce,
                });
            }
            logger_1.logger.info(tx);
            yield this.xdc.nonceManager.commitNonce(wallet.address, nonce);
            return tx;
        });
    }
}
exports.Xsswap = Xsswap;
//# sourceMappingURL=xsswap.js.map