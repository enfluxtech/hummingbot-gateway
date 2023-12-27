"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PangolinConfig = void 0;
const network_utils_1 = require("../../network/network.utils");
var PangolinConfig;
(function (PangolinConfig) {
    PangolinConfig.config = (0, network_utils_1.buildConfig)('pangolin', ['AMM'], [{ chain: 'avalanche', networks: ['avalanche', 'fuji'] }], 'EVM');
})(PangolinConfig || (exports.PangolinConfig = PangolinConfig = {}));
//# sourceMappingURL=pangolin.config.js.map