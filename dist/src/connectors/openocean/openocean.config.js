"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenoceanConfig = void 0;
const config_manager_v2_1 = require("../../services/config-manager-v2");
var OpenoceanConfig;
(function (OpenoceanConfig) {
    OpenoceanConfig.config = {
        allowedSlippage: config_manager_v2_1.ConfigManagerV2.getInstance().get('openocean.allowedSlippage'),
        gasLimitEstimate: config_manager_v2_1.ConfigManagerV2.getInstance().get(`openocean.gasLimitEstimate`),
        ttl: config_manager_v2_1.ConfigManagerV2.getInstance().get('openocean.ttl'),
        routerAddress: (chain, network) => config_manager_v2_1.ConfigManagerV2.getInstance().get('openocean.contractAddresses.' +
            chain +
            '.' +
            network +
            '.routerAddress'),
        tradingTypes: ['AMM'],
        chainType: 'EVM',
        availableNetworks: [
            { chain: 'avalanche', networks: ['avalanche'] },
            { chain: 'ethereum', networks: ['mainnet', 'arbitrum', 'optimism'] },
            { chain: 'polygon', networks: ['mainnet'] },
            { chain: 'harmony', networks: ['mainnet'] },
            { chain: 'binance-smart-chain', networks: ['mainnet'] },
            { chain: 'cronos', networks: ['mainnet'] },
        ],
    };
})(OpenoceanConfig || (exports.OpenoceanConfig = OpenoceanConfig = {}));
//# sourceMappingURL=openocean.config.js.map