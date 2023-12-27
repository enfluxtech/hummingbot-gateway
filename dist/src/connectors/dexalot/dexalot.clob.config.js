"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DexalotCLOBConfig = void 0;
const config_manager_v2_1 = require("../../services/config-manager-v2");
var DexalotCLOBConfig;
(function (DexalotCLOBConfig) {
    DexalotCLOBConfig.config = {
        gasLimitEstimate: config_manager_v2_1.ConfigManagerV2.getInstance().get(`dexalot.gasLimitEstimate`),
        maxLRUCacheInstances: 10,
        tradingTypes: (type) => {
            return type === 'spot' ? ['CLOB_SPOT'] : ['CLOB_PERP'];
        },
        chainType: 'EVM',
        availableNetworks: [
            {
                chain: 'avalanche',
                networks: Object.keys(config_manager_v2_1.ConfigManagerV2.getInstance().get('dexalot.contractAddresses')).filter((network) => Object.keys(config_manager_v2_1.ConfigManagerV2.getInstance().get('avalanche.networks')).includes(network)),
            },
        ],
        addresses: (network) => {
            return config_manager_v2_1.ConfigManagerV2.getInstance().get(`dexalot.contractAddresses.${network}`);
        },
    };
})(DexalotCLOBConfig || (exports.DexalotCLOBConfig = DexalotCLOBConfig = {}));
//# sourceMappingURL=dexalot.clob.config.js.map