"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefConfig = void 0;
const config_manager_v2_1 = require("../../services/config-manager-v2");
const network_utils_1 = require("../../network/network.utils");
var RefConfig;
(function (RefConfig) {
    RefConfig.config = (0, network_utils_1.buildConfig)('ref', ['AMM'], [
        {
            chain: 'near',
            networks: Object.keys(config_manager_v2_1.ConfigManagerV2.getInstance().get('ref.contractAddresses')).filter((network) => Object.keys(config_manager_v2_1.ConfigManagerV2.getInstance().get('near.networks')).includes(network)),
        },
    ], 'NEAR');
})(RefConfig || (exports.RefConfig = RefConfig = {}));
//# sourceMappingURL=ref.config.js.map