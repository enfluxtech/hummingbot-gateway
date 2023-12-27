"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraderjoeConfig = void 0;
const network_utils_1 = require("../../network/network.utils");
var TraderjoeConfig;
(function (TraderjoeConfig) {
    TraderjoeConfig.config = (0, network_utils_1.buildConfig)('traderjoe', ['AMM'], [{ chain: 'avalanche', networks: ['avalanche', 'fuji'] }], 'EVM');
})(TraderjoeConfig || (exports.TraderjoeConfig = TraderjoeConfig = {}));
//# sourceMappingURL=traderjoe.config.js.map