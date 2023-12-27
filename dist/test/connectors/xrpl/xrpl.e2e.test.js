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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../../src/app");
const xrpl_1 = require("xrpl");
const xrpl_2 = require("../../../src/chains/xrpl/xrpl");
const xrpl_3 = require("../../../src/connectors/xrpl/xrpl");
const xrpl_utils_1 = require("../../../src/connectors/xrpl/xrpl.utils");
const patch_1 = require("../../services/patch");
let xrpl;
let xrplCLOB;
const wallet1 = xrpl_1.Wallet.fromSecret('sEd74fJ432TFE4f5Sy48gLyzknkdc1t');
const wallet2 = xrpl_1.Wallet.fromSecret('sEd7oiMn5napJBthB2z4CtN5nVi56Bd');
const MARKET = 'USD-VND';
let postedOrderTxn;
const INVALID_REQUEST = {
    chain: 'unknown',
    network: 'testnet',
};
const patchWalletXRPL = () => {
    (0, patch_1.patch)(xrpl, 'getWallet', (walletAddress) => {
        if (walletAddress === 'r9wmQfStbNfPJ2XqAN7KH4iP8NJKmqPe16')
            return wallet1;
        return wallet2;
    });
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    xrpl = xrpl_2.XRPL.getInstance('testnet');
    xrplCLOB = xrpl_3.XRPLCLOB.getInstance('xrpl', 'testnet');
    patchWalletXRPL();
    yield xrpl.init();
    yield xrplCLOB.init();
    yield new Promise((resolve) => setTimeout(resolve, 1000));
}));
beforeEach(() => {
    patchWalletXRPL();
});
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield xrpl.close();
}));
describe('Get estimated gas price', () => {
    it('should return 200 with proper request', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.gatewayApp)
            .get(`/clob/estimateGas`)
            .query({
            chain: 'xrpl',
            network: 'testnet',
            connector: 'xrpl',
        })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect((res) => expect(res.body.gasPrice).toBeDefined());
    }));
    it('should return 404 when parameters are invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.gatewayApp)
            .get(`/clob/estimateGas`)
            .query(INVALID_REQUEST)
            .expect(404);
    }));
});
describe('Get Markets List', () => {
    it('should return a list of markets', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.gatewayApp)
            .get(`/clob/markets`)
            .query({
            chain: 'xrpl',
            network: 'testnet',
            connector: 'xrpl',
        })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect((res) => {
            expect(res.body.markets.length).toBeGreaterThan(0);
        });
    }));
});
describe(`Get ticker info for ${MARKET}`, () => {
    it('should return 200 with proper request', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.gatewayApp)
            .get(`/clob/ticker`)
            .query({
            chain: 'xrpl',
            network: 'testnet',
            connector: 'xrpl',
            market: MARKET,
        })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect((res) => expect(res.body.markets[0].baseCurrency).toEqual('USD'))
            .expect((res) => expect(res.body.markets[0].quoteCurrency).toEqual('VND'));
    }));
    it('should return 404 when parameters are invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.gatewayApp)
            .get(`/clob/ticker`)
            .query(INVALID_REQUEST)
            .expect(404);
    }));
});
describe('Post order', () => {
    it('should return 200 with proper request', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.gatewayApp)
            .post(`/clob/orders`)
            .send({
            chain: 'xrpl',
            network: 'testnet',
            connector: 'xrpl',
            address: 'r9wmQfStbNfPJ2XqAN7KH4iP8NJKmqPe16',
            market: MARKET,
            price: '20000',
            amount: '0.1',
            side: 'BUY',
            orderType: 'LIMIT',
        })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect((res) => {
            expect(res.body.txHash).toBeDefined();
            postedOrderTxn = res.body.txHash;
        });
    }));
    it('should return PENDING_OPEN with proper request', () => __awaiter(void 0, void 0, void 0, function* () {
        yield checkOrderStatus(postedOrderTxn, 10, 'PENDING_OPEN', 500, wallet1.address, true);
    }));
    it('should return OPEN with proper request', () => __awaiter(void 0, void 0, void 0, function* () {
        yield checkOrderStatus(postedOrderTxn, 9, 'OPEN', 1000, wallet1.address, true);
    }));
    it('should return 404 when parameters are invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.gatewayApp)
            .post(`/clob/orders`)
            .send(INVALID_REQUEST)
            .expect(404);
    }));
    it('should return 404 when parameters are invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.gatewayApp)
            .get(`/clob/orders`)
            .query(INVALID_REQUEST)
            .expect(404);
    }));
});
describe('Get orderbook details', () => {
    it('should return 200 with proper request with USD-VND', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.gatewayApp)
            .get(`/clob/orderBook`)
            .query({
            chain: 'xrpl',
            network: 'testnet',
            connector: 'xrpl',
            market: MARKET,
        })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect((res) => {
            expect(res.body.buys.length).toBeGreaterThan(0);
        });
    }));
    it('should return 404 when parameters are invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.gatewayApp)
            .get(`/clob/orderBook`)
            .query(INVALID_REQUEST)
            .expect(404);
    }));
});
describe('Delete order', () => {
    it('should return 200 with proper request', () => __awaiter(void 0, void 0, void 0, function* () {
        const postedOrderSequence = yield (0, xrpl_utils_1.getsSequenceNumberFromTxn)('testnet', postedOrderTxn);
        expect(postedOrderSequence).toBeDefined();
        yield (0, supertest_1.default)(app_1.gatewayApp)
            .delete(`/clob/orders`)
            .send({
            chain: 'xrpl',
            network: 'testnet',
            connector: 'xrpl',
            address: 'r9wmQfStbNfPJ2XqAN7KH4iP8NJKmqPe16',
            market: MARKET,
            orderId: postedOrderSequence === null || postedOrderSequence === void 0 ? void 0 : postedOrderSequence.toString(),
        })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect((res) => expect(res.body.txHash).toBeDefined());
    }));
    it('should return PENDING_CANCEL with proper request', () => __awaiter(void 0, void 0, void 0, function* () {
        yield checkOrderStatus(postedOrderTxn, 10, 'PENDING_CANCEL', 500, wallet1.address, true);
    }));
    it('should return CANCELED with proper request', () => __awaiter(void 0, void 0, void 0, function* () {
        yield checkOrderStatus(postedOrderTxn, 9, 'CANCELED', 1000, wallet1.address, true);
    }));
    it('should return 404 when parameters are invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.gatewayApp)
            .delete(`/clob/orders`)
            .send(INVALID_REQUEST)
            .expect(404);
    }));
});
describe('Post order to be consumed', () => {
    it('should return 200 with proper request', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.gatewayApp)
            .post(`/clob/orders`)
            .send({
            chain: 'xrpl',
            network: 'testnet',
            connector: 'xrpl',
            address: wallet2.address,
            market: MARKET,
            price: '20000',
            amount: '0.1',
            side: 'BUY',
            orderType: 'LIMIT',
        })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect((res) => {
            expect(res.body.txHash).toBeDefined();
            postedOrderTxn = res.body.txHash;
        });
    }));
    it('should return PENDING_OPEN with proper request', () => __awaiter(void 0, void 0, void 0, function* () {
        yield checkOrderStatus(postedOrderTxn, 9, 'PENDING_OPEN', 1000, wallet2.address, true);
    }));
    it('should return OPEN with proper request', () => __awaiter(void 0, void 0, void 0, function* () {
        yield checkOrderStatus(postedOrderTxn, 9, 'OPEN', 1000, wallet2.address, true);
    }));
    describe('Consume posted order', () => {
        it('should return 200 with proper request', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(app_1.gatewayApp)
                .post(`/clob/orders`)
                .send({
                chain: 'xrpl',
                network: 'testnet',
                connector: 'xrpl',
                address: wallet1.classicAddress,
                market: MARKET,
                price: '19999',
                amount: '0.05',
                side: 'SELL',
                orderType: 'LIMIT',
            })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect((res) => {
                expect(res.body.txHash).toBeDefined();
            });
        }));
        it('should return PARTIALLY_FILLED with proper request', () => __awaiter(void 0, void 0, void 0, function* () {
            yield checkOrderStatus(postedOrderTxn, 9, 'PARTIALLY_FILLED', 1000, wallet2.classicAddress, true);
        }));
        it('should return 200 with proper request', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(app_1.gatewayApp)
                .post(`/clob/orders`)
                .send({
                chain: 'xrpl',
                network: 'testnet',
                connector: 'xrpl',
                address: wallet1.classicAddress,
                market: MARKET,
                price: '19999',
                amount: '0.051',
                side: 'SELL',
                orderType: 'LIMIT',
            })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect((res) => {
                expect(res.body.txHash).toBeDefined();
            });
        }));
        it('should return FILLED with proper request', () => __awaiter(void 0, void 0, void 0, function* () {
            yield checkOrderStatus(postedOrderTxn, 9, 'FILLED', 1000, wallet2.classicAddress, true);
        }));
        it('should cancel outstanding orders', () => __awaiter(void 0, void 0, void 0, function* () {
            let wallet1OutstandingOrders = [];
            let wallet2OutstandingOrders = [];
            yield (0, supertest_1.default)(app_1.gatewayApp)
                .get(`/clob/orders`)
                .query({
                chain: 'xrpl',
                network: 'testnet',
                connector: 'xrpl',
                address: wallet1.classicAddress,
                market: MARKET,
                orderId: 'all',
            })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((res) => {
                wallet1OutstandingOrders = res.body.orders.filter((order) => {
                    return order.state !== 'FILLED' && order.state !== 'CANCELED';
                });
            });
            yield (0, supertest_1.default)(app_1.gatewayApp)
                .get(`/clob/orders`)
                .query({
                chain: 'xrpl',
                network: 'testnet',
                connector: 'xrpl',
                address: wallet2.classicAddress,
                market: MARKET,
                orderId: 'all',
            })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((res) => {
                wallet2OutstandingOrders = res.body.orders.filter((order) => {
                    return order.state !== 'FILLED' && order.state !== 'CANCELED';
                });
            });
            if (wallet1OutstandingOrders.length > 0) {
                wallet1OutstandingOrders.forEach((order) => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, supertest_1.default)(app_1.gatewayApp)
                        .delete(`/clob/orders`)
                        .send({
                        chain: 'xrpl',
                        network: 'testnet',
                        connector: 'xrpl',
                        address: wallet1.classicAddress,
                        market: MARKET,
                        orderId: order.hash.toString(),
                    })
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .expect((res) => expect(res.body.txHash).toBeDefined());
                }));
            }
            if (wallet2OutstandingOrders.length > 0) {
                wallet2OutstandingOrders.forEach((order) => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, supertest_1.default)(app_1.gatewayApp)
                        .delete(`/clob/orders`)
                        .send({
                        chain: 'xrpl',
                        network: 'testnet',
                        connector: 'xrpl',
                        address: wallet2.classicAddress,
                        market: MARKET,
                        orderId: order.hash.toString(),
                    })
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .expect((res) => expect(res.body.txHash).toBeDefined());
                }));
            }
            yield new Promise((resolve) => setTimeout(resolve, 5000));
            (0, patch_1.unpatch)();
        }));
    });
});
function checkOrderStatus(postedOrderTxn, maxCheckCount, state, requestFrequency = 1000, walletAddress, getAllOrdres = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const postedOrderSequence = yield (0, xrpl_utils_1.getsSequenceNumberFromTxn)('testnet', postedOrderTxn);
        if (postedOrderSequence === undefined) {
            throw new Error('postedOrderSequence is undefined');
        }
        let hasPassed = false;
        let checkCount = 0;
        let orderState = '';
        let orders = [];
        while (!hasPassed && checkCount < maxCheckCount) {
            yield (0, supertest_1.default)(app_1.gatewayApp)
                .get(`/clob/orders`)
                .query({
                chain: 'xrpl',
                network: 'testnet',
                connector: 'xrpl',
                address: walletAddress,
                market: MARKET,
                orderId: getAllOrdres ? 'all' : postedOrderSequence,
            })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((res) => {
                orders = res.body.orders;
            });
            if (orders.length > 0) {
                const postedOrder = orders.find((order) => order.hash === postedOrderSequence);
                if (postedOrder !== undefined) {
                    orderState = postedOrder.state;
                    if (orderState === state) {
                        hasPassed = true;
                    }
                }
            }
            checkCount++;
            yield new Promise((resolve) => setTimeout(resolve, requestFrequency));
        }
        expect(orderState).toBe(state);
        expect(hasPassed).toBe(true);
    });
}
//# sourceMappingURL=xrpl.e2e.test.js.map