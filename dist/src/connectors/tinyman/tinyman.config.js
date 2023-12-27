"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TinymanConfig = void 0;
const config_manager_v2_1 = require("../../services/config-manager-v2");
var TinymanConfig;
(function (TinymanConfig) {
    TinymanConfig.config = {
        allowedSlippage: config_manager_v2_1.ConfigManagerV2.getInstance().get('tinyman.allowedSlippage'),
        tradingTypes: ['AMM'],
        chainType: 'ALGORAND',
        availableNetworks: [
            { chain: 'algorand', networks: ['mainnet', 'testnet'] },
        ],
    };
})(TinymanConfig || (exports.TinymanConfig = TinymanConfig = {}));
//# sourceMappingURL=tinyman.config.js.map