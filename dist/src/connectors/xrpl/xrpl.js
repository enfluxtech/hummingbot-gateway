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
exports.XRPLCLOB = void 0;
const xrpl_1 = require("../../chains/xrpl/xrpl");
const xrpl_2 = require("xrpl");
const xrpl_order_tracker_1 = require("../../chains/xrpl/xrpl.order-tracker");
const xrpl_types_1 = require("./xrpl.types");
const xrpl_utils_1 = require("./xrpl.utils");
const xrpl_helpers_1 = require("../../chains/xrpl/xrpl.helpers");
const lru_cache_1 = __importDefault(require("lru-cache"));
const xrpl_config_1 = require("../../chains/xrpl/xrpl.config");
const mathjs_1 = require("mathjs");
const ORDERBOOK_LIMIT = 50;
const TXN_SUBMIT_DELAY = 100;
class XRPLCLOB {
    constructor(chain, network) {
        this._ready = false;
        this._isSubmittingTxn = false;
        this.parsedMarkets = {};
        this.chain = chain;
        this.network = network;
        this._xrpl = xrpl_1.XRPL.getInstance(network);
        this._client = this._xrpl.client;
        this._orderStorage = this._xrpl.orderStorage;
    }
    static getInstance(chain, network) {
        if (XRPLCLOB._instances === undefined) {
            const config = (0, xrpl_config_1.getXRPLConfig)(chain, network);
            XRPLCLOB._instances = new lru_cache_1.default({
                max: config.network.maxLRUCacheInstances,
            });
        }
        const instanceKey = chain + network;
        if (!XRPLCLOB._instances.has(instanceKey)) {
            XRPLCLOB._instances.set(instanceKey, new XRPLCLOB(chain, network));
        }
        return XRPLCLOB._instances.get(instanceKey);
    }
    loadMarkets() {
        return __awaiter(this, void 0, void 0, function* () {
            const rawMarkets = yield this.fetchMarkets();
            for (const market of rawMarkets) {
                this.parsedMarkets[market.marketId] = market;
            }
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._xrpl.ready() || Object.keys(this.parsedMarkets).length === 0) {
                yield this._xrpl.init();
                yield this.loadMarkets();
                this._ready = true;
            }
        });
    }
    ready() {
        return this._ready;
    }
    getInfo() {
        const info = `XRPLCLOB: ${this.chain} ${this.network} | RCP URL: ${this._xrpl.rpcUrl} | XRPLCLOB ready: ${this._ready}`;
        return info;
    }
    markets(req) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.market && req.market.split('-').length === 2) {
                const marketsAsArray = [];
                marketsAsArray.push(this.parsedMarkets[req.market]);
                return { markets: marketsAsArray };
            }
            const marketsAsArray = [];
            for (const market in this.parsedMarkets) {
                marketsAsArray.push(this.parsedMarkets[market]);
            }
            return { markets: marketsAsArray };
        });
    }
    orderBook(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getOrderBook(this.parsedMarkets[req.market]);
        });
    }
    fetchMarkets() {
        return __awaiter(this, void 0, void 0, function* () {
            const loadedMarkets = [];
            const markets = this._xrpl.storedMarketList;
            const getMarket = (market) => __awaiter(this, void 0, void 0, function* () {
                const processedMarket = yield this.getMarket(market);
                loadedMarkets.push(processedMarket);
            });
            yield (0, xrpl_helpers_1.promiseAllInBatches)(getMarket, markets, 1, 1);
            return loadedMarkets;
        });
    }
    getMarket(market) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            if (!market)
                throw new xrpl_types_1.MarketNotFoundError(`No market informed.`);
            let baseTickSize, baseTransferRate, quoteTickSize, quoteTransferRate;
            const zeroTransferRate = 1000000000;
            const baseCurrency = market.baseCode;
            const quoteCurrency = market.quoteCode;
            const baseIssuer = market.baseIssuer;
            const quoteIssuer = market.quoteIssuer;
            if (baseCurrency != 'XRP') {
                yield this._xrpl.ensureConnection();
                const baseMarketResp = yield this._client.request({
                    command: 'account_info',
                    ledger_index: 'validated',
                    account: baseIssuer,
                });
                if (!baseMarketResp)
                    throw new xrpl_types_1.MarketNotFoundError(`Market "${baseCurrency}.${baseIssuer}" not found.`);
                baseTickSize = (_a = baseMarketResp.result.account_data.TickSize) !== null && _a !== void 0 ? _a : 15;
                const rawTransferRate = (_b = baseMarketResp.result.account_data.TransferRate) !== null && _b !== void 0 ? _b : zeroTransferRate;
                baseTransferRate = rawTransferRate / zeroTransferRate - 1;
            }
            else {
                baseTickSize = 6;
                baseTransferRate = 0;
            }
            if (quoteCurrency != 'XRP') {
                yield this._xrpl.ensureConnection();
                const quoteMarketResp = yield this._client.request({
                    command: 'account_info',
                    ledger_index: 'validated',
                    account: quoteIssuer,
                });
                if (!quoteMarketResp)
                    throw new xrpl_types_1.MarketNotFoundError(`Market "${quoteCurrency}.${quoteIssuer}" not found.`);
                quoteTickSize = (_c = quoteMarketResp.result.account_data.TickSize) !== null && _c !== void 0 ? _c : 15;
                const rawTransferRate = (_d = quoteMarketResp.result.account_data.TransferRate) !== null && _d !== void 0 ? _d : zeroTransferRate;
                quoteTransferRate = rawTransferRate / zeroTransferRate - 1;
            }
            else {
                quoteTickSize = 6;
                quoteTransferRate = 0;
            }
            const smallestTickSize = Math.min(baseTickSize, quoteTickSize);
            const minimumOrderSize = Math.pow(10, -smallestTickSize);
            const result = {
                marketId: market.marketId,
                minimumOrderSize: minimumOrderSize,
                smallestTickSize: smallestTickSize,
                baseTickSize,
                quoteTickSize,
                baseTransferRate: baseTransferRate,
                quoteTransferRate: quoteTransferRate,
                baseIssuer: baseIssuer,
                quoteIssuer: quoteIssuer,
                baseCurrency: baseCurrency,
                quoteCurrency: quoteCurrency,
            };
            return result;
        });
    }
    getOrderBook(market, limit = ORDERBOOK_LIMIT) {
        return __awaiter(this, void 0, void 0, function* () {
            const baseRequest = {
                currency: market.baseCurrency,
                issuer: market.baseIssuer,
            };
            const quoteRequest = {
                currency: market.quoteCurrency,
                issuer: market.quoteIssuer,
            };
            if (market.baseCurrency == 'XRP') {
                delete baseRequest['issuer'];
            }
            if (market.quoteCurrency == 'XRP') {
                delete quoteRequest['issuer'];
            }
            const { bids, asks } = yield this.getOrderBookFromXRPL(baseRequest, quoteRequest, limit);
            const buys = [];
            const sells = [];
            bids.forEach((bid) => {
                let price, quantity;
                if ((0, mathjs_1.isUndefined)(bid.taker_gets_funded) &&
                    (0, mathjs_1.isUndefined)(bid.taker_pays_funded)) {
                    if ((0, mathjs_1.isUndefined)(bid.TakerGets))
                        return;
                    if ((0, mathjs_1.isUndefined)(bid.TakerPays))
                        return;
                    price = (parseFloat((0, xrpl_utils_1.getTakerGetsAmount)(bid)) /
                        parseFloat((0, xrpl_utils_1.getTakerPaysAmount)(bid))).toString();
                    quantity = (0, xrpl_utils_1.getTakerPaysAmount)(bid);
                }
                else {
                    if ((0, mathjs_1.isUndefined)(bid.taker_gets_funded))
                        return;
                    if ((0, mathjs_1.isUndefined)(bid.taker_pays_funded))
                        return;
                    price = (parseFloat((0, xrpl_utils_1.getTakerGetsFundedAmount)(bid)) /
                        parseFloat((0, xrpl_utils_1.getTakerPaysFundedAmount)(bid))).toString();
                    quantity = (0, xrpl_utils_1.getTakerPaysFundedAmount)(bid);
                }
                buys.push({
                    price,
                    quantity,
                    timestamp: Date.now(),
                });
            });
            asks.forEach((ask) => {
                let price, quantity;
                if ((0, mathjs_1.isUndefined)(ask.taker_gets_funded) &&
                    (0, mathjs_1.isUndefined)(ask.taker_pays_funded)) {
                    if ((0, mathjs_1.isUndefined)(ask.TakerGets))
                        return;
                    if ((0, mathjs_1.isUndefined)(ask.TakerPays))
                        return;
                    price = (parseFloat((0, xrpl_utils_1.getTakerPaysAmount)(ask)) /
                        parseFloat((0, xrpl_utils_1.getTakerGetsAmount)(ask))).toString();
                    quantity = (0, xrpl_utils_1.getTakerGetsAmount)(ask);
                }
                else {
                    if ((0, mathjs_1.isUndefined)(ask.taker_gets_funded))
                        return;
                    if ((0, mathjs_1.isUndefined)(ask.taker_pays_funded))
                        return;
                    price = (parseFloat((0, xrpl_utils_1.getTakerPaysFundedAmount)(ask)) /
                        parseFloat((0, xrpl_utils_1.getTakerGetsFundedAmount)(ask))).toString();
                    quantity = (0, xrpl_utils_1.getTakerGetsFundedAmount)(ask);
                }
                sells.push({
                    price,
                    quantity,
                    timestamp: Date.now(),
                });
            });
            return {
                buys,
                sells,
            };
        });
    }
    ticker(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const getMarkets = yield this.markets(req);
            const markets = getMarkets.markets;
            const marketsWithMidprice = yield Promise.all(markets.map((market) => __awaiter(this, void 0, void 0, function* () {
                const midprice = yield this.getMidPriceForMarket(this.parsedMarkets[market.marketId]);
                return Object.assign(Object.assign({}, market), { midprice });
            })));
            return { markets: marketsWithMidprice };
        });
    }
    orders(req) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.address)
                return { orders: [] };
            if (!req.orderId)
                return { orders: [] };
            if (req.orderId === 'all') {
                if (!req.market)
                    return { orders: [] };
                const marketId = this.parsedMarkets[req.market].marketId;
                const orders = yield this._orderStorage.getOrdersByMarket(this.chain, this.network, req.address, marketId);
                const keys = Object.keys(orders);
                const ordersArray = keys.map((key) => orders[key]);
                return { orders: ordersArray };
            }
            else {
                const orders = yield this._orderStorage.getOrdersByHash(this.chain, this.network, req.address, req.orderId);
                const keys = Object.keys(orders);
                const ordersArray = keys.map((key) => orders[key]);
                return { orders: ordersArray };
            }
        });
    }
    postOrder(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const market = this.parsedMarkets[req.market];
            const baseCurrency = market.baseCurrency;
            const quoteCurrency = market.quoteCurrency;
            const baseIssuer = market.baseIssuer;
            const quoteIssuer = market.quoteIssuer;
            const wallet = yield this.getWallet(req.address);
            const total = parseFloat(req.price) * parseFloat(req.amount);
            let we_pay = {
                currency: '',
                issuer: '',
                value: '',
            };
            let we_get = { currency: '', issuer: '', value: '' };
            if (req.side == xrpl_types_1.TradeType.SELL) {
                we_pay = {
                    currency: baseCurrency,
                    issuer: baseIssuer,
                    value: Number(parseFloat(req.amount).toPrecision(market.smallestTickSize)).toString(),
                };
                we_get = {
                    currency: quoteCurrency,
                    issuer: quoteIssuer,
                    value: Number(total.toPrecision(market.smallestTickSize)).toString(),
                };
            }
            else {
                we_pay = {
                    currency: quoteCurrency,
                    issuer: quoteIssuer,
                    value: Number(total.toPrecision(market.smallestTickSize)).toString(),
                };
                we_get = {
                    currency: baseCurrency,
                    issuer: baseIssuer,
                    value: Number(parseFloat(req.amount).toPrecision(market.smallestTickSize)).toString(),
                };
            }
            if (we_pay.currency == 'XRP') {
                we_pay.value = (0, xrpl_2.xrpToDrops)(we_pay.value);
            }
            if (we_get.currency == 'XRP') {
                we_get.value = (0, xrpl_2.xrpToDrops)(we_get.value);
            }
            const offer = {
                TransactionType: 'OfferCreate',
                Account: wallet.classicAddress,
                TakerGets: we_pay.currency == 'XRP' ? we_pay.value : we_pay,
                TakerPays: we_get.currency == 'XRP' ? we_get.value : we_get,
            };
            const { prepared, signed } = yield this.submitTxn(offer, wallet);
            const currentTime = Date.now();
            const currentLedgerIndex = yield this.getCurrentBlockNumber();
            const order = {
                hash: prepared.Sequence ? prepared.Sequence : 0,
                marketId: (0, xrpl_utils_1.convertHexToString)(baseCurrency) +
                    '-' +
                    (0, xrpl_utils_1.convertHexToString)(quoteCurrency),
                price: req.price,
                amount: req.amount,
                filledAmount: '0',
                state: 'PENDING_OPEN',
                tradeType: req.side,
                orderType: 'LIMIT',
                createdAt: currentTime,
                createdAtLedgerIndex: currentLedgerIndex,
                updatedAt: currentTime,
                updatedAtLedgerIndex: currentLedgerIndex,
                associatedTxns: [signed.hash],
                associatedFills: [],
            };
            yield this.trackOrder(wallet, order);
            return { txHash: signed.hash };
        });
    }
    deleteOrder(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const wallet = yield this.getWallet(req.address);
            const offer = {
                TransactionType: 'OfferCancel',
                Account: wallet.classicAddress,
                OfferSequence: parseInt(req.orderId),
            };
            const { signed } = yield this.submitTxn(offer, wallet);
            let order = this.getOrder(wallet, req);
            if (order) {
                order.state = 'PENDING_CANCEL';
                order.updatedAt = Date.now();
                order.updatedAtLedgerIndex = yield this.getCurrentBlockNumber();
                order.associatedTxns.push(signed.hash);
            }
            else {
                order = {
                    hash: parseInt(req.orderId),
                    marketId: '',
                    price: '',
                    amount: '',
                    filledAmount: '',
                    state: 'PENDING_CANCEL',
                    tradeType: xrpl_types_1.TradeType.UNKNOWN,
                    orderType: 'LIMIT',
                    createdAt: Date.now(),
                    createdAtLedgerIndex: yield this.getCurrentBlockNumber(),
                    updatedAt: Date.now(),
                    updatedAtLedgerIndex: yield this.getCurrentBlockNumber(),
                    associatedTxns: [signed.hash],
                    associatedFills: [],
                };
            }
            yield this.trackOrder(wallet, order);
            return { txHash: signed.hash };
        });
    }
    estimateGas(_req) {
        return this.getFeeEstimate();
    }
    submitTxn(offer, wallet) {
        return __awaiter(this, void 0, void 0, function* () {
            while (this._isSubmittingTxn) {
                yield new Promise((resolve) => setTimeout(resolve, TXN_SUBMIT_DELAY));
            }
            this._isSubmittingTxn = true;
            const prepared = yield this._client.autofill(offer);
            const signed = wallet.sign(prepared);
            yield this._xrpl.ensureConnection();
            yield this._client.submit(signed.tx_blob);
            this._isSubmittingTxn = false;
            return { prepared, signed };
        });
    }
    getWallet(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const wallet = yield this._xrpl.getWallet(address);
            return wallet;
        });
    }
    getOrderBookFromXRPL(baseRequest, quoteRequest, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._xrpl.ensureConnection();
            const orderbook_resp_ask = yield this._client.request({
                command: 'book_offers',
                ledger_index: 'validated',
                taker_gets: baseRequest,
                taker_pays: quoteRequest,
                limit,
            });
            yield this._xrpl.ensureConnection();
            const orderbook_resp_bid = yield this._client.request({
                command: 'book_offers',
                ledger_index: 'validated',
                taker_gets: quoteRequest,
                taker_pays: baseRequest,
                limit,
            });
            const asks = orderbook_resp_ask.result.offers;
            const bids = orderbook_resp_bid.result.offers;
            return { bids, asks };
        });
    }
    getCurrentBlockNumber() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._xrpl.ensureConnection();
            return yield this._client.getLedgerIndex();
        });
    }
    getFeeEstimate() {
        const fee_estimate = this._xrpl.fee;
        return {
            gasPrice: parseFloat(fee_estimate.median),
            gasPriceToken: this._xrpl.nativeTokenSymbol,
            gasLimit: parseFloat(this._client.maxFeeXRP),
            gasCost: parseFloat(fee_estimate.median) * this._client.feeCushion,
        };
    }
    getOrder(wallet, req) {
        const orderTracker = xrpl_order_tracker_1.OrderTracker.getInstance(this.chain, this.network, wallet);
        return orderTracker.getOrder(parseInt(req.orderId));
    }
    trackOrder(wallet, order) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderTracker = xrpl_order_tracker_1.OrderTracker.getInstance(this.chain, this.network, wallet);
            yield orderTracker.addOrder(order);
        });
    }
    getMidPriceForMarket(market) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderbook = yield this.getOrderBook(market, 1);
            try {
                const bestAsk = orderbook.sells[0];
                const bestBid = orderbook.buys[0];
                const midPrice = (parseFloat(bestAsk.price) + parseFloat(bestBid.price)) / 2;
                return midPrice;
            }
            catch (error) {
                return 0;
            }
        });
    }
}
exports.XRPLCLOB = XRPLCLOB;
//# sourceMappingURL=xrpl.js.map