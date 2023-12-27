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
exports.Curve = void 0;
const ethers_1 = require("ethers");
const config_manager_v2_1 = require("../../services/config-manager-v2");
const error_handler_1 = require("../../services/error-handler");
const logger_1 = require("../../services/logger");
const validators_1 = require("../../services/validators");
const curveswap_config_1 = require("./curveswap.config");
const utils_1 = require("ethers/lib/utils");
const polygon_1 = require("../../chains/polygon/polygon");
const ethereum_1 = require("../../chains/ethereum/ethereum");
const evm_broadcaster_1 = require("../../chains/ethereum/evm.broadcaster");
const sdk_1 = require("@uniswap/sdk");
const sdk_core_1 = require("@uniswap/sdk-core");
const exchange_contract_abi_json_1 = require("./exchange.contract.abi.json");
const registry_contract_abi_json_1 = require("./registry.contract.abi.json");
const avalanche_1 = require("../../chains/avalanche/avalanche");
class Curve {
    constructor(chain, network) {
        this.tokenList = {};
        this._ready = false;
        this._config = curveswap_config_1.CurveConfig.config;
        if (chain === 'ethereum') {
            this._chain = ethereum_1.Ethereum.getInstance(network);
        }
        else if (chain === 'avalanche') {
            this._chain = avalanche_1.Avalanche.getInstance(network);
        }
        else if (chain === 'polygon') {
            this._chain = polygon_1.Polygon.getInstance(network);
        }
        else
            throw Error('Chain not supported.');
        this.routerAbi = exchange_contract_abi_json_1.abi;
        this.gasLimitEstimate = this._config.gasLimitEstimate;
    }
    static getInstance(chain, network) {
        if (Curve._instances === undefined) {
            Curve._instances = {};
        }
        if (!(chain + network in Curve._instances)) {
            Curve._instances[chain + network] = new Curve(chain, network);
        }
        return Curve._instances[chain + network];
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._chain.ready())
                throw new error_handler_1.InitializationError((0, error_handler_1.SERVICE_UNITIALIZED_ERROR_MESSAGE)(this._chain.chainName), error_handler_1.SERVICE_UNITIALIZED_ERROR_CODE);
            for (const token of this._chain.storedTokenList) {
                this.tokenList[token.address] = new sdk_1.Token(this._chain.chainId, token.address, token.decimals, token.symbol, token.name);
            }
            const registry = new ethers_1.Contract(this._config.routerAddress(this._chain.chain), registry_contract_abi_json_1.abi, this._chain.provider);
            this.router = yield registry.get_address(2);
            this.curve = new ethers_1.Contract(this.router, this.routerAbi, this._chain.provider);
            this._ready = true;
        });
    }
    getTokenByAddress(address) {
        return this.tokenList[(0, utils_1.getAddress)(address)];
    }
    ready() {
        return this._ready;
    }
    getAllowedSlippage(allowedSlippageStr) {
        if (allowedSlippageStr != null && (0, validators_1.isFractionString)(allowedSlippageStr)) {
            const fractionSplit = allowedSlippageStr.split('/');
            return Number(fractionSplit[0]) / Number(fractionSplit[1]);
        }
        const allowedSlippage = this._config.allowedSlippage;
        const matches = allowedSlippage.match(config_manager_v2_1.percentRegexp);
        if (matches)
            return Number(matches[1]) / Number(matches[2]);
        throw new Error('Encountered a malformed percent string in the config for ALLOWED_SLIPPAGE.');
    }
    estimateBuyTrade(quoteToken, baseToken, amount, allowedSlippage) {
        return __awaiter(this, void 0, void 0, function* () {
            const tradeInfo = yield this.estimateSellTrade(baseToken, quoteToken, amount, allowedSlippage);
            tradeInfo.trade.isBuy = true;
            tradeInfo.trade.executionPrice = tradeInfo.trade.executionPrice.invert();
            return tradeInfo;
        });
    }
    estimateSellTrade(baseToken, quoteToken, amount, _allowedSlippage) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`Fetching pair data for ${quoteToken.address}-${baseToken.address}.`);
            const info = yield this.curve.get_best_rate(baseToken.address, quoteToken.address, amount.toString());
            const pool = info[0];
            if (!pool || pool === '0x0000000000000000000000000000000000000000') {
                throw new error_handler_1.UniswapishPriceError(`No pool found for ${quoteToken.address} to ${baseToken.address}.`);
            }
            return {
                trade: {
                    from: baseToken.address,
                    to: quoteToken.address,
                    amount: Number(amount.toString()),
                    expected: info[1].toString(),
                    executionPrice: new sdk_core_1.Fraction(ethers_1.utils.parseUnits(info[1].toString(), baseToken.decimals).toString(), ethers_1.utils.parseUnits(amount.toString(), quoteToken.decimals).toString()),
                    isBuy: false,
                    pool: pool,
                },
                expectedAmount: new sdk_core_1.Fraction(info[1], '1'),
            };
        });
    }
    executeTrade(wallet, trade, gasPrice, _uniswapRouter, _ttl, _abi, gasLimit, nonce, maxFeePerGas, maxPriorityFeePerGas) {
        return __awaiter(this, void 0, void 0, function* () {
            const castedTrade = trade;
            let overrideParams;
            if (maxFeePerGas || maxPriorityFeePerGas) {
                overrideParams = {
                    gasLimit: gasLimit,
                    value: 0,
                    nonce: nonce,
                    maxFeePerGas,
                    maxPriorityFeePerGas,
                };
            }
            else {
                overrideParams = {
                    gasPrice: (gasPrice * 1e9).toFixed(0),
                    gasLimit: gasLimit.toFixed(0),
                    value: 0,
                    nonce: nonce,
                };
            }
            let tradeParams;
            if (castedTrade.isBuy) {
                tradeParams = {
                    pool: castedTrade.pool,
                    from: castedTrade.to,
                    to: castedTrade.from,
                    amount: castedTrade.expected,
                    expected: String(0.9 * Number(castedTrade.amount)),
                };
            }
            else {
                tradeParams = {
                    pool: castedTrade.pool,
                    from: castedTrade.from,
                    to: castedTrade.to,
                    amount: castedTrade.amount,
                    expected: String(Number(castedTrade.expected.toString()) - 1000000),
                };
            }
            const txData = yield this.curve.populateTransaction['exchange(address,address,address,uint256,uint256)'](...Object.values(tradeParams), Object.assign({}, overrideParams));
            const txResponse = yield evm_broadcaster_1.EVMTxBroadcaster.getInstance(this._chain, wallet.address).broadcast(txData);
            logger_1.logger.info(`Transaction Details: ${JSON.stringify(txResponse.hash)}`);
            return txResponse;
        });
    }
}
exports.Curve = Curve;
//# sourceMappingURL=curve.js.map