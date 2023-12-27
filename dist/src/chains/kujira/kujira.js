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
exports.Kujira = void 0;
const kujira_model_1 = require("../../connectors/kujira/kujira.model");
const kujira_convertors_1 = require("../../connectors/kujira/kujira.convertors");
const kujira_config_1 = require("../../connectors/kujira/kujira.config");
const bignumber_js_1 = require("bignumber.js");
class Kujira {
    constructor(network) {
        this.chain = 'kujira';
        this.controller = this;
        this.network = network;
    }
    static getInstance(chain) {
        if (Kujira._instances === undefined) {
            Kujira._instances = {};
        }
        const key = `${chain}`;
        if (!(key in Kujira._instances)) {
            Kujira._instances[key] = new Kujira(chain);
        }
        return Kujira._instances[key];
    }
    static getConnectedInstances() {
        return Kujira._instances;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.kujira = kujira_model_1.KujiraModel.getInstance(this.chain, this.network);
            yield this.kujira.init();
        });
    }
    ready() {
        return this.kujira ? this.kujira.isReady : false;
    }
    getWalletPublicKey(mnemonic, accountNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.kujira.getWalletPublicKey({
                mnemonic: mnemonic,
                accountNumber: accountNumber || kujira_config_1.KujiraConfig.config.accountNumber,
            });
        });
    }
    encrypt(mnemonic, accountNumber, publicKey) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.kujira.encryptWallet({
                wallet: {
                    mnemonic,
                    accountNumber,
                    publicKey,
                },
            });
        });
    }
    getTokenForSymbol(symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, kujira_convertors_1.convertToGetTokensResponse)(yield this.kujira.getToken({ symbol }));
        });
    }
    getCurrentBlockNumber(_options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.kujira.getCurrentBlock(_options);
        });
    }
    balances(_chain, req) {
        return __awaiter(this, void 0, void 0, function* () {
            let balances;
            if (req.tokenSymbols && req.tokenSymbols.length) {
                balances = yield this.kujira.getBalances({
                    ownerAddress: req.address,
                    tokenSymbols: req.tokenSymbols,
                });
            }
            else {
                balances = yield this.kujira.getAllBalances({
                    ownerAddress: req.address,
                });
            }
            const output = {};
            for (const balance of balances.tokens.values()) {
                output[balance.token.symbol] = balance.free.toString();
            }
            return { balances: output };
        });
    }
    poll(_chain, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentBlock = yield this.kujira.getCurrentBlock({});
            const transaction = yield this.kujira.getTransaction({
                hash: req.txHash,
            });
            const output = {
                currentBlock: currentBlock,
                txHash: transaction.hash,
                txStatus: transaction.code,
                txBlock: transaction.blockNumber,
                txData: transaction.data,
                txReceipt: undefined,
            };
            return output;
        });
    }
    getTokens(_chain, _req) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokens = yield this.kujira.getAllTokens({});
            const output = {
                tokens: [],
            };
            for (const token of tokens.values()) {
                output.tokens.push({
                    chainId: this.kujira.chain,
                    address: token.id,
                    name: token.name,
                    symbol: token.symbol,
                    decimals: token.decimals,
                });
            }
            return output;
        });
    }
    nextNonce(_chain, _req) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                nonce: undefined,
            };
        });
    }
    nonce(_chain, _req) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                nonce: undefined,
            };
        });
    }
    allowances(_chain, _req) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                spender: undefined,
                approvals: {},
            };
        });
    }
    approve(_chain, _req) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                tokenAddress: undefined,
                spender: undefined,
                amount: undefined,
                nonce: undefined,
                approval: undefined,
            };
        });
    }
    cancel(_chain, _req) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                txHash: undefined,
            };
        });
    }
    transfer(_chain, req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.kujira.transferFromTo({
                from: req.from,
                to: req.to,
                tokenSymbol: req.token,
                amount: (0, bignumber_js_1.BigNumber)(req.amount),
            });
        });
    }
}
exports.Kujira = Kujira;
//# sourceMappingURL=kujira.js.map