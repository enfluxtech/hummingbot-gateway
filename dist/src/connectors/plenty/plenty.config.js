"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlentyConfig = void 0;
const config_manager_v2_1 = require("../../services/config-manager-v2");
var PlentyConfig;
(function (PlentyConfig) {
    PlentyConfig.config = {
        allowedSlippage: config_manager_v2_1.ConfigManagerV2.getInstance().get('plenty.allowedSlippage'),
        gasLimitEstimate: config_manager_v2_1.ConfigManagerV2.getInstance().get('plenty.gasLimitEstimate'),
        poolsApi: (network) => config_manager_v2_1.ConfigManagerV2.getInstance().get('plenty.contractAddresses.' + network + '.poolsApi'),
        analyticsApi: (network) => config_manager_v2_1.ConfigManagerV2.getInstance().get('plenty.contractAddresses.' + network + '.analyticsApi'),
        routerAddress: (network) => config_manager_v2_1.ConfigManagerV2.getInstance().get('plenty.contractAddresses.' + network + '.router'),
        tradingTypes: ['AMM'],
        chainType: 'TEZOS',
        availableNetworks: [
            { chain: 'tezos', networks: ['mainnet'] },
        ],
    };
})(PlentyConfig || (exports.PlentyConfig = PlentyConfig = {}));
//# sourceMappingURL=plenty.config.js.map