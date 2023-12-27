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
exports.TezosBase = void 0;
const fs_1 = require("fs");
const ethers_1 = require("ethers");
const tezos_config_1 = require("./tezos.config");
const logger_1 = require("../../services/logger");
const base_1 = require("../../services/base");
const rpc_1 = require("@taquito/rpc");
const signer_1 = require("@taquito/signer");
const taquito_1 = require("@taquito/taquito");
const tzkt_api_client_1 = require("./tzkt.api.client");
const axios_1 = __importDefault(require("axios"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const crypto_1 = __importDefault(require("crypto"));
const config_manager_cert_passphrase_1 = require("../../services/config-manager-cert-passphrase");
class TezosBase {
    constructor(network) {
        this.tokenList = [];
        this._tokenMap = {};
        this._contractMap = {};
        this._contractStorageMap = {};
        this._ready = false;
        this._initialized = Promise.resolve(false);
        this.chainName = 'tezos';
        const config = (0, tezos_config_1.getTezosConfig)('tezos', network);
        this.rpcUrl = config.network.nodeURL;
        this.chainId = config.network.chainId;
        this.tzktURL = config.network.tzktURL;
        this.tokenListType = config.network.tokenListType;
        this.tokenListSource = config.network.tokenListSource;
        this.ctezAdminAddress = config.network.ctezAdminAddress;
        this._provider = new taquito_1.TezosToolkit(this.rpcUrl);
        this._rpcClient = new rpc_1.RpcClient(this.rpcUrl);
        this._tzktApiClient = new tzkt_api_client_1.TzktApiClient(this.tzktURL);
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
                        this.provider.setRpcProvider(this.rpcUrl);
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
    getContract(address) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._contractMap[address]) {
                this._contractMap[address] = yield this._provider.contract.at(address);
            }
            return this._contractMap[address];
        });
    }
    getContractStorage(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const timestamp = Date.now();
            if (!this._contractStorageMap[address] || timestamp - this._contractStorageMap[address].timestamp > 12000) {
                const contract = yield this.getContract(address);
                this._contractStorageMap[address] = {
                    storage: yield contract.storage(),
                    timestamp: Date.now(),
                };
            }
            return this._contractStorageMap[address].storage;
        });
    }
    ;
    getPendingTransactions(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._rpcClient.getPendingOperations(args);
        });
    }
    ;
    getTokenList(tokenListSource, tokenListType) {
        return __awaiter(this, void 0, void 0, function* () {
            let tokens;
            if (tokenListType === 'URL') {
                const result = yield axios_1.default.get(tokenListSource);
                tokens = result.data;
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
    getNativeBalance(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const balance = yield this._provider.tz.getBalance(address);
            return { value: ethers_1.BigNumber.from(balance.toString()), decimals: 6 };
        });
    }
    getNonce(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const rpcReadAdapter = new taquito_1.RpcReadAdapter(this._rpcClient);
            const counter = yield rpcReadAdapter.getCounter(address, 'head');
            return Number(counter);
        });
    }
    getTokenBalance(contractAddress, walletAddress, tokenId, decimals) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokens = yield this._tzktApiClient.getTokens(walletAddress, contractAddress, tokenId);
            let value = ethers_1.BigNumber.from(0);
            if (tokens.length > 0) {
                value = ethers_1.BigNumber.from(tokens[0].balance);
            }
            return { value, decimals };
        });
    }
    getTokenAllowance(contractAddress, ownerAddress, spender, tokenStandard, tokenId, tokenDecimals) {
        return __awaiter(this, void 0, void 0, function* () {
            if (spender === 'plenty') {
                return { value: ethers_1.constants.MaxUint256, decimals: tokenDecimals };
            }
            let value = ethers_1.BigNumber.from(0);
            if (tokenStandard === 'FA1.2') {
                return { value: ethers_1.BigNumber.from(0), decimals: tokenDecimals };
            }
            else if (tokenStandard === 'FA2' && tokenId !== null) {
                let isOperator;
                try {
                    const storage = yield this.getContractStorage(contractAddress);
                    isOperator = yield storage.operators.get({
                        0: ownerAddress,
                        1: spender,
                        2: tokenId
                    });
                }
                catch (e) {
                    logger_1.logger.error('Tezos: Error reading operator from FA2 contract.');
                    logger_1.logger.error(e);
                }
                if (isOperator) {
                    value = ethers_1.constants.MaxUint256;
                }
            }
            return { value, decimals: tokenDecimals };
        });
    }
    getTransaction(txHash) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._tzktApiClient.getTransaction(txHash);
        });
    }
    getCurrentBlockNumber() {
        return __awaiter(this, void 0, void 0, function* () {
            const block = yield this._provider.rpc.getBlock();
            return block.header.level;
        });
    }
    getWalletFromPrivateKey(privateKey, setAsSigner = false) {
        return __awaiter(this, void 0, void 0, function* () {
            let wallet;
            wallet = new taquito_1.TezosToolkit(this.rpcUrl);
            wallet.setRpcProvider(this.rpcUrl);
            wallet.setSignerProvider(yield signer_1.InMemorySigner.fromSecretKey(privateKey));
            if (setAsSigner) {
                this._provider = wallet;
            }
            return wallet;
        });
    }
    getWallet(address, password, setAsSigner = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = `${base_1.walletPath}/${this.chainName}`;
            try {
                let rawData = [];
                if (!address) {
                    const filenames = fs_extra_1.default.readdirSync(`${path}/`);
                    for (const filename of filenames) {
                        const fileData = yield fs_1.promises.readFile(`${path}/` + filename, 'utf-8');
                        rawData.push(fileData);
                    }
                }
                else {
                    rawData.push(yield fs_extra_1.default.readFile(`${path}/${address}.json`, 'utf8'));
                }
                if (rawData.length === 0) {
                    logger_1.logger.error('Tezos: No wallets found');
                }
                if (!password) {
                    const passphrase = config_manager_cert_passphrase_1.ConfigManagerCertPassphrase.readPassphrase();
                    if (!passphrase) {
                        throw new Error('missing passphrase');
                    }
                    password = passphrase;
                }
                let privateKeys = [];
                for (const data of rawData) {
                    const privateKey = this.decrypt(data, password);
                    privateKeys.push(privateKey);
                }
                let bestBalance = ethers_1.BigNumber.from(0);
                let bestPrivateKey = privateKeys[0];
                if (privateKeys.length > 1)
                    for (const privateKey of privateKeys) {
                        const wallet = yield this.getWalletFromPrivateKey(privateKey);
                        const address = yield wallet.signer.publicKeyHash();
                        const balance = yield this.getNativeBalance(address);
                        if (balance.value.gt(bestBalance)) {
                            bestBalance = balance.value;
                            bestPrivateKey = privateKey;
                        }
                    }
                return yield this.getWalletFromPrivateKey(bestPrivateKey, setAsSigner);
            }
            catch (e) {
                logger_1.logger.error('Tezos: Could not find wallet' + address, e);
                throw e;
            }
        });
    }
    encrypt(privateKey, password) {
        const iv = crypto_1.default.randomBytes(16);
        const key = crypto_1.default
            .createHash('sha256')
            .update(String(password))
            .digest('base64')
            .substr(0, 32);
        const encrypter = crypto_1.default.createCipheriv('aes-256-cbc', key, iv);
        const encryptedPrivateKey = encrypter.update(privateKey, 'utf8', 'hex') + encrypter.final('hex');
        return JSON.stringify({
            iv: iv.toString('hex'),
            encryptedPrivateKey: encryptedPrivateKey.toString(),
        });
    }
    decrypt(encryptedPrivateKey, password) {
        const key = crypto_1.default
            .createHash('sha256')
            .update(String(password))
            .digest('base64')
            .substr(0, 32);
        const wallet = JSON.parse(encryptedPrivateKey);
        const decrypter = crypto_1.default.createDecipheriv('aes-256-cbc', key, Buffer.from(wallet.iv, 'hex'));
        return decrypter.update(wallet.encryptedPrivateKey, 'hex', 'utf8') + decrypter.final('utf8');
    }
}
exports.TezosBase = TezosBase;
//# sourceMappingURL=tezos.base.js.map