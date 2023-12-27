"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MadMeerkatConfig = void 0;
const network_utils_1 = require("../../network/network.utils");
const config_manager_v2_1 = require("../../services/config-manager-v2");
var MadMeerkatConfig;
(function (MadMeerkatConfig) {
    const contractAddresses = config_manager_v2_1.ConfigManagerV2.getInstance().get('mad_meerkat.contractAddresses');
    const networks = Object.keys(contractAddresses);
    MadMeerkatConfig.config = (0, network_utils_1.buildConfig)('mad_meerkat', ['AMM'], [{ chain: 'cronos', networks }], 'EVM');
})(MadMeerkatConfig || (exports.MadMeerkatConfig = MadMeerkatConfig = {}));
//# sourceMappingURL=mad_meerkat.config.js.map