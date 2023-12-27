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
jest.useFakeTimers();
const { MockProvider } = require('mock-ethers-provider');
const uniswap_1 = require("../../../src/connectors/uniswap/uniswap");
const patch_1 = require("../../../test/services/patch");
const error_handler_1 = require("../../../src/services/error-handler");
const sdk_core_1 = require("@uniswap/sdk-core");
const v2_sdk_1 = require("@uniswap/v2-sdk");
const router_sdk_1 = require("@uniswap/router-sdk");
const ethers_1 = require("ethers");
const ethereum_1 = require("../../../src/chains/ethereum/ethereum");
const evm_nonce_mock_1 = require("../../evm.nonce.mock");
const uniswap_config_1 = require("../../../src/connectors/uniswap/uniswap.config");
const v3_sdk_1 = require("@uniswap/v3-sdk");
let ethereum;
let uniswap;
let mockProvider;
const WETH = new sdk_core_1.Token(3, '0xd0A1E359811322d97991E03f863a0C30C2cF029C', 18, 'WETH');
const DAI = new sdk_core_1.Token(3, '0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa', 18, 'DAI');
const DAI_WETH_POOL_ADDRESS = '0xBEff876AC507446457C2A6bDA9F7021A97A8547f';
const POOL_SQRT_RATIO_START = (0, v3_sdk_1.encodeSqrtRatioX96)(100e6, 100e18);
const POOL_TICK_CURRENT = v3_sdk_1.TickMath.getTickAtSqrtRatio(POOL_SQRT_RATIO_START);
const POOL_LIQUIDITY = 0;
const DAI_WETH_POOL = new v3_sdk_1.Pool(WETH, DAI, v3_sdk_1.FeeAmount.MEDIUM, POOL_SQRT_RATIO_START, POOL_LIQUIDITY, POOL_TICK_CURRENT);
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    ethereum = ethereum_1.Ethereum.getInstance('goerli');
    (0, evm_nonce_mock_1.patchEVMNonceManager)(ethereum.nonceManager);
    yield ethereum.init();
}));
beforeEach(() => {
    (0, evm_nonce_mock_1.patchEVMNonceManager)(ethereum.nonceManager);
});
afterEach(() => {
    (0, patch_1.unpatch)();
});
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield ethereum.close();
}));
const patchTrade = (_key, error) => {
    (0, patch_1.patch)(uniswap.alphaRouter, 'route', () => {
        if (error)
            return false;
        const WETH_DAI = new v2_sdk_1.Pair(sdk_core_1.CurrencyAmount.fromRawAmount(WETH, '2000000000000000000'), sdk_core_1.CurrencyAmount.fromRawAmount(DAI, '1000000000000000000'));
        const DAI_TO_WETH = new v2_sdk_1.Route([WETH_DAI], DAI, WETH);
        return {
            quote: sdk_core_1.CurrencyAmount.fromRawAmount(DAI, '1000000000000000000'),
            quoteGasAdjusted: sdk_core_1.CurrencyAmount.fromRawAmount(DAI, '1000000000000000000'),
            estimatedGasUsed: ethers_1.utils.parseEther('100'),
            estimatedGasUsedQuoteToken: sdk_core_1.CurrencyAmount.fromRawAmount(DAI, '1000000000000000000'),
            estimatedGasUsedUSD: sdk_core_1.CurrencyAmount.fromRawAmount(DAI, '1000000000000000000'),
            gasPriceWei: ethers_1.utils.parseEther('100'),
            trade: new router_sdk_1.Trade({
                v2Routes: [
                    {
                        routev2: DAI_TO_WETH,
                        inputAmount: sdk_core_1.CurrencyAmount.fromRawAmount(DAI, '1000000000000000000'),
                        outputAmount: sdk_core_1.CurrencyAmount.fromRawAmount(WETH, '2000000000000000000'),
                    },
                ],
                v3Routes: [],
                tradeType: sdk_core_1.TradeType.EXACT_INPUT,
            }),
            route: [],
            blockNumber: ethers_1.BigNumber.from(5000),
        };
    });
};
const patchMockProvider = () => {
    mockProvider.setMockContract(v3_sdk_1.FACTORY_ADDRESS, require('@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json')
        .abi);
    mockProvider.stub(v3_sdk_1.FACTORY_ADDRESS, 'getPool', DAI_WETH_POOL_ADDRESS);
    mockProvider.setMockContract(uniswap_config_1.UniswapConfig.config.quoterContractAddress('goerli'), require('@uniswap/swap-router-contracts/artifacts/contracts/lens/QuoterV2.sol/QuoterV2.json')
        .abi);
    mockProvider.stub(uniswap_config_1.UniswapConfig.config.quoterContractAddress('goerli'), 'quoteExactInputSingle', 1, 0, 0, 0);
    mockProvider.stub(uniswap_config_1.UniswapConfig.config.quoterContractAddress('goerli'), 'quoteExactOutputSingle', 1, 0, 0, 0);
    mockProvider.setMockContract(DAI_WETH_POOL_ADDRESS, require('@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json')
        .abi);
    mockProvider.stub(DAI_WETH_POOL_ADDRESS, 'slot0', DAI_WETH_POOL.sqrtRatioX96.toString(), DAI_WETH_POOL.tickCurrent, 0, 1, 1, 0, true);
    mockProvider.stub(DAI_WETH_POOL_ADDRESS, 'liquidity', 0);
    (0, patch_1.patch)(ethereum, 'provider', () => {
        return mockProvider;
    });
};
const patchGetPool = (address) => {
    mockProvider.setMockContract(v3_sdk_1.FACTORY_ADDRESS, require('@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json')
        .abi);
    mockProvider.stub(v3_sdk_1.FACTORY_ADDRESS, 'getPool', address);
};
const useRouter = () => __awaiter(void 0, void 0, void 0, function* () {
    const config = uniswap_config_1.UniswapConfig.config;
    config.useRouter = true;
    (0, patch_1.patch)(uniswap_1.Uniswap, '_instances', () => ({}));
    uniswap = uniswap_1.Uniswap.getInstance('ethereum', 'goerli');
    yield uniswap.init();
});
const useQouter = () => __awaiter(void 0, void 0, void 0, function* () {
    const config = uniswap_config_1.UniswapConfig.config;
    config.useRouter = false;
    config.feeTier = 'MEDIUM';
    (0, patch_1.patch)(uniswap_1.Uniswap, '_instances', () => ({}));
    uniswap = uniswap_1.Uniswap.getInstance('ethereum', 'goerli');
    yield uniswap.init();
    mockProvider = new MockProvider();
    patchMockProvider();
});
describe('verify Uniswap estimateSellTrade', () => {
    describe('when using router', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            yield useRouter();
        }));
        it('Should return an ExpectedTrade when available', () => __awaiter(void 0, void 0, void 0, function* () {
            patchTrade('bestTradeExactIn');
            const expectedTrade = yield uniswap.estimateSellTrade(WETH, DAI, ethers_1.BigNumber.from(1));
            expect(expectedTrade).toHaveProperty('trade');
            expect(expectedTrade).toHaveProperty('expectedAmount');
        }));
        it('Should throw an error if no pair is available', () => __awaiter(void 0, void 0, void 0, function* () {
            patchTrade('bestTradeExactIn', new Error('error getting trade'));
            yield expect(() => __awaiter(void 0, void 0, void 0, function* () {
                yield uniswap.estimateSellTrade(WETH, DAI, ethers_1.BigNumber.from(1));
            })).rejects.toThrow(error_handler_1.UniswapishPriceError);
        }));
    });
    describe('when using qouter', () => {
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield useQouter();
        }));
        it('Should return an ExpectedTrade when available', () => __awaiter(void 0, void 0, void 0, function* () {
            patchGetPool(DAI_WETH_POOL_ADDRESS);
            const expectedTrade = yield uniswap.estimateSellTrade(WETH, DAI, ethers_1.BigNumber.from(1));
            expect(expectedTrade).toHaveProperty('trade');
            expect(expectedTrade).toHaveProperty('expectedAmount');
        }));
        it('Should throw an error if no pair is available', () => __awaiter(void 0, void 0, void 0, function* () {
            patchGetPool(ethers_1.constants.AddressZero);
            yield expect(() => __awaiter(void 0, void 0, void 0, function* () {
                yield uniswap.estimateSellTrade(WETH, DAI, ethers_1.BigNumber.from(1));
            })).rejects.toThrow(error_handler_1.UniswapishPriceError);
        }));
    });
});
describe('verify Uniswap estimateBuyTrade', () => {
    describe('when using router', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            yield useRouter();
        }));
        it('Should return an ExpectedTrade when available', () => __awaiter(void 0, void 0, void 0, function* () {
            patchTrade('bestTradeExactOut');
            const expectedTrade = yield uniswap.estimateBuyTrade(WETH, DAI, ethers_1.BigNumber.from(1));
            expect(expectedTrade).toHaveProperty('trade');
            expect(expectedTrade).toHaveProperty('expectedAmount');
        }));
        it('Should return an error if no pair is available', () => __awaiter(void 0, void 0, void 0, function* () {
            patchTrade('bestTradeExactOut', new Error('error getting trade'));
            yield expect(() => __awaiter(void 0, void 0, void 0, function* () {
                yield uniswap.estimateBuyTrade(WETH, DAI, ethers_1.BigNumber.from(1));
            })).rejects.toThrow(error_handler_1.UniswapishPriceError);
        }));
    });
    describe('when using qouter', () => {
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield useQouter();
        }));
        it('Should return an ExpectedTrade when available', () => __awaiter(void 0, void 0, void 0, function* () {
            patchGetPool(DAI_WETH_POOL_ADDRESS);
            const expectedTrade = yield uniswap.estimateBuyTrade(WETH, DAI, ethers_1.BigNumber.from(1));
            expect(expectedTrade).toHaveProperty('trade');
            expect(expectedTrade).toHaveProperty('expectedAmount');
        }));
        it('Should throw an error if no pair is available', () => __awaiter(void 0, void 0, void 0, function* () {
            patchGetPool(ethers_1.constants.AddressZero);
            yield expect(() => __awaiter(void 0, void 0, void 0, function* () {
                yield uniswap.estimateBuyTrade(WETH, DAI, ethers_1.BigNumber.from(1));
            })).rejects.toThrow(error_handler_1.UniswapishPriceError);
        }));
    });
});
describe('getAllowedSlippage', () => {
    it('return value of string when not null', () => {
        const allowedSlippage = uniswap.getAllowedSlippage('1/100');
        expect(allowedSlippage).toEqual(new sdk_core_1.Percent('1', '100'));
    });
    it('return value from config when string is null', () => {
        const allowedSlippage = uniswap.getAllowedSlippage();
        expect(allowedSlippage).toEqual(new sdk_core_1.Percent('2', '100'));
    });
    it('return value from config when string is malformed', () => {
        const allowedSlippage = uniswap.getAllowedSlippage('yo');
        expect(allowedSlippage).toEqual(new sdk_core_1.Percent('2', '100'));
    });
});
//# sourceMappingURL=uniswap.test.js.map