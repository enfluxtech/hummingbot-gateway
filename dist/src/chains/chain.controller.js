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
exports.transfer = exports.cancel = exports.approve = exports.balances = exports.allowances = exports.getTokens = exports.nextNonce = exports.nonce = exports.poll = void 0;
const base_1 = require("../services/base");
function poll(chain, req) {
    return __awaiter(this, void 0, void 0, function* () {
        const initTime = Date.now();
        const poll = yield chain.controller.poll(chain, req);
        return Object.assign({ network: chain.chain, timestamp: initTime, latency: (0, base_1.latency)(initTime, Date.now()) }, poll);
    });
}
exports.poll = poll;
function nonce(chain, req) {
    return __awaiter(this, void 0, void 0, function* () {
        const initTime = Date.now();
        const nonce = yield chain.controller.nonce(chain, req);
        return Object.assign({ network: chain.chain, timestamp: initTime, latency: (0, base_1.latency)(initTime, Date.now()) }, nonce);
    });
}
exports.nonce = nonce;
function nextNonce(chain, req) {
    return __awaiter(this, void 0, void 0, function* () {
        const initTime = Date.now();
        const nextNonce = yield chain.controller.nextNonce(chain, req);
        return Object.assign({ network: chain.chain, timestamp: initTime, latency: (0, base_1.latency)(initTime, Date.now()) }, nextNonce);
    });
}
exports.nextNonce = nextNonce;
function getTokens(chain, req) {
    return __awaiter(this, void 0, void 0, function* () {
        const initTime = Date.now();
        const tokens = yield chain.controller.getTokens(chain, req);
        return Object.assign({ network: chain.chain, timestamp: initTime, latency: (0, base_1.latency)(initTime, Date.now()) }, tokens);
    });
}
exports.getTokens = getTokens;
function allowances(chain, req) {
    return __awaiter(this, void 0, void 0, function* () {
        const initTime = Date.now();
        const allowances = yield chain.controller.allowances(chain, req);
        return Object.assign({ network: chain.chain, timestamp: initTime, latency: (0, base_1.latency)(initTime, Date.now()) }, allowances);
    });
}
exports.allowances = allowances;
function balances(chain, req) {
    return __awaiter(this, void 0, void 0, function* () {
        const initTime = Date.now();
        const balances = yield chain.controller.balances(chain, req);
        return Object.assign({ network: chain.chain, timestamp: initTime, latency: (0, base_1.latency)(initTime, Date.now()) }, balances);
    });
}
exports.balances = balances;
function approve(chain, req) {
    return __awaiter(this, void 0, void 0, function* () {
        const initTime = Date.now();
        const approveTx = yield chain.controller.approve(chain, req);
        return Object.assign({ network: chain.chain, timestamp: initTime, latency: (0, base_1.latency)(initTime, Date.now()) }, approveTx);
    });
}
exports.approve = approve;
function cancel(chain, req) {
    return __awaiter(this, void 0, void 0, function* () {
        const initTime = Date.now();
        const cancelTx = yield chain.controller.cancel(chain, req);
        return Object.assign({ network: chain.chain, timestamp: initTime, latency: (0, base_1.latency)(initTime, Date.now()) }, cancelTx);
    });
}
exports.cancel = cancel;
function transfer(chain, req) {
    return __awaiter(this, void 0, void 0, function* () {
        const initTime = Date.now();
        const transfer = yield chain.controller.transfer(chain, req);
        return Object.assign({ network: chain.chain, timestamp: initTime, latency: (0, base_1.latency)(initTime, Date.now()) }, transfer);
    });
}
exports.transfer = transfer;
//# sourceMappingURL=chain.controller.js.map