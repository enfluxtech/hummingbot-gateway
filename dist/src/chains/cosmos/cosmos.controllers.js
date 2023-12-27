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
exports.CosmosController = exports.toCosmosBalances = void 0;
const base_1 = require("../../services/base");
const error_handler_1 = require("../../services/error-handler");
const cosmos_validators_1 = require("./cosmos.validators");
const { decodeTxRaw } = require('@cosmjs/proto-signing');
const toCosmosBalances = (balances, tokenSymbols) => {
    const walletBalances = {};
    tokenSymbols.forEach((symbol) => {
        let balance = '0.0';
        if (balances[symbol]) {
            balance = (0, base_1.tokenValueToString)(balances[symbol]);
        }
        walletBalances[symbol] = balance;
    });
    return walletBalances;
};
exports.toCosmosBalances = toCosmosBalances;
class CosmosController {
    static balances(cosmosish, req) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, cosmos_validators_1.validateCosmosBalanceRequest)(req);
            const wallet = yield cosmosish.getWallet(req.address, 'cosmos');
            const { tokenSymbols } = req;
            tokenSymbols.forEach((symbol) => {
                const token = cosmosish.getTokenForSymbol(symbol);
                if (!token) {
                    throw new error_handler_1.HttpException(500, error_handler_1.TOKEN_NOT_SUPPORTED_ERROR_MESSAGE + symbol, error_handler_1.TOKEN_NOT_SUPPORTED_ERROR_CODE);
                }
            });
            const balances = yield cosmosish.getBalances(wallet);
            const filteredBalances = (0, exports.toCosmosBalances)(balances, tokenSymbols);
            return {
                balances: filteredBalances,
            };
        });
    }
    static poll(cosmos, req) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, cosmos_validators_1.validateCosmosPollRequest)(req);
            const transaction = yield cosmos.getTransaction(req.txHash);
            const currentBlock = yield cosmos.getCurrentBlockNumber();
            return {
                txHash: req.txHash,
                currentBlock,
                txBlock: transaction.height,
                gasUsed: transaction.gasUsed,
                gasWanted: transaction.gasWanted,
                txData: decodeTxRaw(transaction.tx),
            };
        });
    }
}
exports.CosmosController = CosmosController;
//# sourceMappingURL=cosmos.controllers.js.map