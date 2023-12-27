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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBatchOperationsWithLimits = exports.routerSwap = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const plenty_types_1 = require("../plenty.types");
const taquito_1 = require("@taquito/taquito");
const error_handler_1 = require("../../../services/error-handler");
const lodash_1 = require("lodash");
const logger_1 = require("../../../services/logger");
const routerSwap = (tezos, plenty, path, minimumOut_All, caller, recipent, amount) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const tokenIn = plenty.getTokenBySymbol(path[0]);
    const routerInstance = yield tezos.getContract(plenty.router);
    let DataLiteral = [];
    for (let i = 0; i < path.length - 1; i++) {
        const dexconfig = plenty.getPool(path[i], path[i + 1]);
        const pathI1 = plenty.getTokenBySymbol(path[i + 1]);
        const minOut = minimumOut_All[i]
            .multipliedBy(new bignumber_js_1.default(10).pow(pathI1.decimals))
            .decimalPlaces(0, 1)
            .toString();
        const tokenAddress = pathI1.address;
        const tokenId = (_a = pathI1.tokenId) !== null && _a !== void 0 ? _a : 0;
        DataLiteral[i] = {
            exchangeAddress: dexconfig.address,
            minimumOutput: minOut,
            requiredTokenAddress: tokenAddress !== null && tokenAddress !== void 0 ? tokenAddress : plenty.router,
            requiredTokenId: tokenId,
        };
    }
    process.env.LOG_PLENTY && console.log('Path: ', path);
    process.env.LOG_PLENTY && console.log('DataLiteral: ', DataLiteral);
    const DataMap = taquito_1.MichelsonMap.fromLiteral(DataLiteral);
    let swapAmount = amount
        .decimalPlaces(0, 1)
        .toString();
    const tokenInCallType = tokenIn.standard;
    const allBatchOperations = [];
    if (tokenInCallType === plenty_types_1.TokenStandard.TEZ) {
        allBatchOperations.push(Object.assign({ kind: taquito_1.OpKind.TRANSACTION }, routerInstance.methods
            .routerSwap(DataMap, swapAmount, recipent)
            .toTransferParams({ amount: Number(swapAmount), mutez: true })));
    }
    else {
        const tokenInInstance = yield tezos.getContract(tokenIn.address);
        if (tokenInCallType === plenty_types_1.TokenStandard.FA12) {
            allBatchOperations.push(Object.assign({ kind: taquito_1.OpKind.TRANSACTION }, tokenInInstance.methods.transfer(caller, plenty.router, swapAmount).toTransferParams()));
            allBatchOperations.push(Object.assign({ kind: taquito_1.OpKind.TRANSACTION }, routerInstance.methods.routerSwap(DataMap, swapAmount, recipent).toTransferParams()));
        }
        else if (tokenInCallType === plenty_types_1.TokenStandard.FA2) {
            allBatchOperations.push(Object.assign({ kind: taquito_1.OpKind.TRANSACTION }, tokenInInstance.methods
                .transfer([
                {
                    from_: caller,
                    txs: [
                        {
                            to_: plenty.router,
                            token_id: tokenIn.tokenId,
                            amount: swapAmount,
                        },
                    ],
                },
            ])
                .toTransferParams()));
            allBatchOperations.push(Object.assign({ kind: taquito_1.OpKind.TRANSACTION }, routerInstance.methods.routerSwap(DataMap, swapAmount, recipent).toTransferParams()));
        }
        else {
            throw new Error("Invalid Variant");
        }
    }
    return allBatchOperations;
});
exports.routerSwap = routerSwap;
const getBatchOperationsWithLimits = (tezos, allBatchOperations) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let notEnoughTez = false;
        let notRevealed = false;
        const limits = yield tezos.estimate
            .batch(allBatchOperations)
            .then((limits) => limits)
            .catch((err) => {
            const errorMessage = String(err.message);
            if (errorMessage.includes("storage_exhausted")) {
                notEnoughTez = true;
            }
            else if (errorMessage.includes("reveal")) {
                notRevealed = true;
            }
            return undefined;
        });
        const updatedBatchOperations = [];
        if (limits !== undefined) {
            allBatchOperations.forEach((op, index) => {
                const gasLimit = new bignumber_js_1.default(limits[index].gasLimit)
                    .plus(new bignumber_js_1.default(limits[index].gasLimit).multipliedBy(0.3))
                    .decimalPlaces(0, 1)
                    .toNumber();
                const storageLimit = new bignumber_js_1.default(limits[index].storageLimit)
                    .plus(new bignumber_js_1.default(limits[index].storageLimit).multipliedBy(0.5))
                    .decimalPlaces(0, 1)
                    .toNumber();
                updatedBatchOperations.push(Object.assign(Object.assign({}, op), { gasLimit,
                    storageLimit }));
            });
        }
        else {
            if (notEnoughTez) {
                throw new error_handler_1.UniswapishPriceError("NOT_ENOUGH_TEZ");
            }
            else if (notRevealed) {
                return allBatchOperations;
            }
            throw new error_handler_1.UniswapishPriceError("Failed to create transaction batch");
        }
        return (0, lodash_1.cloneDeep)(updatedBatchOperations);
    }
    catch (error) {
        logger_1.logger.error('Plenty: tezos transaction estimate error - ', error);
        throw new error_handler_1.UniswapishPriceError('Plenty: ' + error.message);
    }
});
exports.getBatchOperationsWithLimits = getBatchOperationsWithLimits;
//# sourceMappingURL=router.js.map