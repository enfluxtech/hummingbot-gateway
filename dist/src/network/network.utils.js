"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildConfig = void 0;
const config_manager_v2_1 = require("../services/config-manager-v2");
function buildConfig(connector, tradingTypes, availableNetworks, chainType = 'EVM') {
    return {
        allowedSlippage: config_manager_v2_1.ConfigManagerV2.getInstance().get(`${connector}.allowedSlippage`),
        gasLimitEstimate: config_manager_v2_1.ConfigManagerV2.getInstance().get(`${connector}.gasLimitEstimate`),
        ttl: config_manager_v2_1.ConfigManagerV2.getInstance().get(`${connector}.ttl`),
        routerAddress: (network) => config_manager_v2_1.ConfigManagerV2.getInstance().get(`${connector}.contractAddresses.` + network + '.routerAddress'),
        tradingTypes: tradingTypes,
        chainType: chainType,
        availableNetworks,
    };
}
exports.buildConfig = buildConfig;
//# sourceMappingURL=network.utils.js.map