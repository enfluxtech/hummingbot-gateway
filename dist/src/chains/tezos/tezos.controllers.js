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
exports.TezosController = exports.getTokenSymbolsToTokens = void 0;
const bignumber_js_1 = require("bignumber.js");
const error_handler_1 = require("../../services/error-handler");
const base_1 = require("../../services/base");
const tezos_validators_1 = require("./tezos.validators");
const getTokenSymbolsToTokens = (tezos, tokenSymbols) => {
    const tokens = {};
    for (let i = 0; i < tokenSymbols.length; i++) {
        const symbol = tokenSymbols[i];
        const token = tezos.getTokenForSymbol(symbol);
        if (token)
            tokens[symbol] = token;
    }
    return tokens;
};
exports.getTokenSymbolsToTokens = getTokenSymbolsToTokens;
class TezosController {
    static nonce(tezos, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const nonce = yield tezos.getNonce(req.address);
            return { nonce };
        });
    }
    static nextNonce(tezos, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const nonce = (yield tezos.getNonce(req.address)) + 1;
            return { nonce };
        });
    }
    static getTokens(connection, req) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, tezos_validators_1.validateTezosTokenRequest)(req);
            let tokens = [];
            if (!req.tokenSymbols) {
                tokens = connection.storedTokenList;
            }
            else {
                for (const t of req.tokenSymbols) {
                    tokens.push(connection.getTokenForSymbol(t));
                }
            }
            return { tokens };
        });
    }
    static balances(tezos, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const initTime = Date.now();
            const tokens = (0, exports.getTokenSymbolsToTokens)(tezos, req.tokenSymbols);
            const balances = {};
            if (req.tokenSymbols.includes(tezos.nativeTokenSymbol)) {
                balances[tezos.nativeTokenSymbol] = (0, base_1.tokenValueToString)(yield tezos.getNativeBalance(req.address));
            }
            yield Promise.all(Object.keys(tokens).map((symbol) => __awaiter(this, void 0, void 0, function* () {
                if (tokens[symbol] !== undefined && symbol !== tezos.nativeTokenSymbol) {
                    const contractAddress = tokens[symbol].address;
                    const tokenId = tokens[symbol].tokenId;
                    const decimals = tokens[symbol].decimals;
                    if (tokenId !== undefined) {
                        const balance = yield tezos.getTokenBalance(contractAddress, req.address, tokenId, decimals);
                        balances[symbol] = (0, base_1.tokenValueToString)(balance);
                    }
                }
            })));
            if (!Object.keys(balances).length) {
                throw new error_handler_1.HttpException(500, error_handler_1.TOKEN_NOT_SUPPORTED_ERROR_MESSAGE, error_handler_1.TOKEN_NOT_SUPPORTED_ERROR_CODE);
            }
            return {
                network: tezos.chainName,
                timestamp: initTime,
                latency: (0, base_1.latency)(initTime, Date.now()),
                balances: balances,
            };
        });
    }
    static poll(tezosish, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const initTime = Date.now();
            let txStatus = -1;
            let txData = null;
            let txReceipt = null;
            const pendingTxs = yield tezosish.getPendingTransactions();
            const appliedTx = pendingTxs.applied.find((tx) => tx.hash === req.txHash);
            if (appliedTx) {
                txStatus = 1;
                txData = appliedTx.contents;
                const tx = yield tezosish.getTransaction(req.txHash);
                txReceipt = {
                    status: txStatus,
                    gasUsed: tx.reduce((acc, tx) => acc + tx.gasUsed, 0) * 1e3,
                };
            }
            else if (pendingTxs.branch_delayed.find((tx) => tx.hash === req.txHash)) {
                txStatus = 2;
            }
            else if (pendingTxs.branch_refused.find((tx) => tx.hash === req.txHash)) {
                txStatus = 3;
            }
            else if (pendingTxs.refused.find((tx) => tx.hash === req.txHash)) {
                txStatus = 3;
            }
            else if (pendingTxs.unprocessed.find((tx) => tx.hash === req.txHash)) {
                txStatus = 0;
            }
            else {
                const tx = yield tezosish.getTransaction(req.txHash);
                if (tx) {
                    txStatus = 1;
                    txData = tx;
                    txReceipt = {
                        status: txStatus,
                        gasUsed: tx.reduce((acc, tx) => acc + tx.gasUsed, 0) * 1e3,
                    };
                }
            }
            const currentBlock = yield tezosish.getCurrentBlockNumber();
            return {
                network: tezosish.chain,
                currentBlock,
                timestamp: initTime,
                txHash: req.txHash,
                txStatus,
                txData,
                txReceipt,
            };
        });
    }
    static allowances(tezos, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const initTime = Date.now();
            const tokens = (0, exports.getTokenSymbolsToTokens)(tezos, req.tokenSymbols);
            const spender = req.spender;
            const approvals = {};
            yield Promise.all(Object.keys(tokens).map((symbol) => __awaiter(this, void 0, void 0, function* () {
                if (tokens[symbol].standard === 'TEZ') {
                    const balance = yield tezos.getNativeBalance(req.address);
                    approvals[symbol] = balance.value.toString();
                }
                else if (tokens[symbol].standard === 'FA1.2') {
                    approvals[symbol] = new bignumber_js_1.BigNumber(2).pow(256).minus(1).toString();
                }
                else {
                    approvals[symbol] = (0, base_1.tokenValueToString)(yield tezos.getTokenAllowance(tokens[symbol].address, req.address, spender, 'FA2', tokens[symbol].tokenId, tokens[symbol].decimals));
                }
            })));
            if (!Object.keys(approvals).length) {
                throw new error_handler_1.HttpException(500, error_handler_1.TOKEN_NOT_SUPPORTED_ERROR_MESSAGE, error_handler_1.TOKEN_NOT_SUPPORTED_ERROR_CODE);
            }
            return {
                network: tezos.chainName,
                timestamp: initTime,
                latency: (0, base_1.latency)(initTime, Date.now()),
                spender: spender,
                approvals: approvals,
            };
        });
    }
    static approve(tezos, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const initTime = Date.now();
            const { amount, address, token } = req;
            let spender = req.spender;
            let wallet;
            try {
                wallet = yield tezos.getWallet(address);
            }
            catch (err) {
                throw new error_handler_1.HttpException(500, error_handler_1.LOAD_WALLET_ERROR_MESSAGE + err, error_handler_1.LOAD_WALLET_ERROR_CODE);
            }
            const fullToken = tezos.getTokenForSymbol(token);
            if (!fullToken) {
                throw new error_handler_1.HttpException(500, error_handler_1.TOKEN_NOT_SUPPORTED_ERROR_MESSAGE + token, error_handler_1.TOKEN_NOT_SUPPORTED_ERROR_CODE);
            }
            const amountBigNumber = amount
                ? new bignumber_js_1.BigNumber(amount)
                : new bignumber_js_1.BigNumber(2).pow(256).minus(1);
            const contract = yield wallet.contract.at(fullToken.address);
            let approvalOperation = null;
            if (fullToken.standard == 'FA1.2') {
                approvalOperation = yield contract.methods
                    .approve(spender, amountBigNumber)
                    .send();
            }
            else if (fullToken.standard == 'FA2') {
                approvalOperation = yield contract.methods
                    .update_operators([{
                        add_operator: {
                            owner: address,
                            operator: spender,
                            token_id: fullToken.tokenId,
                        },
                    }])
                    .send();
            }
            else {
                throw new error_handler_1.HttpException(500, error_handler_1.TOKEN_NOT_SUPPORTED_ERROR_MESSAGE, error_handler_1.TOKEN_NOT_SUPPORTED_ERROR_CODE);
            }
            if (approvalOperation !== null &&
                approvalOperation.operationResults.length > 0) {
                const op = approvalOperation.operationResults[0];
                const chainId = yield wallet.rpc.getChainId();
                return {
                    network: tezos.chainName,
                    timestamp: initTime,
                    latency: (0, base_1.latency)(initTime, Date.now()),
                    tokenAddress: fullToken.address,
                    spender: spender,
                    amount: amountBigNumber.toFixed(fullToken.decimals),
                    nonce: parseInt(op.counter),
                    approval: toTezosTransaction(approvalOperation.hash, op, chainId),
                };
            }
            else {
                throw new error_handler_1.HttpException(500, error_handler_1.TOKEN_NOT_SUPPORTED_ERROR_MESSAGE, error_handler_1.TOKEN_NOT_SUPPORTED_ERROR_CODE);
            }
        });
    }
}
exports.TezosController = TezosController;
const toTezosTransaction = (hash, transaction, chainId) => {
    return {
        hash,
        to: transaction.destination,
        from: transaction.source,
        nonce: parseInt(transaction.counter),
        gasLimit: String(parseInt(transaction.gas_limit) + parseInt(transaction.storage_limit)),
        maxFeePerGas: null,
        value: transaction.amount,
        chainId: chainId,
        data: JSON.stringify(transaction.parameters),
        maxPriorityFeePerGas: null,
    };
};
//# sourceMappingURL=tezos.controllers.js.map