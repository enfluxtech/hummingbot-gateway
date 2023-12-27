"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAlgorandConfig = void 0;
const config_manager_v2_1 = require("../../services/config-manager-v2");
function getAlgorandConfig(network) {
    return {
        network: {
            name: network,
            nodeURL: config_manager_v2_1.ConfigManagerV2.getInstance().get('algorand.networks.' + network + '.nodeURL'),
            indexerURL: config_manager_v2_1.ConfigManagerV2.getInstance().get('algorand.networks.' + network + '.indexerURL'),
            assetListType: config_manager_v2_1.ConfigManagerV2.getInstance().get('algorand.networks.' + network + '.assetListType'),
            assetListSource: config_manager_v2_1.ConfigManagerV2.getInstance().get('algorand.networks.' + network + '.assetListSource'),
            maxLRUCacheInstances: 10,
        },
        nativeCurrencySymbol: config_manager_v2_1.ConfigManagerV2.getInstance().get('algorand.nativeCurrencySymbol'),
    };
}
exports.getAlgorandConfig = getAlgorandConfig;
//# sourceMappingURL=algorand.config.js.map