"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.constants = void 0;
const config_manager_v2_1 = require("../../services/config-manager-v2");
const configManager = config_manager_v2_1.ConfigManagerV2.getInstance();
exports.constants = {
    retry: {
        all: {
            maxNumberOfRetries: configManager.get('xrpl.retry.all.maxNumberOfRetries') || 0,
            delayBetweenRetries: configManager.get('xrpl.retry.all.delayBetweenRetries') || 0,
        },
    },
    timeout: {
        all: configManager.get('xrpl.timeout.all') || 0,
    },
    parallel: {
        all: {
            batchSize: configManager.get('xrpl.parallel.all.batchSize') || 0,
            delayBetweenBatches: configManager.get('xrpl.parallel.all.delayBetweenBatches') || 0,
        },
    },
};
exports.default = exports.constants;
//# sourceMappingURL=xrpl.constants.js.map