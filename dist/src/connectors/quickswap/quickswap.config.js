"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuickswapConfig = void 0;
const network_utils_1 = require("../../network/network.utils");
var QuickswapConfig;
(function (QuickswapConfig) {
    QuickswapConfig.config = (0, network_utils_1.buildConfig)('quickswap', ['AMM'], [{ chain: 'polygon', networks: ['mainnet', 'mumbai'] }], 'EVM');
})(QuickswapConfig || (exports.QuickswapConfig = QuickswapConfig = {}));
//# sourceMappingURL=quickswap.config.js.map