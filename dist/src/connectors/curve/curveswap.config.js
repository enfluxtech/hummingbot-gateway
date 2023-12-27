"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurveConfig = void 0;
const network_utils_1 = require("../../network/network.utils");
var CurveConfig;
(function (CurveConfig) {
    CurveConfig.config = (0, network_utils_1.buildConfig)('curve', ['AMM'], [
        {
            chain: 'avalanche',
            networks: ['avalanche'],
        },
        {
            chain: 'ethereum',
            networks: ['mainnet', 'arbitrum', 'optimism'],
        },
        {
            chain: 'polygon',
            networks: ['mainnet'],
        },
    ], 'EVM');
})(CurveConfig || (exports.CurveConfig = CurveConfig = {}));
//# sourceMappingURL=curveswap.config.js.map