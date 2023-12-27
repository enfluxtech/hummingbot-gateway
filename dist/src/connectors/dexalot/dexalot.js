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
exports.DexalotCLOB = void 0;
const ethers_1 = require("ethers");
const dexalot_clob_config_1 = require("./dexalot.clob.config");
const lru_cache_1 = __importDefault(require("lru-cache"));
const base_1 = require("../../services/base");
const logger_1 = require("../../services/logger");
const avalanche_1 = require("../../chains/avalanche/avalanche");
const evm_broadcaster_1 = require("../../chains/ethereum/evm.broadcaster");
const dexalot_constants_1 = require("./dexalot.constants");
const lodash_1 = require("lodash");
const path_1 = __importDefault(require("path"));
const paths_1 = require("../../paths");
const dexalot_utils_1 = require("./dexalot.utils");
class DexalotCLOB {
    constructor(network) {
        this._ready = false;
        this.parsedMarkets = [];
        this.abiDecoder = require('abi-decoder');
        this._chain = avalanche_1.Avalanche.getInstance(network);
        this._conf = dexalot_clob_config_1.DexalotCLOBConfig.config;
        this._resources = require(path_1.default.join((0, paths_1.rootPath)(), 'src/connectors/dexalot/dexalot_mainnet.json'));
        this._portfolioContract = this.getContract('PortfolioSub', this._resources);
        this._tradePairsContract = this.getContract('TradePairs', this._resources);
    }
    get tradePairsContract() {
        return this._tradePairsContract;
    }
    set tradePairsContract(value) {
        this._tradePairsContract = value;
    }
    getContract(name, data) {
        const validContractNames = [
            'ExchangeSub',
            'PortfolioSub',
            'OrderBooks',
            'TradePairs',
            'GasStation',
        ];
        if (!validContractNames.includes(name)) {
            logger_1.logger.error(`${name} has to be one of ${validContractNames.join(',')}`);
            throw Error('Invalid contract name.');
        }
        const info = data.filter((entry) => entry.contract_name === name)[0];
        this.abiDecoder.addABI(info.abi.abi);
        return new ethers_1.Contract(info.address, info.abi.abi, this._chain.provider);
    }
    static getInstance(network) {
        if (DexalotCLOB._instances === undefined) {
            DexalotCLOB._instances = new lru_cache_1.default({
                max: dexalot_clob_config_1.DexalotCLOBConfig.config.maxLRUCacheInstances,
            });
        }
        if (!DexalotCLOB._instances.has(network)) {
            DexalotCLOB._instances.set(network, new DexalotCLOB(network));
        }
        return DexalotCLOB._instances.get(network);
    }
    loadMarkets() {
        return __awaiter(this, void 0, void 0, function* () {
            const rawMarkets = (yield Promise.all((yield this.tradePairsContract.getTradePairs()).map((marketId) => __awaiter(this, void 0, void 0, function* () {
                return this.tradePairsContract.getTradePair(marketId);
            })))).map(dexalot_utils_1.parseMarkerInfo);
            for (const market of rawMarkets) {
                this.parsedMarkets[market.baseSymbol.toUpperCase() + '-' + market.quoteSymbol.toUpperCase()] = market;
            }
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._chain.ready() || Object.keys(this.parsedMarkets).length === 0) {
                yield this._chain.init();
                yield this.loadMarkets();
                this._ready = true;
            }
        });
    }
    ready() {
        return this._ready;
    }
    balances(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokens = req.tokenSymbols.map((symbol) => {
                return this._chain.getTokenBySymbol(symbol);
            });
            const balances = yield Promise.all(req.tokenSymbols.map((symbol) => {
                return this._portfolioContract.getBalance(req.address, (0, dexalot_utils_1.fromUtf8)(symbol));
            }));
            const formattedBalances = { available: {}, total: {} };
            for (const token of tokens) {
                const index = (0, lodash_1.indexOf)(tokens, token);
                if (token) {
                    formattedBalances.available[req.tokenSymbols[index]] =
                        (0, base_1.bigNumberWithDecimalToStr)(balances[index].available, token.decimals);
                    formattedBalances.total[req.tokenSymbols[index]] =
                        (0, base_1.bigNumberWithDecimalToStr)(balances[index].total, token.decimals);
                }
            }
            return formattedBalances;
        });
    }
    markets(req) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.market && req.market in this.parsedMarkets)
                return { markets: this.parsedMarkets[req.market] };
            return { markets: Object.values(this.parsedMarkets) };
        });
    }
    orderBook(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const markerId = this.getDexalotTradingPair(req.market);
            const books = yield Promise.all([
                this.tradePairsContract.getNBook(markerId, dexalot_constants_1.OrderSide.BUY, 50, 50, 0, (0, dexalot_utils_1.fromUtf8)('')),
                this.tradePairsContract.getNBook(markerId, dexalot_constants_1.OrderSide.SELL, 50, 50, 0, (0, dexalot_utils_1.fromUtf8)('')),
            ]);
            const buys = [
                books[0][0].map((value) => {
                    return value.toString();
                }),
                books[0][1].map((value) => {
                    return value.toString();
                }),
            ];
            const sells = [
                books[1][0].map((value) => {
                    return value.toString();
                }),
                books[1][1].map((value) => {
                    return value.toString();
                }),
            ];
            const timestamps = [...buys[0]].fill(Date.now().toString());
            return {
                buys: (0, dexalot_utils_1.createBook)(buys, timestamps, this.parsedMarkets[req.market]),
                sells: (0, dexalot_utils_1.createBook)(sells, timestamps, this.parsedMarkets[req.market]),
            };
        });
    }
    ticker(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.markets(req);
        });
    }
    orders(req) {
        return __awaiter(this, void 0, void 0, function* () {
            let order;
            const marketInfo = this.parsedMarkets[req.market];
            if (req.address) {
                order = [
                    yield this.tradePairsContract.getOrderByClientOrderId(req.address, req.orderId),
                ].map(dexalot_utils_1.parseOrderInfo)[0];
            }
            else {
                order = [yield this.tradePairsContract.getOrder(req.orderId)].map(dexalot_utils_1.parseOrderInfo)[0];
            }
            order.price = ethers_1.utils.formatUnits(order.price, marketInfo.quoteDecimals);
            order.totalAmount = ethers_1.utils.formatUnits(order.totalAmount, marketInfo.baseDecimals);
            order.quantity = ethers_1.utils.formatUnits(order.quantity, marketInfo.baseDecimals);
            order.quantityFilled = ethers_1.utils.formatUnits(order.quantityFilled, marketInfo.baseDecimals);
            order.totalFee = ethers_1.utils.formatUnits(order.totalFee, marketInfo.baseDecimals);
            return {
                orders: [order],
            };
        });
    }
    postOrder(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const market = this.parsedMarkets[req.market];
            if (market === undefined)
                throw Error('Invalid market');
            const clientOrderID = req.clientOrderID || (yield this.getClientOrderId(req.address));
            const txData = yield this.tradePairsContract.populateTransaction.addOrder(req.address, clientOrderID, this.getDexalotTradingPair(req.market), ethers_1.utils.parseUnits((0, base_1.floatStringWithDecimalToFixed)(req.price, market.quoteDisplayDecimals) ||
                req.price, market.quoteDecimals), ethers_1.utils.parseUnits((0, base_1.floatStringWithDecimalToFixed)(req.amount, market.baseDisplayDecimals) ||
                req.price, market.baseDecimals), dexalot_constants_1.OrderSide[req.side.toUpperCase()], req.orderType.startsWith('LIMIT') ? dexalot_constants_1.OrderType.LIMIT : dexalot_constants_1.OrderType.MARKET, req.orderType === 'LIMIT_MAKER' ? dexalot_constants_1.TimeInForce.PO : dexalot_constants_1.TimeInForce.GTC);
            txData.gasLimit = ethers_1.BigNumber.from(String(this._conf.gasLimitEstimate));
            const txResponse = yield evm_broadcaster_1.EVMTxBroadcaster.getInstance(this._chain, req.address).broadcast(txData);
            return { txHash: txResponse.hash, clientOrderID };
        });
    }
    deleteOrder(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const txData = yield this.tradePairsContract.populateTransaction.cancelOrder(req.orderId);
            txData.gasLimit = ethers_1.BigNumber.from(String(this._conf.gasLimitEstimate));
            const txResponse = yield evm_broadcaster_1.EVMTxBroadcaster.getInstance(this._chain, req.address).broadcast(txData);
            return { txHash: txResponse.hash };
        });
    }
    estimateGas(_req) {
        return {
            gasPrice: this._chain.gasPrice,
            gasPriceToken: this._chain.nativeTokenSymbol,
            gasLimit: this._conf.gasLimitEstimate,
            gasCost: this._chain.gasPrice * this._conf.gasLimitEstimate,
        };
    }
    batchOrders(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.orderUpdate(req);
        });
    }
    orderUpdate(req) {
        return __awaiter(this, void 0, void 0, function* () {
            let txData = {};
            let data = {
                txData: {},
                clientOrderID: [],
            };
            if (req.createOrderParams) {
                data = yield this.buildPostOrder(req.createOrderParams, req.address);
                txData = data.txData;
            }
            else if (req.cancelOrderParams)
                txData = yield this.buildDeleteOrder(req.cancelOrderParams);
            txData.gasLimit = ethers_1.BigNumber.from(String(this._conf.gasLimitEstimate));
            const txResponse = yield evm_broadcaster_1.EVMTxBroadcaster.getInstance(this._chain, req.address).broadcast(txData);
            return { txHash: txResponse.hash, clientOrderID: data.clientOrderID };
        });
    }
    buildPostOrder(orderParams, address) {
        return __awaiter(this, void 0, void 0, function* () {
            const clientOrderID = [];
            const prices = [];
            const amounts = [];
            const sides = [];
            const types = [];
            const market = orderParams[0].market;
            const marketInfo = this.parsedMarkets[market];
            if (marketInfo === undefined)
                throw Error(`Invalid market ${orderParams[0].market}`);
            for (const order of orderParams) {
                clientOrderID.push(order.clientOrderID || (yield this.getClientOrderId(address)));
                prices.push(ethers_1.utils.parseUnits((0, base_1.floatStringWithDecimalToFixed)(order.price, marketInfo.quoteDisplayDecimals) || order.price, marketInfo.quoteDecimals));
                amounts.push(ethers_1.utils.parseUnits((0, base_1.floatStringWithDecimalToFixed)(order.amount, marketInfo.baseDisplayDecimals) || order.price, marketInfo.baseDecimals));
                sides.push(dexalot_constants_1.OrderSide[order.side.toUpperCase()]);
                types.push(order.orderType === 'LIMIT_MAKER' ? dexalot_constants_1.TimeInForce.PO : dexalot_constants_1.TimeInForce.GTC);
            }
            return {
                txData: yield this.tradePairsContract.populateTransaction.addLimitOrderList(this.getDexalotTradingPair(market), clientOrderID, prices, amounts, sides, types),
                clientOrderID,
            };
        });
    }
    buildDeleteOrder(orders) {
        return __awaiter(this, void 0, void 0, function* () {
            const spotOrdersToCancel = [];
            for (const order of orders) {
                spotOrdersToCancel.push(order.orderId);
            }
            return yield this.tradePairsContract.populateTransaction.cancelOrderList(spotOrdersToCancel);
        });
    }
    getClientOrderId(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const blocknumber = (yield this._chain.getCurrentBlockNumber()) || 0;
            const timestamp = new Date().toISOString();
            const id = ethers_1.utils.toUtf8Bytes(`${address}${blocknumber}${timestamp}`);
            return ethers_1.utils.keccak256(id);
        });
    }
    getDexalotTradingPair(market) {
        const marketInfo = this.parsedMarkets[market];
        if (marketInfo === undefined)
            throw Error(`Invalid market ${market}`);
        return (0, dexalot_utils_1.fromUtf8)(`${marketInfo.baseSymbol}/${marketInfo.quoteSymbol}`);
    }
}
exports.DexalotCLOB = DexalotCLOB;
//# sourceMappingURL=dexalot.js.map