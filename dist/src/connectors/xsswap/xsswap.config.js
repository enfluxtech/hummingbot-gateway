"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XsswapConfig = void 0;
const network_utils_1 = require("../../network/network.utils");
var XsswapConfig;
(function (XsswapConfig) {
    XsswapConfig.config = (0, network_utils_1.buildConfig)('xsswap', ['AMM'], [{ chain: 'xdc', networks: ['xinfin', 'apothem'] }], 'EVM');
})(XsswapConfig || (exports.XsswapConfig = XsswapConfig = {}));
//# sourceMappingURL=xsswap.config.js.map