"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEthereumConfig = void 0;
const config_manager_v2_1 = require("../../services/config-manager-v2");
function getEthereumConfig(chainName, networkName) {
    const network = networkName;
    return {
        network: {
            name: network,
            chainID: config_manager_v2_1.ConfigManagerV2.getInstance().get(chainName + '.networks.' + network + '.chainID'),
            nodeURL: config_manager_v2_1.ConfigManagerV2.getInstance().get(chainName + '.networks.' + network + '.nodeURL'),
            tokenListType: config_manager_v2_1.ConfigManagerV2.getInstance().get(chainName + '.networks.' + network + '.tokenListType'),
            tokenListSource: config_manager_v2_1.ConfigManagerV2.getInstance().get(chainName + '.networks.' + network + '.tokenListSource'),
            gasPriceRefreshInterval: config_manager_v2_1.ConfigManagerV2.getInstance().get(chainName + '.networks.' + network + '.gasPriceRefreshInterval'),
        },
        nativeCurrencySymbol: config_manager_v2_1.ConfigManagerV2.getInstance().get(chainName + '.networks.' + network + '.nativeCurrencySymbol'),
        manualGasPrice: config_manager_v2_1.ConfigManagerV2.getInstance().get(chainName + '.manualGasPrice'),
        gasLimitTransaction: config_manager_v2_1.ConfigManagerV2.getInstance().get(chainName + '.gasLimitTransaction'),
    };
}
exports.getEthereumConfig = getEthereumConfig;
//# sourceMappingURL=ethereum.config.js.map