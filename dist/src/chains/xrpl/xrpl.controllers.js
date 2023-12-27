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
exports.XRPLController = void 0;
const base_1 = require("../../services/base");
const error_handler_1 = require("../../services/error-handler");
const xrpl_helpers_1 = require("../../chains/xrpl/xrpl.helpers");
const xrpl_validators_1 = require("./xrpl.validators");
class XRPLController {
    static currentBlockNumber(xrplish) {
        return __awaiter(this, void 0, void 0, function* () {
            return xrplish.getCurrentLedgerIndex();
        });
    }
    static balances(xrplish, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const initTime = Date.now();
            let wallet;
            (0, xrpl_validators_1.validateXRPLBalanceRequest)(req);
            try {
                wallet = yield xrplish.getWallet(req.address);
            }
            catch (err) {
                throw new error_handler_1.HttpException(500, error_handler_1.LOAD_WALLET_ERROR_MESSAGE + err, error_handler_1.LOAD_WALLET_ERROR_CODE);
            }
            const xrplBalances = yield xrplish.getAllBalance(wallet);
            const xrplSubtractedBalances = yield xrplish.subtractBalancesWithOpenOffers(xrplBalances, wallet);
            const balances = {};
            xrplBalances.forEach((balance) => {
                balances[balance.currency] = {
                    total_balance: balance.value,
                    available_balance: balance.value,
                };
            });
            xrplSubtractedBalances.forEach((balance) => {
                balances[balance.currency] = Object.assign(Object.assign({}, balances[balance.currency]), { available_balance: balance.value });
            });
            return {
                network: xrplish.network,
                timestamp: initTime,
                latency: (0, base_1.latency)(initTime, Date.now()),
                address: req.address,
                balances,
            };
        });
    }
    static poll(xrplish, req) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, xrpl_validators_1.validateXRPLPollRequest)(req);
            const initTime = Date.now();
            const currentLedgerIndex = yield xrplish.getCurrentLedgerIndex();
            const txData = yield xrplish.getTransaction(req.txHash);
            const txStatus = yield xrplish.getTransactionStatusCode(txData);
            const sequence = txData ? txData.result.Sequence : undefined;
            const txLedgerIndex = txData ? txData.result.ledger_index : undefined;
            return {
                network: xrplish.network,
                timestamp: initTime,
                currentLedgerIndex: currentLedgerIndex,
                sequence: sequence,
                txHash: req.txHash,
                txStatus: txStatus,
                txLedgerIndex: txLedgerIndex,
                txData: txData,
            };
        });
    }
    static getTokens(xrplish, req) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, xrpl_validators_1.validateXRPLGetTokenRequest)(req);
            let xrpTokens = [];
            if (!req.tokenSymbols) {
                xrpTokens = xrplish.storedTokenList;
            }
            else {
                for (const t of req.tokenSymbols) {
                    const arr = xrplish.getTokenForSymbol(t);
                    if (arr !== undefined) {
                        arr.forEach((token) => {
                            xrpTokens.push(token);
                        });
                    }
                }
            }
            const tokens = [];
            xrpTokens.map((xrpToken) => {
                const token = {
                    address: xrpToken.issuer,
                    chainId: (0, xrpl_helpers_1.getNetworkId)(req.network),
                    decimals: 15,
                    name: xrpToken.title,
                    symbol: xrpToken.code,
                };
                tokens.push(token);
            });
            return { tokens };
        });
    }
}
exports.XRPLController = XRPLController;
//# sourceMappingURL=xrpl.controllers.js.map