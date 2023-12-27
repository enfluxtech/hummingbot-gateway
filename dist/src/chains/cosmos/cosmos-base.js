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
exports.CosmosBase = void 0;
const axios_1 = __importDefault(require("axios"));
const fs_1 = require("fs");
const base_1 = require("../../services/base");
const node_cache_1 = __importDefault(require("node-cache"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const config_manager_cert_passphrase_1 = require("../../services/config-manager-cert-passphrase");
const ethers_1 = require("ethers");
const stargate_1 = require("@cosmjs/stargate");
const logger_1 = require("../../services/logger");
const { DirectSecp256k1Wallet } = require('@cosmjs/proto-signing');
const { StargateClient } = require('@cosmjs/stargate');
const { toBase64, fromBase64, fromHex } = require('@cosmjs/encoding');
const crypto = require('crypto').webcrypto;
class CosmosBase {
    constructor(chainName, rpcUrl, tokenListSource, tokenListType, gasPriceConstant) {
        this.tokenList = [];
        this._tokenMap = {};
        this._ready = false;
        this._initialized = Promise.resolve(false);
        this._provider = StargateClient.connect(rpcUrl);
        this.chainName = chainName;
        this.rpcUrl = rpcUrl;
        this.gasPriceConstant = gasPriceConstant;
        this.tokenListSource = tokenListSource;
        this.tokenListType = tokenListType;
        this.cache = new node_cache_1.default({ stdTTL: 3600 });
    }
    ready() {
        return this._ready;
    }
    get provider() {
        return this._provider;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._initialized;
            if (!this.ready()) {
                this._initialized = (() => __awaiter(this, void 0, void 0, function* () {
                    try {
                        yield this.loadTokens(this.tokenListSource, this.tokenListType);
                        return true;
                    }
                    catch (e) {
                        logger_1.logger.error(`Failed to initialize ${this.chainName} chain: ${e}`);
                        return false;
                    }
                }))();
                this._ready = yield this._initialized;
            }
            return;
        });
    }
    loadTokens(tokenListSource, tokenListType) {
        return __awaiter(this, void 0, void 0, function* () {
            this.tokenList = yield this.getTokenList(tokenListSource, tokenListType);
            if (this.tokenList) {
                this.tokenList.forEach((token) => (this._tokenMap[token.symbol] = token));
            }
        });
    }
    getTokenList(tokenListSource, tokenListType) {
        return __awaiter(this, void 0, void 0, function* () {
            let tokens;
            if (tokenListType === 'URL') {
                ({ data: tokens } = yield axios_1.default.get(tokenListSource));
            }
            else {
                ({ tokens } = JSON.parse(yield fs_1.promises.readFile(tokenListSource, 'utf8')));
            }
            return tokens;
        });
    }
    get storedTokenList() {
        return this.tokenList;
    }
    getTokenForSymbol(symbol) {
        return this._tokenMap[symbol] ? this._tokenMap[symbol] : null;
    }
    getWalletFromPrivateKey(privateKey, prefix) {
        return __awaiter(this, void 0, void 0, function* () {
            const wallet = yield DirectSecp256k1Wallet.fromKey(fromHex(privateKey), prefix);
            return wallet;
        });
    }
    getAccountsfromPrivateKey(privateKey, prefix) {
        return __awaiter(this, void 0, void 0, function* () {
            const wallet = yield this.getWalletFromPrivateKey(privateKey, prefix);
            const accounts = yield wallet.getAccounts();
            return accounts[0];
        });
    }
    getWallet(address, prefix) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = `${base_1.walletPath}/${this.chainName}`;
            const encryptedPrivateKey = JSON.parse(yield fs_extra_1.default.readFile(`${path}/${address}.json`, 'utf8'), (key, value) => {
                switch (key) {
                    case 'ciphertext':
                    case 'salt':
                    case 'iv':
                        return fromBase64(value);
                    default:
                        return value;
                }
            });
            const passphrase = config_manager_cert_passphrase_1.ConfigManagerCertPassphrase.readPassphrase();
            if (!passphrase) {
                throw new Error('missing passphrase');
            }
            return yield this.decrypt(encryptedPrivateKey, passphrase, prefix);
        });
    }
    static getKeyMaterial(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const enc = new TextEncoder();
            return yield crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits', 'deriveKey']);
        });
    }
    static getKey(keyAlgorithm, keyMaterial) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield crypto.subtle.deriveKey(keyAlgorithm, keyMaterial, { name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
        });
    }
    encrypt(privateKey, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const iv = crypto.getRandomValues(new Uint8Array(16));
            const salt = crypto.getRandomValues(new Uint8Array(16));
            const keyMaterial = yield CosmosBase.getKeyMaterial(password);
            const keyAlgorithm = {
                name: 'PBKDF2',
                salt: salt,
                iterations: 500000,
                hash: 'SHA-256',
            };
            const key = yield CosmosBase.getKey(keyAlgorithm, keyMaterial);
            const cipherAlgorithm = {
                name: 'AES-GCM',
                iv: iv,
            };
            const enc = new TextEncoder();
            const ciphertext = (yield crypto.subtle.encrypt(cipherAlgorithm, key, enc.encode(privateKey)));
            return JSON.stringify({
                keyAlgorithm,
                cipherAlgorithm,
                ciphertext: new Uint8Array(ciphertext),
            }, (key, value) => {
                switch (key) {
                    case 'ciphertext':
                    case 'salt':
                    case 'iv':
                        return toBase64(Uint8Array.from(Object.values(value)));
                    default:
                        return value;
                }
            });
        });
    }
    decrypt(encryptedPrivateKey, password, prefix) {
        return __awaiter(this, void 0, void 0, function* () {
            const keyMaterial = yield CosmosBase.getKeyMaterial(password);
            const key = yield CosmosBase.getKey(encryptedPrivateKey.keyAlgorithm, keyMaterial);
            const decrypted = yield crypto.subtle.decrypt(encryptedPrivateKey.cipherAlgorithm, key, encryptedPrivateKey.ciphertext);
            const dec = new TextDecoder();
            dec.decode(decrypted);
            return yield this.getWalletFromPrivateKey(dec.decode(decrypted), prefix);
        });
    }
    getDenomMetadata(provider, denom) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield provider.queryClient.bank.denomMetadata(denom);
        });
    }
    getTokenDecimals(token) {
        return token ? token.denom_units[token.denom_units.length - 1].exponent : 6;
    }
    getBalances(wallet) {
        return __awaiter(this, void 0, void 0, function* () {
            const balances = {};
            const provider = yield this._provider;
            const accounts = yield wallet.getAccounts();
            const { address } = accounts[0];
            const allTokens = yield provider.getAllBalances(address);
            yield Promise.all(allTokens.map((t) => __awaiter(this, void 0, void 0, function* () {
                let token = this.getTokenByBase(t.denom);
                if (!token && t.denom.startsWith('ibc/')) {
                    const ibcHash = t.denom.replace('ibc/', '');
                    if (ibcHash) {
                        const { denomTrace } = yield (0, stargate_1.setupIbcExtension)(yield provider.queryClient).ibc.transfer.denomTrace(ibcHash);
                        if (denomTrace) {
                            const { baseDenom } = denomTrace;
                            token = this.getTokenByBase(baseDenom);
                        }
                    }
                }
                balances[token ? token.symbol : t.denom] = {
                    value: ethers_1.BigNumber.from(parseInt(t.amount, 10)),
                    decimals: this.getTokenDecimals(token),
                };
            })));
            return balances;
        });
    }
    getTransaction(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = yield this._provider;
            const transaction = yield provider.getTx(id);
            if (!transaction) {
                throw new Error('Transaction not found');
            }
            return transaction;
        });
    }
    getTokenBySymbol(tokenSymbol) {
        return this.tokenList.find((token) => token.symbol.toUpperCase() === tokenSymbol.toUpperCase());
    }
    getTokenByBase(base) {
        return this.tokenList.find((token) => token.base === base);
    }
    getCurrentBlockNumber() {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = yield this._provider;
            return yield provider.getHeight();
        });
    }
}
exports.CosmosBase = CosmosBase;
//# sourceMappingURL=cosmos-base.js.map