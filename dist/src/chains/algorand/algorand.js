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
exports.Algorand = void 0;
const lru_cache_1 = __importDefault(require("lru-cache"));
const algorand_config_1 = require("./algorand.config");
const algosdk_1 = require("algosdk");
const crypto_1 = require("crypto");
const base_1 = require("../../services/base");
const fs_extra_1 = __importDefault(require("fs-extra"));
const config_manager_cert_passphrase_1 = require("../../services/config-manager-cert-passphrase");
const axios_1 = __importDefault(require("axios"));
const fs_1 = require("fs");
const algorand_controller_1 = require("./algorand.controller");
class Algorand {
    constructor(network, nodeUrl, indexerUrl, assetListType, assetListSource) {
        this._assetMap = {};
        this._chain = 'algorand';
        this._ready = false;
        this._network = network;
        const config = (0, algorand_config_1.getAlgorandConfig)(network);
        this.nativeTokenSymbol = config.nativeCurrencySymbol;
        this._algod = new algosdk_1.Algodv2('', nodeUrl);
        this._indexer = new algosdk_1.Indexer('', indexerUrl, 'undefined');
        this._assetListType = assetListType;
        this._assetListSource = assetListSource;
        this.gasPrice = 0;
        this.gasLimit = 0;
        this.gasCost = 0.001;
        this.controller = algorand_controller_1.AlgorandController;
    }
    get algod() {
        return this._algod;
    }
    get indexer() {
        return this._indexer;
    }
    get network() {
        return this._network;
    }
    get storedAssetList() {
        return Object.values(this._assetMap);
    }
    ready() {
        return this._ready;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadAssets();
            this._ready = true;
            return;
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            return;
        });
    }
    static getInstance(network) {
        const config = (0, algorand_config_1.getAlgorandConfig)(network);
        if (Algorand._instances === undefined) {
            Algorand._instances = new lru_cache_1.default({
                max: config.network.maxLRUCacheInstances,
            });
        }
        if (!Algorand._instances.has(config.network.name)) {
            if (network !== null) {
                const nodeUrl = config.network.nodeURL;
                const indexerUrl = config.network.indexerURL;
                const assetListType = config.network.assetListType;
                const assetListSource = config.network.assetListSource;
                Algorand._instances.set(config.network.name, new Algorand(network, nodeUrl, indexerUrl, assetListType, assetListSource));
            }
            else {
                throw new Error(`Algorand.getInstance received an unexpected network: ${network}.`);
            }
        }
        return Algorand._instances.get(config.network.name);
    }
    static getConnectedInstances() {
        const connectedInstances = {};
        if (this._instances !== undefined) {
            const keys = Array.from(this._instances.keys());
            for (const instance of keys) {
                if (instance !== undefined) {
                    connectedInstances[instance] = this._instances.get(instance);
                }
            }
        }
        return connectedInstances;
    }
    getCurrentBlockNumber() {
        return __awaiter(this, void 0, void 0, function* () {
            const status = yield this._algod.status().do();
            return status['next-version-round'];
        });
    }
    getTransaction(txHash) {
        return __awaiter(this, void 0, void 0, function* () {
            const transactionId = txHash.startsWith('0x') ? txHash.slice(2) : txHash;
            let currentBlock;
            let transactionData;
            let transactionBlock;
            let fee;
            try {
                transactionData = yield this._algod
                    .pendingTransactionInformation(transactionId)
                    .do();
                transactionBlock = transactionData['confirmed-round'];
                transactionBlock = transactionBlock ? transactionBlock : null;
                fee = transactionData.txn.fee;
                currentBlock = yield this.getCurrentBlockNumber();
            }
            catch (error) {
                if (error.status != 404) {
                    throw error;
                }
                transactionData = yield this._indexer
                    .lookupTransactionByID(transactionId)
                    .do();
                currentBlock = transactionData['current-round'];
                transactionBlock = transactionData.transaction['confirmed-round'];
                fee = transactionData.transaction.fee;
            }
            return {
                currentBlock,
                txBlock: transactionBlock,
                txHash: '0x' + transactionId,
                fee,
            };
        });
    }
    getAccountFromPrivateKey(mnemonic) {
        return (0, algosdk_1.mnemonicToSecretKey)(mnemonic);
    }
    getAccountFromAddress(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = `${base_1.walletPath}/${this._chain}`;
            const encryptedMnemonic = yield fs_extra_1.default.readFile(`${path}/${address}.json`, 'utf8');
            const passphrase = config_manager_cert_passphrase_1.ConfigManagerCertPassphrase.readPassphrase();
            if (!passphrase) {
                throw new Error('missing passphrase');
            }
            const mnemonic = this.decrypt(encryptedMnemonic, passphrase);
            return (0, algosdk_1.mnemonicToSecretKey)(mnemonic);
        });
    }
    encrypt(mnemonic, password) {
        const iv = (0, crypto_1.randomBytes)(16);
        const key = Buffer.alloc(32);
        key.write(password);
        const cipher = (0, crypto_1.createCipheriv)('aes-256-cbc', key, iv);
        const encrypted = Buffer.concat([cipher.update(mnemonic), cipher.final()]);
        return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
    }
    decrypt(encryptedMnemonic, password) {
        const [iv, encryptedKey] = encryptedMnemonic.split(':');
        const key = Buffer.alloc(32);
        key.write(password);
        const decipher = (0, crypto_1.createDecipheriv)('aes-256-cbc', key, Buffer.from(iv, 'hex'));
        const decrpyted = Buffer.concat([
            decipher.update(Buffer.from(encryptedKey, 'hex')),
            decipher.final(),
        ]);
        return decrpyted.toString();
    }
    getAssetBalance(account, assetName) {
        return __awaiter(this, void 0, void 0, function* () {
            const algorandAsset = this._assetMap[assetName];
            let balance;
            try {
                const response = yield this._algod
                    .accountAssetInformation(account.addr, algorandAsset.assetId)
                    .do();
                balance = response['asset-holding'].amount;
            }
            catch (error) {
                if (!error.message.includes('account asset info not found')) {
                    throw error;
                }
                balance = 0;
            }
            const amount = balance * parseFloat(`1e-${algorandAsset.decimals}`);
            return amount.toString();
        });
    }
    getNativeBalance(account) {
        return __awaiter(this, void 0, void 0, function* () {
            const accountInfo = yield this._algod.accountInformation(account.addr).do();
            const algoAsset = this._assetMap[this.nativeTokenSymbol];
            return (accountInfo.amount * parseFloat(`1e-${algoAsset.decimals}`)).toString();
        });
    }
    getAssetForSymbol(symbol) {
        return this._assetMap[symbol] ? this._assetMap[symbol] : null;
    }
    optIn(address, symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield this.getAccountFromAddress(address);
            const assetIndex = this._assetMap[symbol].assetId;
            const suggestedParams = yield this._algod.getTransactionParams().do();
            const optInTxn = (0, algosdk_1.makeAssetTransferTxnWithSuggestedParamsFromObject)({
                from: account.addr,
                to: address,
                suggestedParams,
                assetIndex,
                amount: 0,
            });
            const signedOptInTxn = optInTxn.signTxn(account.sk);
            const resp = yield this._algod.sendRawTransaction(signedOptInTxn).do();
            return resp;
        });
    }
    loadAssets() {
        return __awaiter(this, void 0, void 0, function* () {
            const assetData = yield this.getAssetData();
            for (const result of assetData) {
                this._assetMap[result.unit_name.toUpperCase()] = {
                    symbol: result.unit_name.toUpperCase(),
                    assetId: +result.id,
                    decimals: result.decimals,
                };
            }
        });
    }
    getAssetData() {
        return __awaiter(this, void 0, void 0, function* () {
            let assetData;
            if (this._assetListType === 'URL') {
                const response = yield axios_1.default.get(this._assetListSource);
                assetData = response.data.results;
            }
            else {
                const data = JSON.parse(yield fs_1.promises.readFile(this._assetListSource, 'utf8'));
                assetData = data.results;
            }
            return assetData;
        });
    }
    get storedTokenList() {
        return this._assetMap;
    }
}
exports.Algorand = Algorand;
//# sourceMappingURL=algorand.js.map