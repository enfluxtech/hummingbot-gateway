"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerpConfig = void 0;
const config_manager_v2_1 = require("../../services/config-manager-v2");
var PerpConfig;
(function (PerpConfig) {
    PerpConfig.config = {
        allowedSlippage: config_manager_v2_1.ConfigManagerV2.getInstance().get(`perp.allowedSlippage`),
        ttl: config_manager_v2_1.ConfigManagerV2.getInstance().get(`perp.versions.ttl`),
        tradingTypes: (type) => type === 'perp' ? ['AMM_Perpetual'] : ['AMM_LP'],
        chainType: 'EVM',
        availableNetworks: [{ chain: 'ethereum', networks: ['optimism'] }],
    };
})(PerpConfig || (exports.PerpConfig = PerpConfig = {}));
//# sourceMappingURL=perp.config.js.map