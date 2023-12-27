"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getXRPLConfig = void 0;
const config_manager_v2_1 = require("../../services/config-manager-v2");
function getXRPLConfig(chainName, networkName) {
    const configManager = config_manager_v2_1.ConfigManagerV2.getInstance();
    return {
        network: {
            name: networkName,
            nodeUrl: configManager.get(chainName + '.networks.' + networkName + '.nodeURL'),
            tokenListType: config_manager_v2_1.ConfigManagerV2.getInstance().get(chainName + '.networks.' + networkName + '.tokenListType'),
            tokenListSource: config_manager_v2_1.ConfigManagerV2.getInstance().get(chainName + '.networks.' + networkName + '.tokenListSource'),
            marketListType: config_manager_v2_1.ConfigManagerV2.getInstance().get(chainName + '.networks.' + networkName + '.marketListType'),
            marketListSource: config_manager_v2_1.ConfigManagerV2.getInstance().get(chainName + '.networks.' + networkName + '.marketListSource'),
            nativeCurrencySymbol: config_manager_v2_1.ConfigManagerV2.getInstance().get(chainName + '.networks.' + networkName + '.nativeCurrencySymbol'),
            maxLRUCacheInstances: config_manager_v2_1.ConfigManagerV2.getInstance().get(chainName + '.maxLRUCacheInstances'),
        },
        requestTimeout: config_manager_v2_1.ConfigManagerV2.getInstance().get(chainName + '.requestTimeout'),
        connectionTimeout: config_manager_v2_1.ConfigManagerV2.getInstance().get(chainName + '.connectionTimeout'),
        feeCushion: config_manager_v2_1.ConfigManagerV2.getInstance().get(chainName + '.feeCushion'),
        maxFeeXRP: config_manager_v2_1.ConfigManagerV2.getInstance().get(chainName + '.maxFeeXRP'),
        orderDbPath: config_manager_v2_1.ConfigManagerV2.getInstance().get(chainName + '.orderDbPath'),
    };
}
exports.getXRPLConfig = getXRPLConfig;
//# sourceMappingURL=xrpl.config.js.map