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
exports.AlgorandController = void 0;
const algorand_1 = require("./algorand");
const error_handler_1 = require("../../services/error-handler");
const algorand_validators_1 = require("./algorand.validators");
function getInitializedAlgorand(network) {
    return __awaiter(this, void 0, void 0, function* () {
        const algorand = algorand_1.Algorand.getInstance(network);
        if (!algorand.ready()) {
            yield algorand.init();
        }
        return algorand;
    });
}
class AlgorandController {
    static poll(algorand, req) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, algorand_validators_1.validateAlgorandPollRequest)(req);
            return yield algorand.getTransaction(req.txHash);
        });
    }
    static balances(chain, request) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, algorand_validators_1.validateAlgorandBalanceRequest)(request);
            const balances = {};
            const account = yield chain.getAccountFromAddress(request.address);
            if (request.tokenSymbols.includes(chain.nativeTokenSymbol)) {
                balances[chain.nativeTokenSymbol] = yield chain.getNativeBalance(account);
            }
            for (const token of request.tokenSymbols) {
                if (token === chain.nativeTokenSymbol)
                    continue;
                balances[token] = yield chain.getAssetBalance(account, token);
            }
            return {
                balances: balances,
            };
        });
    }
    static getTokens(algorand, request) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, algorand_validators_1.validateAssetsRequest)(request);
            let assets = [];
            if (!request.assetSymbols) {
                assets = algorand.storedAssetList;
            }
            else {
                let assetSymbols;
                if (typeof request.assetSymbols === 'string') {
                    assetSymbols = [request.assetSymbols];
                }
                else {
                    assetSymbols = request.assetSymbols;
                }
                for (const a of assetSymbols) {
                    assets.push(algorand.getAssetForSymbol(a));
                }
            }
            return {
                assets: assets,
            };
        });
    }
    static approve(request) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, algorand_validators_1.validateOptInRequest)(request);
            const algorand = yield getInitializedAlgorand(request.network);
            const asset = algorand.getAssetForSymbol(request.assetSymbol);
            if (asset === undefined) {
                throw new error_handler_1.HttpException(500, error_handler_1.TOKEN_NOT_SUPPORTED_ERROR_MESSAGE + request.assetSymbol, error_handler_1.TOKEN_NOT_SUPPORTED_ERROR_CODE);
            }
            const transactionResponse = yield algorand.optIn(request.address, request.assetSymbol);
            return {
                assetId: asset.assetId,
                transactionResponse: transactionResponse,
            };
        });
    }
}
exports.AlgorandController = AlgorandController;
//# sourceMappingURL=algorand.controller.js.map