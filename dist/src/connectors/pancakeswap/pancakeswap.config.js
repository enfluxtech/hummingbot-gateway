"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PancakeSwapConfig = void 0;
const network_utils_1 = require("../../network/network.utils");
const config_manager_v2_1 = require("../../services/config-manager-v2");
var PancakeSwapConfig;
(function (PancakeSwapConfig) {
    PancakeSwapConfig.v2Config = (0, network_utils_1.buildConfig)('pancakeswap', ['AMM'], [{ chain: 'binance-smart-chain', networks: ['mainnet', 'testnet'] }], 'EVM');
    PancakeSwapConfig.config = Object.assign(Object.assign({}, PancakeSwapConfig.v2Config), {
        maximumHops: config_manager_v2_1.ConfigManagerV2.getInstance().get(`pancakeswap.maximumHops`),
        pancakeswapV3SmartOrderRouterAddress: (network) => config_manager_v2_1.ConfigManagerV2.getInstance().get(`pancakeswap.contractAddresses.${network}.pancakeswapV3SmartOrderRouterAddress`),
        pancakeswapV3NftManagerAddress: (network) => config_manager_v2_1.ConfigManagerV2.getInstance().get(`pancakeswap.contractAddresses.${network}.pancakeswapV3NftManagerAddress`),
        tradingTypes: (type) => {
            return type === 'swap' ? ['AMM'] : ['AMM_LP'];
        },
        useRouter: config_manager_v2_1.ConfigManagerV2.getInstance().get(`pancakeswap.useRouter`),
        feeTier: config_manager_v2_1.ConfigManagerV2.getInstance().get(`pancakeswap.feeTier`),
    });
})(PancakeSwapConfig || (exports.PancakeSwapConfig = PancakeSwapConfig = {}));
//# sourceMappingURL=pancakeswap.config.js.map