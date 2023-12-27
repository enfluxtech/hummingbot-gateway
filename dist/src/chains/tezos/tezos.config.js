"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTezosConfig = void 0;
const config_manager_v2_1 = require("../../services/config-manager-v2");
function getTezosConfig(chainName, networkName) {
    const network = networkName;
    return {
        network: {
            name: network,
            chainId: config_manager_v2_1.ConfigManagerV2.getInstance().get(chainName + '.networks.' + network + '.chainId'),
            gasPriceRefreshInterval: config_manager_v2_1.ConfigManagerV2.getInstance().get(chainName + '.networks.' + network + '.gasPriceRefreshInterval'),
            nodeURL: config_manager_v2_1.ConfigManagerV2.getInstance().get(chainName + '.networks.' + network + '.nodeURL'),
            tokenListType: config_manager_v2_1.ConfigManagerV2.getInstance().get(chainName + '.networks.' + network + '.tokenListType'),
            tokenListSource: config_manager_v2_1.ConfigManagerV2.getInstance().get(chainName + '.networks.' + network + '.tokenListSource'),
            tzktURL: config_manager_v2_1.ConfigManagerV2.getInstance().get(chainName + '.networks.' + network + '.tzktURL'),
            ctezAdminAddress: config_manager_v2_1.ConfigManagerV2.getInstance().get(chainName + '.networks.' + network + '.ctezAdmin')
        },
        nativeCurrencySymbol: config_manager_v2_1.ConfigManagerV2.getInstance().get(chainName + '.networks.' + network + '.nativeCurrencySymbol'),
        manualGasPrice: config_manager_v2_1.ConfigManagerV2.getInstance().get(chainName + '.manualGasPrice'),
        gasLimitTransaction: config_manager_v2_1.ConfigManagerV2.getInstance().get(chainName + '.gasLimitTransaction'),
    };
}
exports.getTezosConfig = getTezosConfig;
//# sourceMappingURL=tezos.config.js.map