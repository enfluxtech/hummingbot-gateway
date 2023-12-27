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
exports.TezosRoutes = void 0;
const express_1 = require("express");
const error_handler_1 = require("../../services/error-handler");
const tezos_controllers_1 = require("./tezos.controllers");
const tezos_validators_1 = require("./tezos.validators");
const connection_manager_1 = require("../../services/connection-manager");
var TezosRoutes;
(function (TezosRoutes) {
    TezosRoutes.router = (0, express_1.Router)();
    TezosRoutes.router.post('/nonce', (0, error_handler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
        (0, tezos_validators_1.validateTezosNonceRequest)(req.body);
        const chain = yield (0, connection_manager_1.getInitializedChain)(req.body.chain, req.body.network);
        res.status(200).json(yield tezos_controllers_1.TezosController.nonce(chain, req.body));
    })));
    TezosRoutes.router.post('/balances', (0, error_handler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
        (0, tezos_validators_1.validateTezosBalanceRequest)(req.body);
        const chain = yield (0, connection_manager_1.getInitializedChain)('tezos', req.body.network);
        res.status(200).json((yield tezos_controllers_1.TezosController.balances(chain, req.body)));
    })));
    TezosRoutes.router.post('/poll', (0, error_handler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
        const chain = yield (0, connection_manager_1.getInitializedChain)('tezos', req.body.network);
        res
            .status(200)
            .json(yield tezos_controllers_1.TezosController.poll(chain, {
            chain: req.body.chain,
            network: req.body.network,
            txHash: req.body.txHash
        }));
    })));
    TezosRoutes.router.post('/allowances', (0, error_handler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
        (0, tezos_validators_1.validateTezosAllowancesRequest)(req.body);
        const chain = yield (0, connection_manager_1.getInitializedChain)(req.body.chain, req.body.network);
        res.status(200).json(yield tezos_controllers_1.TezosController.allowances(chain, req.body));
    })));
    TezosRoutes.router.post('/approve', (0, error_handler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
        (0, tezos_validators_1.validateTezosApproveRequest)(req.body);
        const chain = yield (0, connection_manager_1.getInitializedChain)(req.body.chain, req.body.network);
        res.status(200).json(yield tezos_controllers_1.TezosController.approve(chain, req.body));
    })));
})(TezosRoutes || (exports.TezosRoutes = TezosRoutes = {}));
//# sourceMappingURL=tezos.routes.js.map