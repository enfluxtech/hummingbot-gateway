"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchEVMNonceManager = void 0;
const patch_1 = require("./services/patch");
const patchEVMNonceManager = (nonceManager) => {
    (0, patch_1.patch)(nonceManager, 'init', () => {
        return;
    });
    (0, patch_1.patch)(nonceManager, 'mergeNonceFromEVMNode', () => {
        return;
    });
    (0, patch_1.patch)(nonceManager, 'getNonceFromNode', (_ethAddress) => {
        return Promise.resolve(12);
    });
    (0, patch_1.patch)(nonceManager, 'getNextNonce', (_ethAddress) => {
        return Promise.resolve(13);
    });
    (0, patch_1.patch)(nonceManager, 'commitNonce', (_, __) => __awaiter(void 0, void 0, void 0, function* () {
        return;
    }));
};
exports.patchEVMNonceManager = patchEVMNonceManager;
//# sourceMappingURL=evm.nonce.mock.js.map