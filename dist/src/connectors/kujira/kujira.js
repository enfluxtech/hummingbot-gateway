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
exports.KujiraCLOB = void 0;
const kujira_model_1 = require("./kujira.model");
const kujira_convertors_1 = require("./kujira.convertors");
const kujira_helpers_1 = require("./kujira.helpers");
const bignumber_js_1 = require("bignumber.js");
class KujiraCLOB {
    constructor(chain, network) {
        this.parsedMarkets = {};
        this.chain = chain;
        this.network = network;
    }
    static getInstance(chain, network) {
        if (KujiraCLOB._instances === undefined) {
            KujiraCLOB._instances = {};
        }
        const key = `${chain}:${network}`;
        if (!(key in KujiraCLOB._instances)) {
            KujiraCLOB._instances[key] = new KujiraCLOB(chain, network);
        }
        return KujiraCLOB._instances[key];
    }
    static getConnectedInstances() {
        return KujiraCLOB._instances;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.kujira = yield kujira_model_1.KujiraModel.getInstance(this.chain, this.network);
            yield this.kujira.init();
            yield this.loadMarkets();
        });
    }
    ready() {
        return this.kujira && this.kujira.isReady;
    }
    deleteOrder(req) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (req.orderId) {
                const result = yield this.kujira.cancelOrder({
                    id: req.orderId,
                    marketName: (0, kujira_convertors_1.convertHumingbotMarketNameToMarketName)(req.market),
                    ownerAddress: req.address,
                });
                return {
                    txHash: (0, kujira_helpers_1.getNotNullOrThrowError)((_a = result.hashes) === null || _a === void 0 ? void 0 : _a.cancellation),
                };
            }
            else {
                const result = yield this.kujira.cancelAllOrders({
                    marketName: (0, kujira_convertors_1.convertHumingbotMarketNameToMarketName)(req.market),
                    ownerAddress: req.address,
                });
                if (result.size) {
                    const order = (0, kujira_helpers_1.getNotNullOrThrowError)(result.first());
                    const order_hash = (0, kujira_helpers_1.getNotNullOrThrowError)(order.hashes);
                    let hash;
                    if ('creation' in order_hash) {
                        hash = order_hash.creation;
                    }
                    else if ('cancellation' in order_hash) {
                        hash = order_hash.cancellation;
                    }
                    else if ('withdraw' in order_hash) {
                        hash = order_hash.withdraw;
                    }
                    return { txHash: (0, kujira_helpers_1.getNotNullOrThrowError)(hash) };
                }
                else {
                    return { txHash: '' };
                }
            }
        });
    }
    estimateGas(_req) {
        const result = this.kujira.getEstimatedFees({});
        return {
            gasCost: result.cost.toNumber(),
            gasLimit: result.limit.toNumber(),
            gasPrice: result.price.toNumber(),
            gasPriceToken: result.token,
        };
    }
    loadMarkets() {
        return __awaiter(this, void 0, void 0, function* () {
            const allMarkets = (yield this.kujira.getAllMarkets());
            for (const market of allMarkets.values()) {
                this.parsedMarkets[(0, kujira_convertors_1.convertMarketNameToHumingbotMarketName)(market.name)] =
                    market;
            }
        });
    }
    markets(req) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.market && req.market.split('-').length === 2) {
                const resp = {};
                resp[req.market] = this.parsedMarkets[req.market];
                return { markets: resp };
            }
            return { markets: this.parsedMarkets };
        });
    }
    orderBook(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderBook = yield this.kujira.getOrderBook({
                marketName: (0, kujira_convertors_1.convertHumingbotMarketNameToMarketName)(req.market),
            });
            const buys = [];
            for (const order of orderBook.bids.valueSeq()) {
                buys.push({
                    price: (0, kujira_helpers_1.getNotNullOrThrowError)(order.price).toString(),
                    quantity: (0, kujira_helpers_1.getNotNullOrThrowError)(order.amount).toString(),
                    timestamp: order.creationTimestamp ? order.creationTimestamp : 0,
                });
            }
            const sells = [];
            for (const order of orderBook.asks.valueSeq()) {
                sells.push({
                    price: (0, kujira_helpers_1.getNotNullOrThrowError)(order.price).toString(),
                    quantity: (0, kujira_helpers_1.getNotNullOrThrowError)(order.amount).toString(),
                    timestamp: order.creationTimestamp ? order.creationTimestamp : 0,
                });
            }
            return { buys, sells };
        });
    }
    orders(req) {
        return __awaiter(this, void 0, void 0, function* () {
            let originalOrders;
            if (req.orderId) {
                const originalOrder = yield this.kujira.getOrder({
                    id: req.orderId,
                    marketName: (0, kujira_convertors_1.convertHumingbotMarketNameToMarketName)(req.market),
                    ownerAddress: (0, kujira_helpers_1.getNotNullOrThrowError)(req.address),
                });
                originalOrders = [originalOrder];
            }
            else {
                originalOrders = (0, kujira_helpers_1.getNotNullOrThrowError)(yield this.kujira.getOrders({
                    marketName: (0, kujira_convertors_1.convertHumingbotMarketNameToMarketName)(req.market),
                    ownerAddress: (0, kujira_helpers_1.getNotNullOrThrowError)(req.address),
                }))
                    .valueSeq()
                    .toArray();
            }
            const orders = [];
            for (const originalOrder of originalOrders) {
                if (originalOrder) {
                    const order = {
                        id: (0, kujira_helpers_1.getNotNullOrThrowError)(originalOrder.id),
                        clientId: originalOrder.clientId,
                        orderHash: '',
                        marketId: originalOrder.marketId,
                        active: '',
                        subaccountId: '',
                        executionType: '',
                        orderType: (0, kujira_helpers_1.getNotNullOrThrowError)(originalOrder.type),
                        price: (0, kujira_helpers_1.getNotNullOrThrowError)(originalOrder.price).toString(),
                        triggerPrice: '',
                        quantity: originalOrder.amount.toString(),
                        filledQuantity: '',
                        state: (0, kujira_helpers_1.getNotNullOrThrowError)(originalOrder.status),
                        createdAt: originalOrder.creationTimestamp
                            ? originalOrder.creationTimestamp.toString()
                            : '',
                        updatedAt: originalOrder.fillingTimestamp
                            ? originalOrder.fillingTimestamp.toString()
                            : '',
                        direction: originalOrder.side,
                    };
                    orders.push(order);
                }
            }
            return { orders };
        });
    }
    postOrder(req) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.kujira.placeOrder({
                clientId: req.clientOrderID,
                marketName: (0, kujira_convertors_1.convertHumingbotMarketNameToMarketName)(req.market),
                ownerAddress: req.address,
                side: req.side,
                price: (0, bignumber_js_1.BigNumber)(req.price),
                amount: (0, bignumber_js_1.BigNumber)(req.amount),
                type: req.orderType,
            });
            return {
                txHash: (0, kujira_helpers_1.getNotNullOrThrowError)((_a = result.hashes) === null || _a === void 0 ? void 0 : _a.creation),
                id: result.id,
            };
        });
    }
    ticker(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestMarket = (0, kujira_helpers_1.getNotNullOrThrowError)(req.market);
            const ticker = yield this.kujira.getTicker({
                marketName: (0, kujira_convertors_1.convertHumingbotMarketNameToMarketName)(requestMarket),
            });
            const marketMap = {};
            marketMap[requestMarket] = {
                market: ticker.market,
                ticker: ticker.ticker,
                price: ticker.price,
                timestamp: ticker.timestamp,
            };
            return { markets: marketMap };
        });
    }
    batchOrders(req) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.createOrderParams || req.cancelOrderParams) {
                    if (req.createOrderParams) {
                        const convertedReq = {
                            chain: req.chain,
                            network: req.network,
                            ownerAddress: req.address,
                            orders: (0, kujira_convertors_1.convertClobBatchOrdersRequestToKujiraPlaceOrdersRequest)(req.createOrderParams),
                        };
                        const originalResponse = yield this.kujira.placeOrders(convertedReq);
                        return {
                            network: this.network,
                            timestamp: 0,
                            latency: 0,
                            txHash: (0, kujira_helpers_1.getNotNullOrThrowError)((_b = (_a = originalResponse.first()) === null || _a === void 0 ? void 0 : _a.hashes) === null || _b === void 0 ? void 0 : _b.creation),
                            ids: originalResponse.valueSeq().map((order) => order.id),
                        };
                    }
                    else if (req.cancelOrderParams) {
                        const convertedReq = (0, kujira_convertors_1.convertClobBatchOrdersRequestToKujiraCancelOrdersRequest)(req);
                        const originalResponse = yield this.kujira.cancelOrders(convertedReq);
                        return {
                            network: this.network,
                            timestamp: 0,
                            latency: 0,
                            txHash: (0, kujira_helpers_1.getNotNullOrThrowError)((_d = (_c = (0, kujira_helpers_1.getNotNullOrThrowError)(originalResponse).first()) === null || _c === void 0 ? void 0 : _c.hashes) === null || _d === void 0 ? void 0 : _d.cancellation),
                            ids: (0, kujira_helpers_1.getNotNullOrThrowError)(originalResponse)
                                .valueSeq()
                                .map((order) => order.id),
                        };
                    }
                }
                return {};
            }
            catch (error) {
                console.error(error);
            }
        });
    }
}
exports.KujiraCLOB = KujiraCLOB;
//# sourceMappingURL=kujira.js.map