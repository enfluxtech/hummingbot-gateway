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
exports.EVMController = exports.willTxSucceed = void 0;
const ethers_1 = require("ethers");
const base_1 = require("../../services/base");
const error_handler_1 = require("../../services/error-handler");
const base_2 = require("../../services/base");
const connection_manager_1 = require("../../services/connection-manager");
const logger_1 = require("../../services/logger");
const ethereum_validators_1 = require("./ethereum.validators");
const chain_routes_1 = require("../chain.routes");
const toEthereumTransactionReceipt = (receipt) => {
    if (receipt) {
        let effectiveGasPrice = null;
        if (receipt.effectiveGasPrice) {
            effectiveGasPrice = receipt.effectiveGasPrice.toString();
        }
        return Object.assign(Object.assign({}, receipt), { gasUsed: receipt.gasUsed.toString(), cumulativeGasUsed: receipt.cumulativeGasUsed.toString(), effectiveGasPrice });
    }
    return null;
};
const toEthereumTransactionResponse = (response) => {
    if (response) {
        let gasPrice = null;
        if (response.gasPrice) {
            gasPrice = response.gasPrice.toString();
        }
        return Object.assign(Object.assign({}, response), { gasPrice, gasLimit: response.gasLimit.toString(), value: response.value.toString() });
    }
    return null;
};
const toEthereumTransaction = (transaction) => {
    let maxFeePerGas = null;
    if (transaction.maxFeePerGas) {
        maxFeePerGas = transaction.maxFeePerGas.toString();
    }
    let maxPriorityFeePerGas = null;
    if (transaction.maxPriorityFeePerGas) {
        maxPriorityFeePerGas = transaction.maxPriorityFeePerGas.toString();
    }
    let gasLimit = null;
    if (transaction.gasLimit) {
        gasLimit = transaction.gasLimit.toString();
    }
    return Object.assign(Object.assign({}, transaction), { maxPriorityFeePerGas,
        maxFeePerGas,
        gasLimit, value: transaction.value.toString() });
};
const willTxSucceed = (txDuration, txDurationLimit, txGasPrice, currentGasPrice) => {
    if (txDuration > txDurationLimit && currentGasPrice > txGasPrice) {
        return false;
    }
    return true;
};
exports.willTxSucceed = willTxSucceed;
class EVMController {
    static poll(ethereumish, req) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            (0, chain_routes_1.validatePollRequest)(req);
            const currentBlock = yield ethereumish.getCurrentBlockNumber();
            const txData = yield ethereumish.getTransaction(req.txHash);
            let txBlock, txReceipt, txStatus;
            if (!txData) {
                txBlock = -1;
                txReceipt = null;
                txStatus = -1;
            }
            else {
                txReceipt = yield ethereumish.getTransactionReceipt(req.txHash);
                if (txReceipt === null) {
                    txBlock = -1;
                    txReceipt = null;
                    txStatus = 0;
                    const transactions = yield ethereumish.txStorage.getTxs(ethereumish.chain, ethereumish.chainId);
                    if (transactions[txData.hash]) {
                        const data = transactions[txData.hash];
                        const now = new Date();
                        const txDuration = Math.abs(now.getTime() - data[0].getTime());
                        if ((0, exports.willTxSucceed)(txDuration, 60000 * 3, data[1], ethereumish.gasPrice)) {
                            txStatus = 2;
                        }
                        else {
                            txStatus = 3;
                        }
                    }
                }
                else {
                    txBlock = txReceipt.blockNumber;
                    txStatus = typeof txReceipt.status === 'number' ? 1 : -1;
                    if (req.connector) {
                        try {
                            const connector = yield (0, connection_manager_1.getConnector)(req.chain, req.network, req.connector);
                            txReceipt.logs = (_a = connector.abiDecoder) === null || _a === void 0 ? void 0 : _a.decodeLogs(txReceipt.logs);
                        }
                        catch (e) {
                            logger_1.logger.error(e);
                        }
                    }
                }
            }
            logger_1.logger.info(`Poll ${ethereumish.chain}, txHash ${req.txHash}, status ${txStatus}.`);
            return {
                currentBlock,
                txHash: req.txHash,
                txBlock,
                txStatus,
                txData: toEthereumTransactionResponse(txData),
                txReceipt: toEthereumTransactionReceipt(txReceipt),
            };
        });
    }
    static nonce(ethereum, req) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, ethereum_validators_1.validateNonceRequest)(req);
            const wallet = yield ethereum.getWallet(req.address);
            const nonce = yield ethereum.nonceManager.getNonce(wallet.address);
            return { nonce };
        });
    }
    static nextNonce(ethereum, req) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, ethereum_validators_1.validateNonceRequest)(req);
            const wallet = yield ethereum.getWallet(req.address);
            const nonce = yield ethereum.nonceManager.getNextNonce(wallet.address);
            return { nonce };
        });
    }
    static getTokens(connection, req) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, chain_routes_1.validateTokensRequest)(req);
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
    static allowances(ethereumish, req) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, ethereum_validators_1.validateAllowancesRequest)(req);
            return EVMController.allowancesWithoutValidation(ethereumish, req);
        });
    }
    static allowancesWithoutValidation(ethereumish, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const wallet = yield ethereumish.getWallet(req.address);
            const tokens = EVMController.getTokenSymbolsToTokens(ethereumish, req.tokenSymbols);
            const spender = ethereumish.getSpender(req.spender);
            const approvals = {};
            yield Promise.all(Object.keys(tokens).map((symbol) => __awaiter(this, void 0, void 0, function* () {
                const contract = ethereumish.getContract(tokens[symbol].address, ethereumish.provider);
                approvals[symbol] = (0, base_2.tokenValueToString)(yield ethereumish.getERC20Allowance(contract, wallet, spender, tokens[symbol].decimals));
            })));
            return {
                spender: spender,
                approvals: approvals,
            };
        });
    }
    static balances(ethereumish, req) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, ethereum_validators_1.validateBalanceRequest)(req);
            let wallet;
            const connector = req.connector
                ? (yield (0, connection_manager_1.getConnector)(req.chain, req.network, req.connector))
                : undefined;
            const balances = {};
            let connectorBalances;
            if (!(connector === null || connector === void 0 ? void 0 : connector.balances)) {
                try {
                    wallet = yield ethereumish.getWallet(req.address);
                }
                catch (err) {
                    throw new error_handler_1.HttpException(500, error_handler_1.LOAD_WALLET_ERROR_MESSAGE + err, error_handler_1.LOAD_WALLET_ERROR_CODE);
                }
                const tokens = EVMController.getTokenSymbolsToTokens(ethereumish, req.tokenSymbols);
                if (req.tokenSymbols.includes(ethereumish.nativeTokenSymbol)) {
                    balances[ethereumish.nativeTokenSymbol] = (0, base_2.tokenValueToString)(yield ethereumish.getNativeBalance(wallet));
                }
                yield Promise.all(Object.keys(tokens).map((symbol) => __awaiter(this, void 0, void 0, function* () {
                    if (tokens[symbol] !== undefined) {
                        const address = tokens[symbol].address;
                        const decimals = tokens[symbol].decimals;
                        const contract = ethereumish.getContract(address, ethereumish.provider);
                        const balance = yield ethereumish.getERC20Balance(contract, wallet, decimals);
                        balances[symbol] = (0, base_2.tokenValueToString)(balance);
                    }
                })));
                if (!Object.keys(balances).length) {
                    throw new error_handler_1.HttpException(500, error_handler_1.TOKEN_NOT_SUPPORTED_ERROR_MESSAGE, error_handler_1.TOKEN_NOT_SUPPORTED_ERROR_CODE);
                }
            }
            else {
                connectorBalances = yield connector.balances(req);
            }
            return {
                balances: connectorBalances || balances,
            };
        });
    }
    static approve(ethereumish, req) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, ethereum_validators_1.validateApproveRequest)(req);
            return yield EVMController.approveWithoutValidation(ethereumish, req);
        });
    }
    static approveWithoutValidation(ethereumish, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { amount, nonce, address, token, maxFeePerGas, maxPriorityFeePerGas, } = req;
            const spender = ethereumish.getSpender(req.spender);
            let wallet;
            try {
                wallet = yield ethereumish.getWallet(address);
            }
            catch (err) {
                throw new error_handler_1.HttpException(500, error_handler_1.LOAD_WALLET_ERROR_MESSAGE + err, error_handler_1.LOAD_WALLET_ERROR_CODE);
            }
            const fullToken = ethereumish.getTokenBySymbol(token);
            if (!fullToken) {
                throw new error_handler_1.HttpException(500, error_handler_1.TOKEN_NOT_SUPPORTED_ERROR_MESSAGE + token, error_handler_1.TOKEN_NOT_SUPPORTED_ERROR_CODE);
            }
            const amountBigNumber = amount
                ? ethers_1.utils.parseUnits(amount, fullToken.decimals)
                : ethers_1.constants.MaxUint256;
            let maxFeePerGasBigNumber;
            if (maxFeePerGas) {
                maxFeePerGasBigNumber = ethers_1.BigNumber.from(maxFeePerGas);
            }
            let maxPriorityFeePerGasBigNumber;
            if (maxPriorityFeePerGas) {
                maxPriorityFeePerGasBigNumber = ethers_1.BigNumber.from(maxPriorityFeePerGas);
            }
            const contract = ethereumish.getContract(fullToken.address, wallet);
            const approval = yield ethereumish.approveERC20(contract, wallet, spender, amountBigNumber, nonce, maxFeePerGasBigNumber, maxPriorityFeePerGasBigNumber, ethereumish.gasPrice);
            if (approval.hash) {
                yield ethereumish.txStorage.saveTx(ethereumish.chain, ethereumish.chainId, approval.hash, new Date(), ethereumish.gasPrice);
            }
            return {
                tokenAddress: fullToken.address,
                spender: spender,
                amount: (0, base_1.bigNumberWithDecimalToStr)(amountBigNumber, fullToken.decimals),
                nonce: approval.nonce,
                approval: toEthereumTransaction(approval),
            };
        });
    }
    static cancel(ethereumish, req) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, ethereum_validators_1.validateCancelRequest)(req);
            let wallet;
            try {
                wallet = yield ethereumish.getWallet(req.address);
            }
            catch (err) {
                throw new error_handler_1.HttpException(500, error_handler_1.LOAD_WALLET_ERROR_MESSAGE + err, error_handler_1.LOAD_WALLET_ERROR_CODE);
            }
            const cancelTx = yield ethereumish.cancelTx(wallet, req.nonce);
            logger_1.logger.info(`Cancelled transaction at nonce ${req.nonce}, cancel txHash ${cancelTx.hash}.`);
            return {
                txHash: cancelTx.hash,
            };
        });
    }
}
exports.EVMController = EVMController;
EVMController.getTokenSymbolsToTokens = (ethereum, tokenSymbols) => {
    const tokens = {};
    for (let i = 0; i < tokenSymbols.length; i++) {
        const symbol = tokenSymbols[i];
        const token = ethereum.getTokenBySymbol(symbol);
        if (token)
            tokens[symbol] = token;
    }
    return tokens;
};
//# sourceMappingURL=evm.controllers.js.map