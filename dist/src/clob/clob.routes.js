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
exports.PerpClobRoutes = exports.CLOBRoutes = void 0;
const express_1 = require("express");
const amm_validators_1 = require("../amm/amm.validators");
const error_handler_1 = require("../services/error-handler");
const clob_controllers_1 = require("./clob.controllers");
const clob_validators_1 = require("./clob.validators");
var CLOBRoutes;
(function (CLOBRoutes) {
    CLOBRoutes.router = (0, express_1.Router)();
    CLOBRoutes.router.get('/markets', (0, error_handler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
        (0, clob_validators_1.validateBasicRequest)(req.query);
        res
            .status(200)
            .json(yield (0, clob_controllers_1.getMarkets)(req.query));
    })));
    CLOBRoutes.router.get('/orderBook', (0, error_handler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
        (0, clob_validators_1.validateMarketRequest)(req.query);
        res
            .status(200)
            .json(yield (0, clob_controllers_1.getOrderBooks)(req.query));
    })));
    CLOBRoutes.router.get('/ticker', (0, error_handler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
        (0, clob_validators_1.validateBasicRequest)(req.query);
        res
            .status(200)
            .json(yield (0, clob_controllers_1.getTickers)(req.query));
    })));
    CLOBRoutes.router.get('/orders', (0, error_handler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
        (0, clob_validators_1.validateOrderRequest)(req.query);
        res
            .status(200)
            .json(yield (0, clob_controllers_1.getOrders)(req.query));
    })));
    CLOBRoutes.router.post('/orders', (0, error_handler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
        (0, clob_validators_1.validatePostOrderRequest)(req.body);
        res.status(200).json(yield (0, clob_controllers_1.postOrder)(req.body));
    })));
    CLOBRoutes.router.delete('/orders', (0, error_handler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
        (0, clob_validators_1.validateOrderRequest)(req.body);
        res.status(200).json(yield (0, clob_controllers_1.deleteOrder)(req.body));
    })));
    CLOBRoutes.router.post('/batchOrders', (0, error_handler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
        (0, clob_validators_1.validateBatchOrdersRequest)(req.body);
        res.status(200).json(yield (0, clob_controllers_1.batchOrders)(req.body));
    })));
    CLOBRoutes.router.get('/estimateGas', (0, error_handler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
        (0, amm_validators_1.validateEstimateGasRequest)(req.query);
        res
            .status(200)
            .json(yield (0, clob_controllers_1.estimateGas)(req.query));
    })));
})(CLOBRoutes || (exports.CLOBRoutes = CLOBRoutes = {}));
var PerpClobRoutes;
(function (PerpClobRoutes) {
    PerpClobRoutes.router = (0, express_1.Router)();
    PerpClobRoutes.router.get('/markets', (0, error_handler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
        (0, clob_validators_1.validateBasicRequest)(req.query);
        res
            .status(200)
            .json(yield (0, clob_controllers_1.perpGetMarkets)(req.query));
    })));
    PerpClobRoutes.router.get('/orderBook', (0, error_handler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
        (0, clob_validators_1.validateMarketRequest)(req.query);
        res
            .status(200)
            .json(yield (0, clob_controllers_1.perpGetOrderBooks)(req.query));
    })));
    PerpClobRoutes.router.get('/ticker', (0, error_handler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
        (0, clob_validators_1.validateBasicRequest)(req.query);
        res
            .status(200)
            .json(yield (0, clob_controllers_1.perpGetTickers)(req.query));
    })));
    PerpClobRoutes.router.get('/orders', (0, error_handler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
        (0, clob_validators_1.validatePerpOrderRequest)(req.query);
        res
            .status(200)
            .json(yield (0, clob_controllers_1.perpGetOrders)(req.query));
    })));
    PerpClobRoutes.router.post('/orders', (0, error_handler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
        (0, clob_validators_1.validatePostPerpOrderRequest)(req.body);
        res.status(200).json(yield (0, clob_controllers_1.perpPostOrder)(req.body));
    })));
    PerpClobRoutes.router.delete('/orders', (0, error_handler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
        (0, clob_validators_1.validateOrderRequest)(req.body);
        res.status(200).json(yield (0, clob_controllers_1.perpDeleteOrder)(req.body));
    })));
    PerpClobRoutes.router.get('/estimateGas', (0, error_handler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
        (0, amm_validators_1.validateEstimateGasRequest)(req.query);
        res
            .status(200)
            .json(yield (0, clob_controllers_1.perpEstimateGas)(req.query));
    })));
    PerpClobRoutes.router.post('/funding/info', (0, error_handler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
        (0, clob_validators_1.validateFundingInfoRequest)(req.body);
        res.status(200).json(yield (0, clob_controllers_1.perpFundingInfo)(req.body));
    })));
    PerpClobRoutes.router.post('/funding/payments', (0, error_handler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
        (0, clob_validators_1.validateFundingPaymentsRequest)(req.body);
        res.status(200).json(yield (0, clob_controllers_1.perpFundingPayments)(req.body));
    })));
    PerpClobRoutes.router.post('/positions', (0, error_handler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
        (0, clob_validators_1.validatePositionsRequest)(req.body);
        res.status(200).json(yield (0, clob_controllers_1.perpPositions)(req.body));
    })));
    PerpClobRoutes.router.post('/order/trades', (0, error_handler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
        (0, clob_validators_1.validatePerpTradesRequest)(req.body);
        res
            .status(200)
            .json(yield (0, clob_controllers_1.perpTrades)(req.body));
    })));
    PerpClobRoutes.router.get('/lastTradePrice', (0, error_handler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
        (0, clob_validators_1.validatePerpLastTradePrice)(req.query);
        res
            .status(200)
            .json(yield (0, clob_controllers_1.perpLastTradePrice)(req.query));
    })));
    PerpClobRoutes.router.post('/batchOrders', (0, error_handler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
        (0, clob_validators_1.validateBatchOrdersRequest)(req.body);
        res.status(200).json(yield (0, clob_controllers_1.perpBatchOrders)(req.body));
    })));
})(PerpClobRoutes || (exports.PerpClobRoutes = PerpClobRoutes = {}));
//# sourceMappingURL=clob.routes.js.map