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
exports.XRPLish = exports.XRPL = void 0;
const xrpl_1 = require("xrpl");
const axios_1 = __importDefault(require("axios"));
const fs_1 = require("fs");
const crypto_1 = __importDefault(require("crypto"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const paths_1 = require("../../paths");
const base_1 = require("../../services/base");
const config_manager_cert_passphrase_1 = require("../../services/config-manager-cert-passphrase");
const xrpl_config_1 = require("./xrpl.config");
const xrpl_requests_1 = require("./xrpl.requests");
const xrpl_order_storage_1 = require("./xrpl.order-storage");
const xrpl_order_tracker_1 = require("./xrpl.order-tracker");
const refcounting_closeable_1 = require("../../services/refcounting-closeable");
const xrpl_controllers_1 = require("./xrpl.controllers");
const xrpl_utils_1 = require("../../connectors/xrpl/xrpl.utils");
class XRPL {
    constructor(network) {
        this.tokenList = [];
        this.marketList = [];
        this._tokenMap = {};
        this._marketMap = {};
        this._ready = false;
        this.initializing = false;
        const config = (0, xrpl_config_1.getXRPLConfig)('xrpl', network);
        this._chain = 'xrpl';
        this._network = network;
        this.rpcUrl = config.network.nodeUrl;
        this._nativeTokenSymbol = config.network.nativeCurrencySymbol;
        this._tokenListSource = config.network.tokenListSource;
        this._tokenListType = config.network.tokenListType;
        this._marketListSource = config.network.marketListSource;
        this._marketListType = config.network.marketListType;
        this._reserveBaseXrp = 0;
        this._reserveIncrementXrp = 0;
        this._client = new xrpl_1.Client(this.rpcUrl, {
            timeout: config.requestTimeout,
            connectionTimeout: config.connectionTimeout,
            feeCushion: config.feeCushion,
            maxFeeXRP: config.maxFeeXRP,
        });
        this.fee = {
            base: '0',
            median: '0',
            minimum: '0',
            openLedger: '0',
        };
        this._requestCount = 0;
        this._metricsLogInterval = 300000;
        this.onValidationReceived(this.requestCounter.bind(this));
        this._refCountingHandle = refcounting_closeable_1.ReferenceCountingCloseable.createHandle();
        this._orderStorage = xrpl_order_storage_1.XRPLOrderStorage.getInstance(this.resolveDBPath(config.orderDbPath), this._refCountingHandle);
        this._orderStorage.declareOwnership(this._refCountingHandle);
        this.controller = xrpl_controllers_1.XRPLController;
        this.onDisconnected((_code) => __awaiter(this, void 0, void 0, function* () {
            this.ensureConnection();
        }));
    }
    static getInstance(network) {
        if (XRPL._instances === undefined) {
            XRPL._instances = {};
        }
        if (!(network in XRPL._instances)) {
            XRPL._instances[network] = new XRPL(network);
        }
        return XRPL._instances[network];
    }
    static getConnectedInstances() {
        return XRPL._instances;
    }
    resolveDBPath(oldPath) {
        if (oldPath.charAt(0) === '/')
            return oldPath;
        const dbDir = path_1.default.join((0, paths_1.rootPath)(), 'db/');
        fs_extra_1.default.mkdirSync(dbDir, { recursive: true });
        return path_1.default.join(dbDir, oldPath);
    }
    get client() {
        return this._client;
    }
    onConnected(callback) {
        this._client.on('connected', callback);
    }
    onDisconnected(callback) {
        this._client.on('disconnected', callback);
    }
    onLedgerClosed(callback) {
        this._client.on('ledgerClosed', callback);
    }
    onValidationReceived(callback) {
        this._client.on('validationReceived', callback);
    }
    onTransaction(callback) {
        this._client.on('transaction', callback);
    }
    onPeerStatusChange(callback) {
        this._client.on('peerStatusChange', callback);
    }
    onConsensusPhase(callback) {
        this._client.on('consensusPhase', callback);
    }
    onPathFind(callback) {
        this._client.on('path_find', callback);
    }
    onError(callback) {
        this._client.on('error', callback);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.ready() && !this.initializing) {
                this.initializing = true;
                yield this.ensureConnection();
                yield this.getReserveInfo();
                yield this.loadTokens(this._tokenListSource, this._tokenListType);
                yield this.loadMarkets(this._marketListSource, this._marketListType);
                yield this.getFee();
                yield this._orderStorage.init();
                this._ready = true;
                this.initializing = false;
            }
        });
    }
    loadTokens(tokenListSource, tokenListType) {
        return __awaiter(this, void 0, void 0, function* () {
            this.tokenList = yield this.getTokenList(tokenListSource, tokenListType);
            if (this.tokenList) {
                this.tokenList.forEach((token) => {
                    if (!this._tokenMap[token.code]) {
                        this._tokenMap[token.code] = [];
                    }
                    this._tokenMap[token.code].push(token);
                });
            }
        });
    }
    loadMarkets(marketListSource, marketListType) {
        return __awaiter(this, void 0, void 0, function* () {
            this.marketList = yield this.getMarketList(marketListSource, marketListType);
            if (this.marketList) {
                this.marketList.forEach((market) => {
                    if (!this._marketMap[market.marketId]) {
                        this._marketMap[market.marketId] = [];
                    }
                    this._marketMap[market.marketId].push(market);
                });
            }
        });
    }
    getTokenList(tokenListSource, tokenListType) {
        return __awaiter(this, void 0, void 0, function* () {
            let tokens;
            if (tokenListType === 'URL') {
                const resp = yield axios_1.default.get(tokenListSource);
                tokens = resp.data.tokens;
            }
            else {
                tokens = JSON.parse(yield fs_1.promises.readFile(tokenListSource, 'utf8'));
            }
            return tokens;
        });
    }
    getMarketList(marketListSource, marketListType) {
        return __awaiter(this, void 0, void 0, function* () {
            let markets;
            if (marketListType === 'URL') {
                const resp = yield axios_1.default.get(marketListSource);
                markets = resp.data.tokens;
            }
            else {
                markets = JSON.parse(yield fs_1.promises.readFile(marketListSource, 'utf8'));
            }
            return markets;
        });
    }
    get storedTokenList() {
        return this.tokenList;
    }
    get storedMarketList() {
        return this.marketList;
    }
    getTokenForSymbol(code) {
        let query = code;
        if (code === 'SOLO') {
            query = '534F4C4F00000000000000000000000000000000';
        }
        return this._tokenMap[query] ? this._tokenMap[query] : undefined;
    }
    getWalletFromSeed(seed) {
        const wallet = xrpl_1.Wallet.fromSeed(seed);
        return wallet;
    }
    getWallet(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = `${base_1.walletPath}/${this.chain}`;
            const encryptedSeed = yield fs_extra_1.default.readFile(`${path}/${address}.json`, 'utf8');
            const passphrase = config_manager_cert_passphrase_1.ConfigManagerCertPassphrase.readPassphrase();
            if (!passphrase) {
                throw new Error('missing passphrase');
            }
            const decrypted = yield this.decrypt(encryptedSeed, passphrase);
            return xrpl_1.Wallet.fromSeed(decrypted);
        });
    }
    encrypt(secret, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const algorithm = 'aes-256-ctr';
            const iv = crypto_1.default.randomBytes(16);
            const salt = crypto_1.default.randomBytes(32);
            const key = crypto_1.default.pbkdf2Sync(password, salt, 5000, 32, 'sha512');
            const cipher = crypto_1.default.createCipheriv(algorithm, key, iv);
            const encrypted = Buffer.concat([cipher.update(secret), cipher.final()]);
            const ivJSON = iv.toJSON();
            const saltJSON = salt.toJSON();
            const encryptedJSON = encrypted.toJSON();
            return JSON.stringify({
                algorithm,
                iv: ivJSON,
                salt: saltJSON,
                encrypted: encryptedJSON,
            });
        });
    }
    decrypt(encryptedSecret, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const hash = JSON.parse(encryptedSecret);
            const salt = Buffer.from(hash.salt, 'utf8');
            const iv = Buffer.from(hash.iv, 'utf8');
            const key = crypto_1.default.pbkdf2Sync(password, salt, 5000, 32, 'sha512');
            const decipher = crypto_1.default.createDecipheriv(hash.algorithm, key, iv);
            const decrpyted = Buffer.concat([
                decipher.update(Buffer.from(hash.encrypted, 'hex')),
                decipher.final(),
            ]);
            return decrpyted.toString();
        });
    }
    getNativeBalance(wallet) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureConnection();
            const balance = yield this._client.getXrpBalance(wallet.address);
            return balance;
        });
    }
    getNativeAvailableBalance(wallet) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureConnection();
            const AccountInfoResponse = yield this._client.request({
                command: 'account_info',
                account: wallet.address,
            });
            const ownerItem = AccountInfoResponse.result.account_data.OwnerCount;
            const totalReserve = this._reserveBaseXrp + ownerItem * this._reserveIncrementXrp;
            const balance = parseFloat(yield this._client.getXrpBalance(wallet.address)) -
                totalReserve;
            return balance.toString();
        });
    }
    getAllBalance(wallet) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureConnection();
            const balances = [];
            const respBalances = yield this._client.getBalances(wallet.address);
            respBalances.forEach((token) => {
                if (token.currency === 'XRP') {
                    balances.push({
                        currency: token.currency,
                        value: token.value,
                    });
                }
                else {
                    const filtered = this.getTokenForSymbol(token.currency);
                    if (filtered === undefined) {
                        return;
                    }
                    balances.push({
                        currency: (0, xrpl_utils_1.convertHexToString)(token.currency),
                        issuer: token.issuer,
                        value: token.value,
                    });
                }
            });
            return balances;
        });
    }
    ready() {
        return this._ready;
    }
    isConnected() {
        return this._client.isConnected();
    }
    ensureConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isConnected()) {
                yield this._client.connect();
            }
        });
    }
    getReserveInfo() {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureConnection();
            const reserveInfoResp = yield this._client.request({
                command: 'server_info',
            });
            this._reserveBaseXrp =
                (_b = (_a = reserveInfoResp.result.info.validated_ledger) === null || _a === void 0 ? void 0 : _a.reserve_base_xrp) !== null && _b !== void 0 ? _b : 0;
            this._reserveIncrementXrp =
                (_d = (_c = reserveInfoResp.result.info.validated_ledger) === null || _c === void 0 ? void 0 : _c.reserve_inc_xrp) !== null && _d !== void 0 ? _d : 0;
        });
    }
    get chain() {
        return this._chain;
    }
    get network() {
        return this._network;
    }
    get nativeTokenSymbol() {
        return this._nativeTokenSymbol;
    }
    requestCounter() {
        this._requestCount += 1;
    }
    get requestCount() {
        return this._requestCount;
    }
    get metricsLogInterval() {
        return this._metricsLogInterval;
    }
    getCurrentLedgerIndex() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureConnection();
            const currentIndex = yield this.client.getLedgerIndex();
            return currentIndex;
        });
    }
    getCurrentBlockNumber() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureConnection();
            const currentIndex = yield this.getCurrentLedgerIndex();
            return currentIndex;
        });
    }
    getTransactionStatusCode(txData) {
        return __awaiter(this, void 0, void 0, function* () {
            let txStatus;
            if (!txData) {
                txStatus = xrpl_requests_1.TransactionResponseStatusCode.FAILED;
            }
            else {
                if (txData.result.validated === false) {
                    txStatus = xrpl_requests_1.TransactionResponseStatusCode.PENDING;
                }
                else {
                    if (txData.result.meta.TransactionResult) {
                        const result = txData.result.meta
                            .TransactionResult;
                        txStatus =
                            result == 'tesSUCCESS'
                                ? xrpl_requests_1.TransactionResponseStatusCode.CONFIRMED
                                : xrpl_requests_1.TransactionResponseStatusCode.FAILED;
                    }
                    else {
                        txStatus = xrpl_requests_1.TransactionResponseStatusCode.FAILED;
                    }
                }
            }
            return txStatus;
        });
    }
    getTransaction(txHash) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureConnection();
            const tx_resp = yield this._client.request({
                command: 'tx',
                transaction: txHash,
                binary: false,
            });
            const result = tx_resp;
            return result;
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._network in XRPL._instances) {
                yield xrpl_order_tracker_1.OrderTracker.stopTrackingOnAllInstancesForNetwork(this._network);
                yield this._orderStorage.close(this._refCountingHandle);
                yield this._client.disconnect();
                delete XRPL._instances[this._network];
            }
        });
    }
    getFee() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureConnection();
            const tx_resp = yield this._client.request({
                command: 'fee',
            });
            this.fee = {
                base: tx_resp.result.drops.base_fee,
                median: tx_resp.result.drops.median_fee,
                minimum: tx_resp.result.drops.minimum_fee,
                openLedger: tx_resp.result.drops.open_ledger_fee,
            };
            return this.fee;
        });
    }
    get orderStorage() {
        return this._orderStorage;
    }
    subtractBalancesWithOpenOffers(balances, wallet) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureConnection();
            const accountOffcersResp = yield this._client.request({
                command: 'account_offers',
                account: wallet.address,
            });
            const offers = accountOffcersResp.result.offers;
            const subtractedBalances = JSON.parse(JSON.stringify(balances));
            const xrpBalance = subtractedBalances.find((balance) => balance.currency === 'XRP');
            const currentNativeBalance = yield this.getNativeAvailableBalance(wallet);
            if (xrpBalance)
                xrpBalance.value = currentNativeBalance;
            if (offers !== undefined) {
                offers.forEach((offer) => {
                    const takerGetsBalance = offer.taker_gets;
                    if (typeof takerGetsBalance === 'string') {
                        const xrpBalance = subtractedBalances.find((balance) => balance.currency === 'XRP');
                        if (xrpBalance) {
                            xrpBalance.value = (parseFloat(xrpBalance.value) -
                                parseFloat((0, xrpl_1.dropsToXrp)(takerGetsBalance))).toString();
                        }
                    }
                    else {
                        const tokenBalance = subtractedBalances.find((balance) => balance.currency === (0, xrpl_utils_1.convertHexToString)(takerGetsBalance.currency));
                        if (tokenBalance) {
                            tokenBalance.value = (parseFloat(tokenBalance.value) -
                                parseFloat(takerGetsBalance.value)).toString();
                        }
                    }
                });
            }
            return subtractedBalances;
        });
    }
}
exports.XRPL = XRPL;
exports.XRPLish = XRPL;
//# sourceMappingURL=xrpl.js.map