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
exports.ChainRoutes = exports.validateTokensRequest = exports.validatePollRequest = void 0;
const express_1 = require("express");
const config_manager_v2_1 = require("../services/config-manager-v2");
const error_handler_1 = require("../services/error-handler");
const validators_1 = require("../services/validators");
const ethereum_validators_1 = require("../chains/ethereum/ethereum.validators");
const ethereum_validators_2 = require("./ethereum/ethereum.validators");
const connection_manager_1 = require("../services/connection-manager");
const network_controllers_1 = require("../network/network.controllers");
const chain_controller_1 = require("./chain.controller");
const tezos_validators_1 = require("./tezos/tezos.validators");
exports.validatePollRequest = (0, validators_1.mkRequestValidator)([
    validators_1.validateTxHash,
]);
exports.validateTokensRequest = (0, validators_1.mkRequestValidator)([
    ethereum_validators_1.validateChain,
    ethereum_validators_1.validateNetwork,
]);
var ChainRoutes;
(function (ChainRoutes) {
    ChainRoutes.router = (0, express_1.Router)();
    ChainRoutes.router.get('/status', (0, error_handler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
        res.status(200).json(yield (0, network_controllers_1.getStatus)(req.query));
    })));
    ChainRoutes.router.get('/config', (_req, res) => {
        res.status(200).json(config_manager_v2_1.ConfigManagerV2.getInstance().allConfigurations);
    });
    ChainRoutes.router.post('/balances', (0, error_handler_1.asyncHandler)((req, res, _next) => __awaiter(this, void 0, void 0, function* () {
        const chain = yield (0, connection_manager_1.getInitializedChain)(req.body.chain, req.body.network);
        res.status(200).json(yield (0, chain_controller_1.balances)(chain, req.body));
    })));
    ChainRoutes.router.post('/poll', (0, error_handler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
        const chain = yield (0, connection_manager_1.getInitializedChain)(req.body.chain, req.body.network);
        res.status(200).json(yield (0, chain_controller_1.poll)(chain, req.body));
    })));
    ChainRoutes.router.get('/tokens', (0, error_handler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
        const chain = yield (0, connection_manager_1.getInitializedChain)(req.query.chain, req.query.network);
        res.status(200).json(yield (0, chain_controller_1.getTokens)(chain, req.query));
    })));
    ChainRoutes.router.post('/nextNonce', (0, error_handler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
        const chain = yield (0, connection_manager_1.getInitializedChain)(req.body.chain, req.body.network);
        res.status(200).json(yield (0, chain_controller_1.nextNonce)(chain, req.body));
    })));
    ChainRoutes.router.post('/nonce', (0, error_handler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
        if (req.body.chain === 'tezos')
            (0, tezos_validators_1.validateTezosNonceRequest)(req.body);
        else
            (0, ethereum_validators_2.validateNonceRequest)(req.body);
        const chain = yield (0, connection_manager_1.getInitializedChain)(req.body.chain, req.body.network);
        res.status(200).json(yield (0, chain_controller_1.nonce)(chain, req.body));
    })));
    ChainRoutes.router.post('/allowances', (0, error_handler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
        const chain = yield (0, connection_manager_1.getInitializedChain)(req.body.chain, req.body.network);
        res.status(200).json(yield (0, chain_controller_1.allowances)(chain, req.body));
    })));
    ChainRoutes.router.post('/approve', (0, error_handler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
        const chain = yield (0, connection_manager_1.getInitializedChain)(req.body.chain, req.body.network);
        res.status(200).json(yield (0, chain_controller_1.approve)(chain, req.body));
    })));
    ChainRoutes.router.post('/cancel', (0, error_handler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
        const chain = yield (0, connection_manager_1.getInitializedChain)(req.body.chain, req.body.network);
        res.status(200).json(yield (0, chain_controller_1.cancel)(chain, req.body));
    })));
    ChainRoutes.router.post('/transfer', (0, error_handler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
        const chain = yield (0, connection_manager_1.getInitializedChain)(req.body.chain, req.body.network);
        res.status(200).json(yield (0, chain_controller_1.transfer)(chain, req.body));
    })));
})(ChainRoutes || (exports.ChainRoutes = ChainRoutes = {}));
//# sourceMappingURL=chain.routes.js.map