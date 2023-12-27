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
const xrpl_1 = require("../../../src/chains/xrpl/xrpl");
const patch_1 = require("../../services/patch");
const app_1 = require("../../../src/app");
const xrpl_2 = require("xrpl");
let xrplChain;
const wallet1 = xrpl_2.Wallet.fromSecret('sEd74fJ432TFE4f5Sy48gLyzknkdc1t');
const wallet2 = xrpl_2.Wallet.fromSecret('sEd7oiMn5napJBthB2z4CtN5nVi56Bd');
const patchWallet = () => {
    (0, patch_1.patch)(xrplChain, 'getWallet', (walletAddress) => {
        if (walletAddress === 'r9wmQfStbNfPJ2XqAN7KH4iP8NJKmqPe16')
            return wallet1;
        return wallet2;
    });
};
const patchDatabase = () => {
    (0, patch_1.patch)(xrplChain, '_orderStorage', {
        declareOwnership: () => {
            return;
        },
        init: () => {
            return;
        },
        close: () => {
            return;
        },
    });
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    xrplChain = xrpl_1.XRPL.getInstance('testnet');
    patchDatabase();
    yield xrplChain.init();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    (0, patch_1.unpatch)();
    yield xrplChain.close();
}));
describe('POST /chain/balances', () => {
    it('should return 200 with correct parameters', () => __awaiter(void 0, void 0, void 0, function* () {
        patchWallet();
        yield (0, supertest_1.default)(app_1.gatewayApp)
            .post(`/chain/balances`)
            .send({
            chain: 'xrpl',
            network: 'testnet',
            address: 'r3z4R6KQWfwRf9G15AhUZe2GN67Sj6PYNV',
        })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect((res) => {
            expect(res.body).toBeDefined();
        });
    }));
    it('should return 404 when parameters are invalid/incomplete', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, patch_1.unpatch)();
        yield (0, supertest_1.default)(app_1.gatewayApp)
            .post(`/chain/balances`)
            .send({
            chain: 'xrpl',
            network: 'testnet',
        })
            .expect(404);
    }));
});
describe('POST /chain/poll', () => {
    it('should return 200 with correct parameters', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.gatewayApp).post('/chain/poll').send({
            chain: 'xrpl',
            network: 'testnet',
            txHash: 'A4A9E7C76ACA5527AC09A7540F263CA48FF40F5CFE04DD19B7173B05E3685077',
        });
        expect(res.statusCode).toEqual(200);
    }));
    it('should get unknown error with invalid txHash', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.gatewayApp).post('/chain/poll').send({
            chain: 'xrpl',
            network: 'testnet',
            txHash: 123,
        });
        expect(res.statusCode).toEqual(404);
    }));
});
describe('GET /chain/tokens', () => {
    it('should return 200 with correct parameters', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.gatewayApp)
            .get('/chain/tokens')
            .query({
            chain: 'xrpl',
            network: 'testnet',
            tokenSymbols: ['XRP', 'SOLO'],
        });
        expect(res.statusCode).toEqual(200);
    }));
    it('should get unknown error with invalid tokenSymbols', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.gatewayApp).get('/chain/tokens').query({
            chain: 'xrpl',
            network: 'testnet',
            tokenSymbols: 123,
        });
        expect(res.statusCode).toEqual(404);
    }));
});
//# sourceMappingURL=xrpl.routes.test.js.map