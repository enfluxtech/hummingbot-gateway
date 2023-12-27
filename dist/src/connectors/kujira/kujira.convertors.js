"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertClobBatchOrdersRequestToKujiraCancelOrdersRequest = exports.convertClobBatchOrdersRequestToKujiraPlaceOrdersRequest = exports.convertNonStandardKujiraTokenIds = exports.convertToResponseBody = exports.convertKujiraRawLogEventsToMapOfEvents = exports.convertKujiraEventsToMapOfEvents = exports.convertNetworkToKujiraNetwork = exports.convertKujiraSettlementToSettlement = exports.convertKujiraTransactionToTransaction = exports.convertKujiraBalancesToBalances = exports.convertKujiraTickerToTicker = exports.convertKujiraOrdersToMapOfOrders = exports.convertKujiraFeeToFee = exports.convertKujiraOrderToStatus = exports.convertOfferDenomToOrderSide = exports.convertKujiraOrderBookToOrderBook = exports.convertKujiraMarketToMarket = exports.convertMarketNameToHumingbotMarketName = exports.convertHumingbotMarketNameToMarketName = exports.convertKujiraTokenToToken = exports.convertToGetTokensResponse = void 0;
const kujira_types_1 = require("./kujira.types");
const kujira_config_1 = require("./kujira.config");
const kujira_js_1 = require("kujira.js");
const kujira_helpers_1 = require("./kujira.helpers");
const bignumber_js_1 = require("bignumber.js");
const stargate_1 = require("@cosmjs/stargate");
const convertToGetTokensResponse = (token) => {
    return {
        chainId: token.id,
        address: undefined,
        name: token.name,
        symbol: token.symbol,
        decimals: token.decimals,
    };
};
exports.convertToGetTokensResponse = convertToGetTokensResponse;
const convertKujiraTokenToToken = (token) => {
    return {
        id: token.reference,
        name: token.symbol,
        symbol: token.symbol,
        decimals: token.decimals,
    };
};
exports.convertKujiraTokenToToken = convertKujiraTokenToToken;
const convertHumingbotMarketNameToMarketName = (input) => {
    return input.replace('-', '/');
};
exports.convertHumingbotMarketNameToMarketName = convertHumingbotMarketNameToMarketName;
const convertMarketNameToHumingbotMarketName = (input) => {
    return input.replace('/', '-');
};
exports.convertMarketNameToHumingbotMarketName = convertMarketNameToHumingbotMarketName;
const convertKujiraMarketToMarket = (market) => {
    var _a;
    const baseToken = (0, exports.convertKujiraTokenToToken)(market.denoms[0]);
    const quoteToken = (0, exports.convertKujiraTokenToToken)(market.denoms[1]);
    const decimalPlaces = 'decimal_places' in market.precision
        ? (_a = market.precision) === null || _a === void 0 ? void 0 : _a.decimal_places
        : market.precision.significant_figures;
    const minimumPriceIncrement = (0, bignumber_js_1.BigNumber)(Math.pow(10, -1 * decimalPlaces));
    return {
        id: market.address,
        name: `${baseToken.symbol}/${quoteToken.symbol}`,
        baseToken: baseToken,
        quoteToken: quoteToken,
        precision: decimalPlaces,
        minimumOrderSize: minimumPriceIncrement,
        minimumPriceIncrement: minimumPriceIncrement,
        minimumBaseAmountIncrement: minimumPriceIncrement,
        minimumQuoteAmountIncrement: minimumPriceIncrement,
        fees: {
            maker: kujira_config_1.KujiraConfig.config.fees.maker,
            taker: kujira_config_1.KujiraConfig.config.fees.taker,
            serviceProvider: kujira_config_1.KujiraConfig.config.fees.serviceProvider,
        },
        programId: undefined,
        deprecated: false,
        connectorMarket: market,
    };
};
exports.convertKujiraMarketToMarket = convertKujiraMarketToMarket;
const convertKujiraOrderBookToOrderBook = (market, kujiraOrderBook) => {
    const bids = (0, kujira_types_1.IMap)().asMutable();
    const asks = (0, kujira_types_1.IMap)().asMutable();
    let bestBid;
    let bestAsk;
    let bestBidPrice = (0, bignumber_js_1.BigNumber)('-Infinity');
    let bestAskPrice = (0, bignumber_js_1.BigNumber)('Infinity');
    let counter = 0;
    kujiraOrderBook.base.forEach((kujiraOrder) => {
        var _a;
        const order = {
            id: undefined,
            clientId: undefined,
            marketName: market.name,
            marketId: market.id,
            ownerAddress: undefined,
            payerAddress: undefined,
            price: (0, bignumber_js_1.BigNumber)(kujiraOrder.quote_price),
            amount: (0, bignumber_js_1.BigNumber)(kujiraOrder.total_offer_amount),
            side: kujira_types_1.OrderSide.SELL,
            status: kujira_types_1.OrderStatus.OPEN,
            type: kujira_types_1.OrderType.LIMIT,
            fee: undefined,
            fillingTimestamp: undefined,
            hashes: undefined,
            connectorOrder: undefined,
        };
        if (bestAsk) {
            if ((_a = order.price) === null || _a === void 0 ? void 0 : _a.lt(bestAskPrice)) {
                bestAsk = order;
                bestAskPrice = (0, kujira_helpers_1.getNotNullOrThrowError)(order.price);
            }
        }
        else {
            bestAsk = order;
            bestAskPrice = (0, kujira_helpers_1.getNotNullOrThrowError)(order.price);
        }
        asks.set(`unknown_${counter++}`, order);
    });
    kujiraOrderBook.quote.forEach((kujiraOrder) => {
        var _a;
        const order = {
            id: undefined,
            clientId: undefined,
            marketName: market.name,
            marketId: market.id,
            ownerAddress: undefined,
            payerAddress: undefined,
            price: (0, bignumber_js_1.BigNumber)(kujiraOrder.quote_price),
            amount: (0, bignumber_js_1.BigNumber)(kujiraOrder.total_offer_amount),
            side: kujira_types_1.OrderSide.BUY,
            status: kujira_types_1.OrderStatus.OPEN,
            type: kujira_types_1.OrderType.LIMIT,
            fee: undefined,
            fillingTimestamp: undefined,
            hashes: undefined,
            connectorOrder: undefined,
        };
        if (bestBid) {
            if ((_a = order.price) === null || _a === void 0 ? void 0 : _a.gt(bestBidPrice)) {
                bestBid = order;
                bestBidPrice = (0, kujira_helpers_1.getNotNullOrThrowError)(order.price);
            }
        }
        else {
            bestBid = order;
            bestBidPrice = (0, kujira_helpers_1.getNotNullOrThrowError)(order.price);
        }
        bids.set(`unknown_${counter++}`, order);
    });
    return {
        market: market,
        bids: bids,
        asks: asks,
        bestBid: bestBid,
        bestAsk: bestAsk,
        connectorOrderBook: kujiraOrderBook,
    };
};
exports.convertKujiraOrderBookToOrderBook = convertKujiraOrderBookToOrderBook;
const convertOfferDenomToOrderSide = (offer_denom, market) => {
    const offerDenom = kujira_js_1.Denom.from(offer_denom);
    const baseTokenDenom = kujira_js_1.Denom.from(market.baseToken.id);
    const quoteTokenDenom = kujira_js_1.Denom.from(market.quoteToken.id);
    if (offerDenom.eq(baseTokenDenom)) {
        return kujira_types_1.OrderSide.SELL;
    }
    else if (offerDenom.eq(quoteTokenDenom)) {
        return kujira_types_1.OrderSide.BUY;
    }
    else {
        throw new Error('Order side from offer denom not recognized');
    }
};
exports.convertOfferDenomToOrderSide = convertOfferDenomToOrderSide;
const convertKujiraOrderToStatus = (kujiraOrder) => {
    if (kujiraOrder['offer_amount'] == '0') {
        return kujira_types_1.OrderStatus.FILLED;
    }
    else if (kujiraOrder['offer_amount'] == kujiraOrder['original_offer_amount']) {
        return kujira_types_1.OrderStatus.OPEN;
    }
    else {
        return kujira_types_1.OrderStatus.PARTIALLY_FILLED;
    }
};
exports.convertKujiraOrderToStatus = convertKujiraOrderToStatus;
const convertKujiraFeeToFee = (kujiraFee) => {
    const fee = (0, stargate_1.parseCoins)(kujiraFee)[0];
    return (0, bignumber_js_1.BigNumber)(fee.amount).multipliedBy((0, bignumber_js_1.BigNumber)('1e-' + kujira_js_1.KUJI.decimals.toString()));
};
exports.convertKujiraFeeToFee = convertKujiraFeeToFee;
const convertKujiraOrdersToMapOfOrders = (options) => {
    const output = (0, kujira_types_1.IMap)().asMutable();
    let unknownCounter = 1;
    if (kujira_types_1.ConvertOrderType.PLACE_ORDERS == options.type) {
        for (const bundle of options.bundles.get('orders').values()) {
            let orderId = bundle.getIn(['events', 'wasm', 'order_idx']);
            if (!orderId) {
                orderId = `unknown_${unknownCounter++}`;
            }
            const denom = kujira_js_1.Denom.from(bundle.getIn(['events', 'wasm', 'offer_denom']));
            const order = {
                id: orderId,
                clientId: bundle.getIn(['candidate']).clientId,
                marketName: bundle.getIn(['market']).name,
                marketId: bundle.getIn(['market']).id,
                market: bundle.getIn(['market']),
                ownerAddress: bundle.getIn(['candidate']).type == kujira_types_1.OrderType.MARKET
                    ? bundle.getIn(['events', 'message', 'sender'])
                    : bundle.getIn(['candidate']).type == kujira_types_1.OrderType.LIMIT
                        ? bundle.getIn(['events', 'transfer', 'sender'])
                        : undefined,
                payerAddress: bundle.getIn(['candidate']).type == kujira_types_1.OrderType.MARKET
                    ? bundle.getIn(['events', 'message', 'sender'])
                    : bundle.getIn(['candidate']).type == kujira_types_1.OrderType.LIMIT
                        ? bundle.getIn(['events', 'transfer', 'sender'])
                        : undefined,
                price: bundle.getIn(['events', 'wasm', 'quote_price'])
                    ? (0, bignumber_js_1.BigNumber)(bundle.getIn(['events', 'wasm', 'quote_price']))
                    : (0, bignumber_js_1.BigNumber)(bundle.getIn(['events', 'wasm-trade', 'quote_amount']))
                        .div((0, bignumber_js_1.BigNumber)(bundle.getIn(['events', 'wasm-trade', 'base_amount'])))
                        .decimalPlaces(bundle.getIn(['market', 'precision'])),
                amount: bundle.getIn(['events', 'wasm', 'offer_amount'])
                    ? (0, bignumber_js_1.BigNumber)(bundle.getIn(['events', 'wasm', 'offer_amount'])).div((0, bignumber_js_1.BigNumber)(10).pow(denom.decimals))
                    : undefined,
                side: (0, exports.convertOfferDenomToOrderSide)(bundle.getIn(['events', 'wasm', 'offer_denom']), bundle.getIn(['market'])),
                status: options.bundles.getIn(['common', 'status']),
                type: bundle.getIn(['candidate']).type || kujira_types_1.OrderType.LIMIT,
                fee: (0, exports.convertKujiraFeeToFee)(options.bundles.getIn(['common', 'events', 'tx', 'fee'])),
                creationTimestamp: undefined,
                fillingTimestamp: undefined,
                hashes: {
                    creation: options.bundles.getIn([
                        'common',
                        'response',
                        'transactionHash',
                    ]),
                },
                connectorOrder: bundle.getIn(['common', 'response']),
            };
            output.set(orderId, order);
        }
    }
    else if (kujira_types_1.ConvertOrderType.GET_ORDERS == options.type) {
        for (const bundle of options.bundles.get('orders')) {
            let orderId = bundle['idx'];
            if (!orderId) {
                orderId = `unknown_${unknownCounter++}`;
            }
            const market = options.bundles.getIn(['common', 'market']);
            const denom = kujira_js_1.Denom.from(bundle['offer_denom']['native']);
            const order = {
                id: orderId,
                clientId: undefined,
                marketName: market.name,
                marketId: market.id,
                market: market,
                ownerAddress: bundle['owner'],
                payerAddress: bundle['owner'],
                price: bundle['quote_price']
                    ? (0, bignumber_js_1.BigNumber)(bundle['quote_price'])
                    : undefined,
                amount: bundle['original_offer_amount']
                    ? (0, bignumber_js_1.BigNumber)(bundle['original_offer_amount']).div((0, bignumber_js_1.BigNumber)(10).pow(denom.decimals))
                    : undefined,
                side: (0, exports.convertOfferDenomToOrderSide)(bundle['offer_denom']['native'], market),
                status: (0, exports.convertKujiraOrderToStatus)(bundle),
                type: kujira_types_1.OrderType.LIMIT,
                fee: undefined,
                fillingTimestamp: undefined,
                creationTimestamp: Number(bundle['created_at']),
                hashes: undefined,
                connectorOrder: bundle,
            };
            output.set(orderId, order);
        }
    }
    else if (kujira_types_1.ConvertOrderType.CANCELLED_ORDERS == options.type) {
        for (const bundle of options.bundles.get('orders').values()) {
            let orderId = bundle.getIn(['id']);
            if (!orderId) {
                orderId = `unknown_${unknownCounter++}`;
            }
            const order = {
                id: orderId,
                clientId: undefined,
                marketName: bundle.getIn(['market']).name,
                marketId: bundle.getIn(['market']).id,
                market: bundle.getIn(['market']),
                ownerAddress: options.bundles.getIn([
                    'common',
                    'events',
                    'transfer',
                    'sender',
                ]),
                payerAddress: options.bundles.getIn([
                    'common',
                    'events',
                    'transfer',
                    'sender',
                ]),
                price: undefined,
                amount: undefined,
                side: undefined,
                status: kujira_types_1.OrderStatus.CANCELLED,
                type: kujira_types_1.OrderType.LIMIT,
                fee: (0, exports.convertKujiraFeeToFee)(options.bundles.getIn(['common', 'events', 'tx', 'fee'])),
                creationTimestamp: undefined,
                fillingTimestamp: undefined,
                hashes: {
                    cancellation: options.bundles.getIn([
                        'common',
                        'response',
                        'transactionHash',
                    ]),
                },
                connectorOrder: bundle.getIn(['common', 'response']),
            };
            output.set(orderId, order);
        }
    }
    return output;
};
exports.convertKujiraOrdersToMapOfOrders = convertKujiraOrdersToMapOfOrders;
const convertKujiraTickerToTicker = (input, market) => {
    const price = (0, bignumber_js_1.BigNumber)(input.price);
    const timestamp = Date.now();
    return {
        market: market,
        price: price,
        timestamp: timestamp,
        ticker: input,
    };
};
exports.convertKujiraTickerToTicker = convertKujiraTickerToTicker;
const convertKujiraBalancesToBalances = (network, balances, orders, tickers) => {
    const uskToken = network.toLowerCase() == kujira_js_1.NETWORKS[kujira_js_1.MAINNET].toLowerCase()
        ? (0, exports.convertKujiraTokenToToken)(kujira_js_1.USK)
        : (0, exports.convertKujiraTokenToToken)(kujira_js_1.USK_TESTNET);
    const output = {
        tokens: (0, kujira_types_1.IMap)().asMutable(),
        total: {
            token: uskToken,
            free: (0, bignumber_js_1.BigNumber)(0),
            lockedInOrders: (0, bignumber_js_1.BigNumber)(0),
            unsettled: (0, bignumber_js_1.BigNumber)(0),
        },
    };
    for (const balance of balances) {
        const token = (0, exports.convertKujiraTokenToToken)(kujira_js_1.Denom.from(balance.denom));
        const ticker = tickers
            .valueSeq()
            .filter((ticker) => ticker.market.baseToken.id == token.id &&
            ticker.market.quoteToken.id == uskToken.id)
            .first();
        const amount = (0, bignumber_js_1.BigNumber)(balance.amount).div((0, bignumber_js_1.BigNumber)(10).pow(token.decimals));
        const price = token.id == uskToken.id ? 1 : (ticker === null || ticker === void 0 ? void 0 : ticker.price) || 0;
        output.tokens.set(token.id, {
            token: token,
            ticker: ticker,
            free: amount,
            lockedInOrders: (0, bignumber_js_1.BigNumber)(0),
            unsettled: (0, bignumber_js_1.BigNumber)(0),
        });
        output.total.free = output.total.free.plus(amount.multipliedBy(price));
    }
    for (const order of orders.values()) {
        const token = order.side == kujira_types_1.OrderSide.BUY
            ? order.market.quoteToken
            : order.market.baseToken;
        const ticker = tickers
            .valueSeq()
            .filter((ticker) => ticker.market.baseToken.id == token.id &&
            ticker.market.quoteToken.id == uskToken.id)
            .first();
        const amount = order.amount;
        const price = token.id == uskToken.id ? 1 : (ticker === null || ticker === void 0 ? void 0 : ticker.price) || 0;
        if (!output.tokens.has(token.id)) {
            output.tokens.set(token.id, {
                token: token,
                ticker: ticker,
                free: (0, bignumber_js_1.BigNumber)(0),
                lockedInOrders: (0, bignumber_js_1.BigNumber)(0),
                unsettled: (0, bignumber_js_1.BigNumber)(0),
            });
        }
        const tokenBalance = (0, kujira_helpers_1.getNotNullOrThrowError)(output.tokens.get(token.id));
        if (order.status == kujira_types_1.OrderStatus.OPEN) {
            tokenBalance.lockedInOrders = tokenBalance.lockedInOrders.plus(amount);
            output.total.lockedInOrders = output.total.lockedInOrders.plus(amount.multipliedBy(price));
        }
        else if (order.status == kujira_types_1.OrderStatus.FILLED) {
            tokenBalance.unsettled = tokenBalance.unsettled.plus(amount);
            output.total.unsettled = output.total.unsettled.plus(amount.multipliedBy(price));
        }
    }
    return output;
};
exports.convertKujiraBalancesToBalances = convertKujiraBalancesToBalances;
const convertKujiraTransactionToTransaction = (input) => {
    return {
        hash: input.hash,
        blockNumber: input.height,
        gasUsed: input.gasUsed,
        gasWanted: input.gasWanted,
        code: input.code,
        data: new TextDecoder('utf-8').decode(input.tx),
    };
};
exports.convertKujiraTransactionToTransaction = convertKujiraTransactionToTransaction;
const convertKujiraSettlementToSettlement = (input) => {
    return {
        hash: input.transactionHash,
    };
};
exports.convertKujiraSettlementToSettlement = convertKujiraSettlementToSettlement;
const convertNetworkToKujiraNetwork = (input) => {
    input = input.toLowerCase();
    let output;
    if (input.toLowerCase() == 'mainnet') {
        output = kujira_js_1.MAINNET;
    }
    else if (input.toLowerCase() == 'testnet') {
        output = kujira_js_1.TESTNET;
    }
    else {
        throw new Error(`Unrecognized network: ${input}`);
    }
    return output;
};
exports.convertNetworkToKujiraNetwork = convertNetworkToKujiraNetwork;
const convertKujiraEventsToMapOfEvents = (events) => {
    const output = (0, kujira_types_1.IMap)().asMutable();
    for (const event of events) {
        for (const attribute of event.attributes) {
            if (!output.getIn([event.type, attribute.key])) {
                output.setIn([event.type, attribute.key], attribute.value);
            }
        }
    }
    return output;
};
exports.convertKujiraEventsToMapOfEvents = convertKujiraEventsToMapOfEvents;
const convertKujiraRawLogEventsToMapOfEvents = (eventsLog, cancelManyOrderNumber) => {
    if (cancelManyOrderNumber) {
        let msgIndex = eventsLog[0]['msg_index'] + 1;
        for (let i = 0; i < cancelManyOrderNumber - 1; i++) {
            const newEventLog = Object.assign({}, eventsLog[0]);
            newEventLog['msg_index'] = msgIndex;
            eventsLog.push(newEventLog);
            msgIndex = msgIndex + 1;
        }
    }
    const output = (0, kujira_types_1.IMap)().asMutable();
    for (const eventLog of eventsLog) {
        const bundleIndex = eventLog['msg_index'];
        const events = eventLog['events'];
        for (const event of events) {
            for (const attribute of event.attributes) {
                output.setIn([bundleIndex, event.type, attribute.key], attribute.value);
            }
        }
    }
    return output;
};
exports.convertKujiraRawLogEventsToMapOfEvents = convertKujiraRawLogEventsToMapOfEvents;
const convertToResponseBody = (input) => {
    let output = input;
    if (kujira_types_1.IMap.isMap(input))
        output = input.toJS();
    for (const key in output) {
        if (kujira_types_1.IMap.isMap(output[key])) {
            output[key] = output[key].toJS();
        }
    }
    return output;
};
exports.convertToResponseBody = convertToResponseBody;
function convertNonStandardKujiraTokenIds(tokensIds) {
    var _a;
    const output = [];
    for (const tokenId of tokensIds) {
        if (tokenId.startsWith('ibc')) {
            const denom = kujira_js_1.Denom.from(tokenId);
            if (denom.trace && denom.trace.base_denom) {
                output.push((0, kujira_helpers_1.getNotNullOrThrowError)((_a = denom.trace) === null || _a === void 0 ? void 0 : _a.base_denom).replace(':', '/'));
            }
        }
    }
    return output;
}
exports.convertNonStandardKujiraTokenIds = convertNonStandardKujiraTokenIds;
function convertClobBatchOrdersRequestToKujiraPlaceOrdersRequest(obj) {
    if (Array.isArray(obj)) {
        return obj.map((item) => convertClobBatchOrdersRequestToKujiraPlaceOrdersRequest(item));
    }
    else if (typeof obj === 'object' && obj !== null) {
        const updatedObj = {};
        for (const key in obj) {
            let newKey = key;
            let value = obj[key];
            if (key === 'orderType') {
                newKey = 'type';
            }
            else if (key === 'market') {
                value = value.replace('-', '/');
                newKey = 'marketId';
            }
            updatedObj[newKey] =
                convertClobBatchOrdersRequestToKujiraPlaceOrdersRequest(value);
        }
        return updatedObj;
    }
    else {
        return obj;
    }
}
exports.convertClobBatchOrdersRequestToKujiraPlaceOrdersRequest = convertClobBatchOrdersRequestToKujiraPlaceOrdersRequest;
function convertClobBatchOrdersRequestToKujiraCancelOrdersRequest(obj) {
    const { cancelOrderParams, address } = obj, rest = __rest(obj, ["cancelOrderParams", "address"]);
    const ids = [];
    const idsFromCancelOrderParams = cancelOrderParams;
    for (const key of idsFromCancelOrderParams) {
        ids.push(key.orderId);
    }
    const marketId = cancelOrderParams[0].market;
    return Object.assign(Object.assign({}, rest), { ids: ids, marketId: marketId, ownerAddress: address });
}
exports.convertClobBatchOrdersRequestToKujiraCancelOrdersRequest = convertClobBatchOrdersRequestToKujiraCancelOrdersRequest;
//# sourceMappingURL=kujira.convertors.js.map