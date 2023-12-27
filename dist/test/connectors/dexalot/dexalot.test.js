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
const ethers_1 = require("ethers");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../../src/app");
const avalanche_1 = require("../../../src/chains/avalanche/avalanche");
const evm_broadcaster_1 = require("../../../src/chains/ethereum/evm.broadcaster");
const dexalot_1 = require("../../../src/connectors/dexalot/dexalot");
const dexalot_utils_1 = require("../../../src/connectors/dexalot/dexalot.utils");
const patch_1 = require("../../../test/services/patch");
let avalanche;
let dexalot;
const TX_HASH = '0xf6f81a37796bd06a797484467302e4d6f72832409545e2e01feb86dd8b22e4b2';
const MARKET = 'BTC.B-USDC';
const MARKETS = {
    baseSymbol: (0, dexalot_utils_1.fromUtf8)('BTC.b'),
    quoteSymbol: (0, dexalot_utils_1.fromUtf8)('USDC'),
    buyBookId: (0, dexalot_utils_1.fromUtf8)('BTC.b/USDC-BUYBOOK'),
    sellBookId: (0, dexalot_utils_1.fromUtf8)('BTC.b/USDC-SELLBOOK'),
    minTradeAmount: ethers_1.BigNumber.from('5'),
    maxTradeAmount: ethers_1.BigNumber.from('5000'),
    auctionPrice: ethers_1.BigNumber.from('5'),
    auctionMode: true,
    makerRate: '0.1',
    takerRate: '0.1',
    baseDecimals: 6,
    baseDisplayDecimals: 2,
    quoteDecimals: 18,
    quoteDisplayDecimals: 6,
    allowedSlippagePercent: '1',
    addOrderPaused: false,
    pairPaused: false,
    postOnly: true,
};
const ORDERS = {
    id: '0xf6f81a37796bd06a797484467302e4d6f72832409545e2e01feb86dd8b22e4b2',
    clientOrderId: '0xa508cb32923323679f29a032c70342c147c17d0145625922b0ef22e955c844c0',
    tradePairId: '0xa508cb32923323679f29a032c70342c147c17d0145625922b0ef22e955c844c0',
    price: ethers_1.BigNumber.from('500'),
    totalAmount: ethers_1.BigNumber.from('10'),
    quantity: ethers_1.BigNumber.from('5'),
    quantityFilled: ethers_1.BigNumber.from('5'),
    totalFee: ethers_1.BigNumber.from('1'),
    traderaddress: '0x...',
    side: 0,
    type1: 1,
    type2: 0,
    status: 0,
};
const GAS_PRICES = {
    gasPrice: '500000000',
    gasPriceToken: 'Token',
    gasLimit: '1000',
    gasCost: '100',
};
const INVALID_REQUEST = {
    chain: 'unknown',
    network: 'dexalot',
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    avalanche = avalanche_1.Avalanche.getInstance('dexalot');
    patchCurrentBlockNumber();
    avalanche.init();
    dexalot = dexalot_1.DexalotCLOB.getInstance('dexalot');
    patchMarkets();
    yield dexalot.init();
}));
beforeEach(() => {
    patchCurrentBlockNumber();
});
afterEach(() => {
    (0, patch_1.unpatch)();
});
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield avalanche.close();
}));
const patchCurrentBlockNumber = (withError = false) => {
    (0, patch_1.patch)(avalanche, 'getCurrentBlockNumber', () => {
        return withError ? -1 : 100;
    });
};
const patchMarkets = () => {
    (0, patch_1.patch)(dexalot, 'tradePairsContract', () => {
        return {
            getTradePairs() {
                return __awaiter(this, void 0, void 0, function* () {
                    return [
                        '0xa508cb32923323679f29a032c70342c147c17d0145625922b0ef22e955c844c0',
                    ];
                });
            },
            getTradePair() {
                return __awaiter(this, void 0, void 0, function* () {
                    return MARKETS;
                });
            },
        };
    });
};
const patchOrderBook = () => {
    (0, patch_1.patch)(dexalot, 'tradePairsContract', () => {
        return {
            getNBook() {
                return __awaiter(this, void 0, void 0, function* () {
                    return [
                        [ethers_1.BigNumber.from('5000000000000000000')],
                        [ethers_1.BigNumber.from('100000')],
                    ];
                });
            },
        };
    });
};
const patchMsgBroadcaster = () => {
    (0, patch_1.patch)(evm_broadcaster_1.EVMTxBroadcaster, 'getInstance', () => {
        return {
            broadcast() {
                return {
                    hash: TX_HASH,
                };
            },
        };
    });
};
const patchOrders = () => {
    (0, patch_1.patch)(dexalot, 'tradePairsContract', () => {
        return {
            getOrderByClientOrderId() {
                return __awaiter(this, void 0, void 0, function* () {
                    return ORDERS;
                });
            },
        };
    });
};
const patchGasPrices = () => {
    (0, patch_1.patch)(dexalot, 'estimateGas', () => {
        return GAS_PRICES;
    });
};
describe('GET /clob/markets', () => {
    it('should return 200 with proper request', () => __awaiter(void 0, void 0, void 0, function* () {
        patchMarkets();
        yield (0, supertest_1.default)(app_1.gatewayApp)
            .get(`/clob/markets`)
            .query({
            chain: 'avalanche',
            network: 'dexalot',
            connector: 'dexalot',
        })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect((res) => {
            expect(res.body.markets.length).toEqual(1);
        });
    }));
    it('should return 404 when parameters are invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.gatewayApp)
            .get(`/clob/markets`)
            .query(INVALID_REQUEST)
            .expect(404);
    }));
});
describe('GET /clob/orderBook', () => {
    it('should return 200 with proper request', () => __awaiter(void 0, void 0, void 0, function* () {
        patchOrderBook();
        yield (0, supertest_1.default)(app_1.gatewayApp)
            .get(`/clob/orderBook`)
            .query({
            chain: 'avalanche',
            network: 'dexalot',
            connector: 'dexalot',
            market: MARKET,
        })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect((res) => expect(res.body.buys[0].price).toEqual('5.0'))
            .expect((res) => expect(res.body.sells[0].price).toEqual('5.0'));
    }));
    it('should return 404 when parameters are invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.gatewayApp)
            .get(`/clob/orderBook`)
            .query(INVALID_REQUEST)
            .expect(404);
    }));
});
describe('GET /clob/ticker', () => {
    it('should return 200 with proper request', () => __awaiter(void 0, void 0, void 0, function* () {
        patchMarkets();
        yield (0, supertest_1.default)(app_1.gatewayApp)
            .get(`/clob/ticker`)
            .query({
            chain: 'avalanche',
            network: 'dexalot',
            connector: 'dexalot',
            market: MARKET,
        })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect((res) => expect(res.body.markets.baseSymbol).toEqual('BTC.b'))
            .expect((res) => expect(res.body.markets.quoteSymbol).toEqual('USDC'));
    }));
    it('should return 404 when parameters are invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.gatewayApp)
            .get(`/clob/ticker`)
            .query(INVALID_REQUEST)
            .expect(404);
    }));
});
describe('GET /clob/orders', () => {
    it('should return 200 with proper request', () => __awaiter(void 0, void 0, void 0, function* () {
        patchOrders();
        yield (0, supertest_1.default)(app_1.gatewayApp)
            .get(`/clob/orders`)
            .query({
            chain: 'avalanche',
            network: 'dexalot',
            connector: 'dexalot',
            address: '0x261362dBC1D83705AB03e99792355689A4589b8E000000000000000000000000',
            market: MARKET,
            orderId: '0x...',
        })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect((res) => expect(res.body.orders.length).toEqual(1));
    }));
    it('should return 404 when parameters are invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.gatewayApp)
            .get(`/clob/orders`)
            .query(INVALID_REQUEST)
            .expect(404);
    }));
});
describe('POST /clob/orders', () => {
    it('should return 200 with proper request', () => __awaiter(void 0, void 0, void 0, function* () {
        patchMsgBroadcaster();
        yield (0, supertest_1.default)(app_1.gatewayApp)
            .post(`/clob/orders`)
            .send({
            chain: 'avalanche',
            network: 'dexalot',
            connector: 'dexalot',
            address: '0x261362dBC1D83705AB03e99792355689A4589b8E',
            market: MARKET,
            price: '10000.12',
            amount: '0.12',
            side: 'BUY',
            orderType: 'LIMIT',
        })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect((res) => expect(res.body.txHash).toEqual(TX_HASH));
    }));
    it('should return 404 when parameters are invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.gatewayApp)
            .post(`/clob/orders`)
            .send(INVALID_REQUEST)
            .expect(404);
    }));
});
describe('DELETE /clob/orders', () => {
    it('should return 200 with proper request', () => __awaiter(void 0, void 0, void 0, function* () {
        patchMsgBroadcaster();
        yield (0, supertest_1.default)(app_1.gatewayApp)
            .delete(`/clob/orders`)
            .send({
            chain: 'avalanche',
            network: 'dexalot',
            connector: 'dexalot',
            address: '0x261362dBC1D83705AB03e99792355689A4589b8E',
            market: MARKET,
            orderId: '0x8ce222ca5da95aaffd87b3d38a307f25d6e2c09e70a0cb8599bc6c8a0851fda3',
        })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect((res) => expect(res.body.txHash).toEqual(TX_HASH));
    }));
    it('should return 404 when parameters are invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.gatewayApp)
            .delete(`/clob/orders`)
            .send(INVALID_REQUEST)
            .expect(404);
    }));
});
describe('POST /clob/batchOrders', () => {
    it('should return 200 with proper request to create batch orders', () => __awaiter(void 0, void 0, void 0, function* () {
        patchMsgBroadcaster();
        yield (0, supertest_1.default)(app_1.gatewayApp)
            .post(`/clob/batchOrders`)
            .send({
            chain: 'avalanche',
            network: 'dexalot',
            connector: 'dexalot',
            address: '0x261362dBC1D83705AB03e99792355689A4589b8E',
            createOrderParams: [
                {
                    price: '2',
                    amount: '0.10',
                    side: 'SELL',
                    orderType: 'LIMIT',
                    market: MARKET,
                },
                {
                    price: '3',
                    amount: '0.10',
                    side: 'SELL',
                    market: MARKET,
                },
            ],
        })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect((res) => expect(res.body.txHash).toEqual(TX_HASH));
    }));
    it('should return 200 with proper request to delete batch orders', () => __awaiter(void 0, void 0, void 0, function* () {
        patchMsgBroadcaster();
        yield (0, supertest_1.default)(app_1.gatewayApp)
            .post(`/clob/batchOrders`)
            .send({
            chain: 'avalanche',
            network: 'dexalot',
            connector: 'dexalot',
            address: '0x261362dBC1D83705AB03e99792355689A4589b8E',
            market: MARKET,
            cancelOrderIds: [
                '0x73af517124c3f564d1d70e38ad5200dfc7101d04986c14df410042e00932d4bf',
                '0x8ce222ca5da95aaffd87b3d38a307f25d6e2c09e70a0cb8599bc6c8a0851fda3',
            ],
        })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect((res) => expect(res.body.txHash).toEqual(TX_HASH));
    }));
    it('should return 404 when parameters are invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.gatewayApp)
            .post(`/clob/batchOrders`)
            .send(INVALID_REQUEST)
            .expect(404);
    }));
});
describe('GET /clob/estimateGas', () => {
    it('should return 200 with proper request', () => __awaiter(void 0, void 0, void 0, function* () {
        patchGasPrices();
        yield (0, supertest_1.default)(app_1.gatewayApp)
            .get(`/clob/estimateGas`)
            .query({
            chain: 'avalanche',
            network: 'dexalot',
            connector: 'dexalot',
        })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect((res) => expect(res.body.gasPrice).toEqual(GAS_PRICES.gasPrice));
    }));
    it('should return 404 when parameters are invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.gatewayApp)
            .get(`/clob/estimateGas`)
            .query(INVALID_REQUEST)
            .expect(404);
    }));
});
//# sourceMappingURL=dexalot.test.js.map