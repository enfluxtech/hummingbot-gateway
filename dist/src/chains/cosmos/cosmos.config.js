"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCosmosConfig = exports.CosmosConfig = void 0;
const config_manager_v2_1 = require("../../services/config-manager-v2");
var CosmosConfig;
(function (CosmosConfig) {
    CosmosConfig.config = getCosmosConfig('cosmos');
})(CosmosConfig || (exports.CosmosConfig = CosmosConfig = {}));
function getCosmosConfig(chainName) {
    const configManager = config_manager_v2_1.ConfigManagerV2.getInstance();
    const network = configManager.get(chainName + '.network');
    return {
        network: {
            name: network,
            rpcURL: configManager.get(chainName + '.networks.' + network + '.rpcURL'),
            tokenListType: configManager.get(chainName + '.networks.' + network + '.tokenListType'),
            tokenListSource: configManager.get(chainName + '.networks.' + network + '.tokenListSource'),
        },
        nativeCurrencySymbol: configManager.get(chainName + '.nativeCurrencySymbol'),
        manualGasPrice: configManager.get(chainName + '.manualGasPrice'),
    };
}
exports.getCosmosConfig = getCosmosConfig;
//# sourceMappingURL=cosmos.config.js.map