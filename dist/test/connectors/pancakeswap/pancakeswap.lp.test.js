"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
jest.useFakeTimers();
const swap_sdk_core_1 = require("@pancakeswap/swap-sdk-core");
const v3 = __importStar(require("@pancakeswap/v3-sdk"));
const ethers_1 = require("ethers");
const binance_smart_chain_1 = require("../../../src/chains/binance-smart-chain/binance-smart-chain");
const pancakeswap_lp_1 = require("../../../src/connectors/pancakeswap/pancakeswap.lp");
const patch_1 = require("../../services/patch");
const evm_nonce_mock_1 = require("../../evm.nonce.mock");
let bsc;
let pancakeswapLP;
let wallet;
const WETH = new swap_sdk_core_1.Token(97, '0x8babbb98678facc7342735486c851abd7a0d17ca', 18, 'WETH');
const DAI = new swap_sdk_core_1.Token(97, '0x8a9424745056Eb399FD19a0EC26A14316684e274', 18, 'DAI');
const USDC = new swap_sdk_core_1.Token(97, '0x7ef95a0fee0dd31b22626fa2e10ee6a223f8a684', 6, 'USDC');
const TX = {
    type: 2,
    chainId: 97,
    nonce: 115,
    maxPriorityFeePerGas: { toString: () => '106000000000' },
    maxFeePerGas: { toString: () => '106000000000' },
    gasPrice: { toString: () => null },
    gasLimit: { toString: () => '100000' },
    to: '0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60',
    value: { toString: () => '0' },
    data: '0x095ea7b30000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488dffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
    accessList: [],
    hash: '0x75f98675a8f64dcf14927ccde9a1d59b67fa09b72cc2642ad055dae4074853d9',
    v: 0,
    r: '0xbeb9aa40028d79b9fdab108fcef5de635457a05f3a254410414c095b02c64643',
    s: '0x5a1506fa4b7f8b4f3826d8648f27ebaa9c0ee4bd67f569414b8cd8884c073100',
    from: '0xFaA12FD102FE8623C9299c72B03E45107F2772B5',
    confirmations: 0,
};
const POOL_SQRT_RATIO_START = v3.encodeSqrtRatioX96(100e6, 100e18);
const POOL_TICK_CURRENT = v3.TickMath.getTickAtSqrtRatio(POOL_SQRT_RATIO_START);
const DAI_USDC_POOL = new v3.Pool(DAI, USDC, 500, POOL_SQRT_RATIO_START, 0, POOL_TICK_CURRENT, []);
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    bsc = binance_smart_chain_1.BinanceSmartChain.getInstance('testnet');
    (0, evm_nonce_mock_1.patchEVMNonceManager)(bsc.nonceManager);
    yield bsc.init();
    wallet = new ethers_1.Wallet('0000000000000000000000000000000000000000000000000000000000000002', bsc.provider);
    pancakeswapLP = pancakeswap_lp_1.PancakeswapLP.getInstance('binance-smart-chain', 'testnet');
    yield pancakeswapLP.init();
}));
beforeEach(() => {
    (0, evm_nonce_mock_1.patchEVMNonceManager)(bsc.nonceManager);
});
afterEach(() => {
    (0, patch_1.unpatch)();
});
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield bsc.close();
}));
const patchPoolState = () => {
    (0, patch_1.patch)(pancakeswapLP, 'getPoolContract', () => {
        return {
            liquidity() {
                return DAI_USDC_POOL.liquidity;
            },
            slot0() {
                return [
                    DAI_USDC_POOL.sqrtRatioX96,
                    DAI_USDC_POOL.tickCurrent,
                    0,
                    1,
                    1,
                    0,
                    true,
                ];
            },
            ticks() {
                return ['-118445039955967015140', '118445039955967015140'];
            },
        };
    });
};
const patchContract = () => {
    (0, patch_1.patch)(pancakeswapLP, 'getContract', () => {
        return {
            estimateGas: {
                multicall() {
                    return ethers_1.BigNumber.from(5);
                },
            },
            positions() {
                return {
                    token0: WETH.address,
                    token1: USDC.address,
                    fee: 500,
                    tickLower: 0,
                    tickUpper: 23030,
                    liquidity: '6025055903594410671025',
                };
            },
            multicall() {
                return TX;
            },
            collect() {
                return TX;
            },
        };
    });
};
const patchWallet = () => {
    (0, patch_1.patch)(wallet, 'sendTransaction', () => {
        return TX;
    });
};
describe('verify PancakeswapLP Nft functions', () => {
    it('Should return correct contract addresses', () => __awaiter(void 0, void 0, void 0, function* () {
        expect(pancakeswapLP.router).toEqual('0x1b81D678ffb9C0263b24A97847620C99d213eB14');
        expect(pancakeswapLP.nftManager).toEqual('0x427bF5b37357632377eCbEC9de3626C71A5396c1');
    }));
    it('Should return correct contract abi', () => __awaiter(void 0, void 0, void 0, function* () {
        expect(Array.isArray(pancakeswapLP.routerAbi)).toEqual(true);
        expect(Array.isArray(pancakeswapLP.nftAbi)).toEqual(true);
        expect(Array.isArray(pancakeswapLP.poolAbi)).toEqual(true);
    }));
    it('addPositionHelper returns calldata and value', () => __awaiter(void 0, void 0, void 0, function* () {
        patchPoolState();
        const callData = yield pancakeswapLP.addPositionHelper(wallet, DAI, WETH, '10', '10', 500, 1, 10);
        expect(callData).toHaveProperty('calldata');
        expect(callData).toHaveProperty('value');
    }));
    it('reducePositionHelper returns calldata and value', () => __awaiter(void 0, void 0, void 0, function* () {
        patchPoolState();
        patchContract();
        const callData = yield pancakeswapLP.reducePositionHelper(wallet, 1, 100);
        expect(callData).toHaveProperty('calldata');
        expect(callData).toHaveProperty('value');
    }));
    it('basic functions should work', () => __awaiter(void 0, void 0, void 0, function* () {
        patchContract();
        patchPoolState();
        expect(pancakeswapLP.ready()).toEqual(true);
        expect(pancakeswapLP.gasLimitEstimate).toBeGreaterThan(0);
        expect(typeof pancakeswapLP.getContract('nft', bsc.provider)).toEqual('object');
        expect(typeof pancakeswapLP.getPoolContract('0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa', wallet)).toEqual('object');
    }));
    it('generateOverrides returns overrides correctly', () => __awaiter(void 0, void 0, void 0, function* () {
        const overrides = pancakeswapLP.generateOverrides(1, 2, 3, ethers_1.BigNumber.from(4), ethers_1.BigNumber.from(5), '6');
        expect(overrides.gasLimit).toEqual(ethers_1.BigNumber.from('1'));
        expect(overrides.gasPrice).toBeUndefined();
        expect(overrides.nonce).toEqual(ethers_1.BigNumber.from(3));
        expect(overrides.maxFeePerGas).toEqual(ethers_1.BigNumber.from(4));
        expect(overrides.maxPriorityFeePerGas).toEqual(ethers_1.BigNumber.from(5));
        expect(overrides.value).toEqual(ethers_1.BigNumber.from('6'));
    }));
    it('reducePosition should work', () => __awaiter(void 0, void 0, void 0, function* () {
        patchPoolState();
        patchContract();
        const reduceTx = (yield pancakeswapLP.reducePosition(wallet, 1, 100, 50000, 10));
        expect(reduceTx.hash).toEqual('0x75f98675a8f64dcf14927ccde9a1d59b67fa09b72cc2642ad055dae4074853d9');
    }));
    it('addPosition should work', () => __awaiter(void 0, void 0, void 0, function* () {
        patchPoolState();
        patchWallet();
        const addTx = yield pancakeswapLP.addPosition(wallet, DAI, WETH, '10', '10', 'LOWEST', 1, 10, 0, 1, 1);
        expect(addTx.hash).toEqual('0x75f98675a8f64dcf14927ccde9a1d59b67fa09b72cc2642ad055dae4074853d9');
    }));
    it('collectFees should work', () => __awaiter(void 0, void 0, void 0, function* () {
        patchContract();
        const collectTx = (yield pancakeswapLP.collectFees(wallet, 1));
        expect(collectTx.hash).toEqual('0x75f98675a8f64dcf14927ccde9a1d59b67fa09b72cc2642ad055dae4074853d9');
    }));
});
//# sourceMappingURL=pancakeswap.lp.test.js.map