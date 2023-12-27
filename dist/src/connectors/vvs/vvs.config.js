"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VVSConfig = void 0;
const network_utils_1 = require("../../network/network.utils");
const config_manager_v2_1 = require("../../services/config-manager-v2");
var VVSConfig;
(function (VVSConfig) {
    const contractAddresses = config_manager_v2_1.ConfigManagerV2.getInstance().get('vvs.contractAddresses');
    const networks = Object.keys(contractAddresses);
    VVSConfig.config = (0, network_utils_1.buildConfig)('vvs', ['AMM'], [{ chain: 'cronos', networks }], 'EVM');
})(VVSConfig || (exports.VVSConfig = VVSConfig = {}));
//# sourceMappingURL=vvs.config.js.map