"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KujiraConfig = void 0;
const bignumber_js_1 = require("bignumber.js");
const config_manager_v2_1 = require("../../services/config-manager-v2");
const configManager = config_manager_v2_1.ConfigManagerV2.getInstance();
var KujiraConfig;
(function (KujiraConfig) {
    KujiraConfig.config = {
        chainType: 'KUJIRA',
        tradingTypes: ['CLOB_SPOT'],
        chain: 'kujira',
        networks: new Map(Object.entries(configManager.get(`kujira.networks`))),
        availableNetworks: [
            {
                chain: 'kujira',
                networks: Object.keys(configManager.get(`kujira.networks`)),
            },
        ],
        connector: 'kujira',
        prefix: configManager.get('kujira.prefix') || 'kujira',
        accountNumber: configManager.get('kujira.accountNumber') || 0,
        nativeToken: 'KUJI',
        gasPrice: (0, bignumber_js_1.BigNumber)(configManager.get('kujira.gasPrice') || 0.00125),
        gasPriceSuffix: 'ukuji',
        gasLimitEstimate: (0, bignumber_js_1.BigNumber)(configManager.get('kujira.gasLimitEstimate') || 0.009147),
        tokens: {
            disallowed: configManager.get(`kujira.tokens.disallowed`),
            allowed: configManager.get(`kujira.tokens.allowed`),
        },
        markets: {
            disallowed: configManager.get(`kujira.markets.disallowed`),
            allowed: configManager.get(`kujira.markets.allowed`),
        },
        fees: {
            maker: (0, bignumber_js_1.BigNumber)(0.075),
            taker: (0, bignumber_js_1.BigNumber)(0.15),
            serviceProvider: (0, bignumber_js_1.BigNumber)(0),
        },
        orders: {
            create: {
                fee: configManager.get(`kujira.orders.create.fee`),
                maxPerTransaction: configManager.get(`kujira.orders.create.maxPerTransaction`),
            },
            open: {
                limit: configManager.get(`kujira.orders.open.limit`) | 255,
                paginationLimit: configManager.get(`kujira.orders.open.paginationLimit`) | 31,
            },
            filled: {
                limit: configManager.get(`kujira.orders.filled.limit`) | 255,
            },
            cancel: {
                maxPerTransaction: configManager.get(`kujira.orders.cancel.maxPerTransaction`),
            },
        },
        transactions: {
            merge: {
                createOrders: configManager.get(`kujira.transactions.merge.createOrders`),
                cancelOrders: configManager.get(`kujira.transactions.merge.cancelOrders`),
                settleFunds: configManager.get(`kujira.transactions.merge.settleFunds`),
            },
        },
        orderBook: {
            offset: configManager.get(`kujira.orderBook.offset`) || 0,
            limit: configManager.get(`kujira.orderBook.limit`) || 255,
        },
        retry: {
            all: {
                maxNumberOfRetries: configManager.get('kujira.retry.all.maxNumberOfRetries') || 0,
                delayBetweenRetries: configManager.get('kujira.retry.all.delayBetweenRetries') || 0,
            },
        },
        timeout: {
            all: configManager.get('kujira.timeout.all') || 0,
        },
        parallel: {
            all: {
                batchSize: configManager.get('kujira.parallel.all.batchSize') || 0,
                delayBetweenBatches: configManager.get('kujira.parallel.all.delayBetweenBatches') || 0,
            },
        },
    };
})(KujiraConfig || (exports.KujiraConfig = KujiraConfig = {}));
//# sourceMappingURL=kujira.config.js.map