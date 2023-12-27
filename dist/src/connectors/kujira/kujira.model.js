"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.KujiraModel = void 0;
const kujira_types_1 = require("./kujira.types");
const kujira_config_1 = require("./kujira.config");
const crypto_1 = require("@cosmjs/crypto");
const kujira_helpers_1 = require("./kujira.helpers");
const kujira_js_1 = require("kujira.js");
const kujira_convertors_1 = require("./kujira.convertors");
const stargate_1 = require("@cosmjs/stargate");
const signingcosmwasmclient_1 = require("@cosmjs/cosmwasm-stargate/build/signingcosmwasmclient");
const proto_signing_1 = require("@cosmjs/proto-signing");
const tendermint_rpc_1 = require("@cosmjs/tendermint-rpc");
const bignumber_js_1 = require("bignumber.js");
const base_1 = require("../../services/base");
const fs_extra_1 = __importDefault(require("fs-extra"));
const config_manager_cert_passphrase_1 = require("../../services/config-manager-cert-passphrase");
const crypto = __importStar(require("crypto"));
const util_1 = __importDefault(require("util"));
const fs_1 = require("fs");
const pbkdf2 = util_1.default.promisify(crypto.pbkdf2);
const config = kujira_config_1.KujiraConfig.config;
class KujiraModel {
    static getInstance(chain, network) {
        if (KujiraModel._instances === undefined) {
            KujiraModel._instances = {};
        }
        const key = `${chain}:${network}`;
        if (!(key in KujiraModel._instances)) {
            KujiraModel._instances[key] = new KujiraModel(chain, network);
        }
        return KujiraModel._instances[key];
    }
    static getConnectedInstances() {
        return KujiraModel._instances;
    }
    constructor(chain, network) {
        this.isInitializing = false;
        this.basicMarkets = (0, kujira_types_1.IMap)();
        this.basicTokens = (0, kujira_types_1.IMap)();
        this.markets = (0, kujira_types_1.IMap)();
        this.tokens = (0, kujira_types_1.IMap)();
        this.connector = 'kujira';
        this.isReady = false;
        this.chain = chain;
        this.network = network;
        this.kujiraNetwork = (0, kujira_convertors_1.convertNetworkToKujiraNetwork)(this.network);
        this.accounts = (0, kujira_types_1.IMap)().asMutable();
    }
    getRPCEndpoint() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.rpcEndpoint) {
                this.rpcEndpoint =
                    (0, kujira_helpers_1.getNotNullOrThrowError)((0, kujira_helpers_1.getNotNullOrThrowError)(config.networks).get(this.network)).nodeURL || (yield this.getFastestRpc());
            }
            return this.rpcEndpoint;
        });
    }
    getDirectSecp256k1HdWallet(mnemonic, prefix, accountNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield proto_signing_1.DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
                prefix: prefix,
                hdPaths: [
                    [
                        crypto_1.Slip10RawIndex.hardened(44),
                        crypto_1.Slip10RawIndex.hardened(118),
                        crypto_1.Slip10RawIndex.hardened(0),
                        crypto_1.Slip10RawIndex.normal(0),
                        crypto_1.Slip10RawIndex.normal(accountNumber),
                    ],
                ],
            });
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isReady && !this.isInitializing) {
                this.isInitializing = true;
                const rpcEndpoint = yield this.getRPCEndpoint();
                this.kujiraGetHttpBatchClient(rpcEndpoint);
                yield this.kujiraGetTendermint37Client();
                this.kujiraGetKujiraQueryClient();
                yield this.kujiraGetStargateClient(rpcEndpoint);
                yield this.loadMarketsAndTokens();
                yield this.getAllMarkets({});
                this.isReady = true;
                this.isInitializing = false;
            }
        });
    }
    loadMarketsAndTokens() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.kujiraGetBasicMarkets();
            yield this.kujiraGetBasicTokens();
        });
    }
    kujiraGetStargateClient(rpcEndpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            this.stargateClient = yield stargate_1.StargateClient.connect(rpcEndpoint);
        });
    }
    kujiraGetKujiraQueryClient() {
        this.kujiraQueryClient = (0, kujira_js_1.kujiraQueryClient)({
            client: this.tendermint37Client,
        });
    }
    kujiraGetTendermint37Client() {
        return __awaiter(this, void 0, void 0, function* () {
            this.tendermint37Client = yield tendermint_rpc_1.Tendermint37Client.create(this.httpBatchClient);
        });
    }
    kujiraGetHttpBatchClient(rpcEndpoint) {
        this.httpBatchClient = new tendermint_rpc_1.HttpBatchClient(rpcEndpoint, {
            dispatchInterval: 2000,
        });
    }
    kujiraGetBasicTokens() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.basicTokens.isEmpty())
                return this.basicTokens;
            const basicTokens = (0, kujira_types_1.IMap)().asMutable();
            const basicMarkets = yield this.kujiraGetBasicMarkets();
            for (const basicMarket of basicMarkets.values()) {
                const basicBaseToken = kujira_js_1.Denom.from(basicMarket.denoms[0].reference);
                const basicQuoteToken = kujira_js_1.Denom.from(basicMarket.denoms[1].reference);
                basicTokens.set(basicBaseToken.reference, basicBaseToken);
                basicTokens.set(basicQuoteToken.reference, basicQuoteToken);
            }
            this.basicTokens = basicTokens;
            return this.basicTokens;
        });
    }
    kujiraGetBasicMarkets() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.basicMarkets.isEmpty())
                return this.basicMarkets;
            const contractsFilepath = (0, kujira_helpers_1.getNotNullOrThrowError)(config.networks.get(this.network)).tokenListSource;
            const contracts = JSON.parse(yield fs_1.promises.readFile(contractsFilepath, 'utf8'));
            const data = contracts[this.kujiraNetwork].fin.reduce(kujira_js_1.fin.compile(this.kujiraNetwork), {});
            this.basicMarkets = (0, kujira_types_1.IMap)(data).asMutable();
            return this.basicMarkets;
        });
    }
    getRoot(_options) {
        return {
            chain: this.chain,
            network: this.network,
            connector: this.connector,
            connection: this.isReady,
            timestamp: Date.now(),
        };
    }
    getWalletsPublicKeys(_options) {
        return this.accounts.keySeq().toArray();
    }
    getWalletArtifacts(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.accounts.has(options.ownerAddress)) {
                return (0, kujira_helpers_1.getNotNullOrThrowError)(this.accounts.get(options.ownerAddress));
            }
            const basicWallet = yield this.decryptWallet({
                accountAddress: options.ownerAddress,
            });
            const rpcEndpoint = yield this.getRPCEndpoint();
            const prefix = config.prefix;
            const gasPrice = `${config.gasPrice}${config.gasPriceSuffix}`;
            const mnemonic = basicWallet.mnemonic;
            const accountNumber = basicWallet.accountNumber || config.accountNumber;
            const directSecp256k1HdWallet = yield this.getDirectSecp256k1HdWallet(mnemonic, prefix, accountNumber);
            const accounts = yield directSecp256k1HdWallet.getAccounts();
            const account = accounts[0];
            const publicKey = account.address;
            const signingStargateClient = yield this.kujiraGetSigningStargateClient(rpcEndpoint, directSecp256k1HdWallet, gasPrice);
            const signingCosmWasmClient = yield this.kujiraGetSigningCosmWasmClient(rpcEndpoint, directSecp256k1HdWallet, gasPrice);
            const walletArtifacts = {
                publicKey: publicKey,
                accountData: account,
                accountNumber: accountNumber,
                directSecp256k1HdWallet: directSecp256k1HdWallet,
                signingStargateClient: signingStargateClient,
                signingCosmWasmClient: signingCosmWasmClient,
                finClients: (0, kujira_types_1.IMap)().asMutable(),
            };
            this.accounts.set(publicKey, walletArtifacts);
            return walletArtifacts;
        });
    }
    kujiraGetSigningCosmWasmClient(rpcEndpoint, directSecp256k1HdWallet, gasPrice) {
        return __awaiter(this, void 0, void 0, function* () {
            const signingCosmWasmClient = yield signingcosmwasmclient_1.SigningCosmWasmClient.connectWithSigner(rpcEndpoint, directSecp256k1HdWallet, {
                registry: kujira_js_1.registry,
                gasPrice: stargate_1.GasPrice.fromString(gasPrice),
            });
            return signingCosmWasmClient;
        });
    }
    kujiraGetSigningStargateClient(rpcEndpoint, directSecp256k1HdWallet, gasPrice) {
        return __awaiter(this, void 0, void 0, function* () {
            const signingStargateClient = yield stargate_1.SigningStargateClient.connectWithSigner(rpcEndpoint, directSecp256k1HdWallet, {
                registry: kujira_js_1.registry,
                gasPrice: stargate_1.GasPrice.fromString(gasPrice),
            });
            return signingStargateClient;
        });
    }
    kujiraQueryClientWasmQueryContractSmart(address, query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, kujira_helpers_1.runWithRetryAndTimeout)(this.kujiraQueryClient, this.kujiraQueryClient.wasm.queryContractSmart, [address, query]);
        });
    }
    kujiraSigningStargateClientSignAndBroadcast(signingStargateClient, signerAddress, messages, fee, memo) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, kujira_helpers_1.runWithRetryAndTimeout)(signingStargateClient, signingStargateClient.signAndBroadcast, [signerAddress, messages, fee, memo]);
        });
    }
    kujiraStargateClientGetHeight() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, kujira_helpers_1.runWithRetryAndTimeout)(this.stargateClient, this.stargateClient.getHeight, []);
        });
    }
    kujiraStargateClientGetTx(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, kujira_helpers_1.runWithRetryAndTimeout)(this.stargateClient, this.stargateClient.getTx, [id]);
        });
    }
    kujiraStargateClientGetAllBalances(address) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, kujira_helpers_1.runWithRetryAndTimeout)(this.stargateClient, this.stargateClient.getAllBalances, [address]);
        });
    }
    kujiraStargateClientGetBalanceStaked(address) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, kujira_helpers_1.runWithRetryAndTimeout)(this.stargateClient, this.stargateClient.getBalanceStaked, [address]);
        });
    }
    kujiraFinClientWithdrawOrders(finClient, { orderIdxs, }, fee = 'auto', memo, funds) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, kujira_helpers_1.runWithRetryAndTimeout)(finClient, finClient.withdrawOrders, [orderIdxs, fee, memo, funds]);
        });
    }
    getToken(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (options.id) {
                return (0, kujira_convertors_1.convertKujiraTokenToToken)(kujira_js_1.Denom.from((0, kujira_helpers_1.getNotNullOrThrowError)(options.id)));
            }
            else {
                const allTokens = yield this.getAllTokens({});
                let token;
                if (options.symbol) {
                    token = allTokens
                        .valueSeq()
                        .find((token) => token.symbol == options.symbol);
                }
                else if (options.name) {
                    token = allTokens
                        .valueSeq()
                        .find((token) => token.name == options.name);
                }
                if (!token)
                    throw new kujira_types_1.TokenNotFoundError(`Token ${options.symbol} not found.`);
                return token;
            }
        });
    }
    getTokens(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokens = (0, kujira_types_1.IMap)().asMutable();
            if (options.ids) {
                for (const id of options.ids) {
                    const token = yield this.getToken({ id });
                    tokens.set(token.id, token);
                }
                return tokens;
            }
            else if (options.names) {
                for (const name of options.names) {
                    const token = yield this.getToken({ name });
                    tokens.set(token.id, token);
                }
                return tokens;
            }
            else if (options.symbols) {
                for (const symbol of options.symbols) {
                    const token = yield this.getToken({ symbol });
                    tokens.set(token.id, token);
                }
                return tokens;
            }
            else {
                throw new Error('No token identifiers provided.');
            }
        });
    }
    getAllTokens(_options) {
        return __awaiter(this, void 0, void 0, function* () {
            const basicTokens = yield this.kujiraGetBasicTokens();
            const tokenIds = basicTokens
                .valueSeq()
                .map((token) => token.reference)
                .toArray();
            (0, kujira_convertors_1.convertNonStandardKujiraTokenIds)(tokenIds);
            this.tokens = yield this.getTokens({ ids: tokenIds });
            return this.tokens;
        });
    }
    getTokenSymbolsToTokenIdsMap(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokens = yield this.getAllTokens({});
            let output = (0, kujira_types_1.IMap)().asMutable();
            tokens.valueSeq().forEach((token) => output.set(token.symbol, token.id));
            if (options === null || options === void 0 ? void 0 : options.symbols) {
                const symbols = (0, kujira_helpers_1.getNotNullOrThrowError)(options.symbols);
                output = output.filter((_, symbol) => symbols.includes(symbol));
            }
            return output;
        });
    }
    getMarket(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const markets = yield this.getAllMarkets({});
            const marketId = options.id || markets.findKey((market) => market.name === options.name);
            if (!marketId)
                throw new kujira_types_1.MarketNotFoundError(`No market informed.`);
            const market = markets.get(marketId);
            if (!market)
                throw new kujira_types_1.MarketNotFoundError(`Market "${options.id}" not found.`);
            return (0, kujira_helpers_1.getNotNullOrThrowError)(market);
        });
    }
    getMarkets(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const allMarkets = yield this.getAllMarkets({});
            if (!options.ids && !options.names) {
                return allMarkets;
            }
            const markets = allMarkets.filter((market) => {
                var _a, _b;
                return ((_a = options.ids) === null || _a === void 0 ? void 0 : _a.includes(market.id)) ||
                    ((_b = options.names) === null || _b === void 0 ? void 0 : _b.includes(market.name)) ||
                    false;
            });
            return markets;
        });
    }
    getAllMarkets(_options) {
        return __awaiter(this, void 0, void 0, function* () {
            const allMarkets = (0, kujira_types_1.IMap)().asMutable();
            let basicMarkets = yield this.kujiraGetBasicMarkets();
            basicMarkets = basicMarkets.filter((item) => {
                var _a, _b;
                return (((_a = config.markets.disallowed) === null || _a === void 0 ? void 0 : _a.length)
                    ? !config.markets.disallowed.includes(item.address) &&
                        !config.markets.disallowed.includes(`${item.denoms[0].symbol}/${item.denoms[1].symbol}`)
                    : true) &&
                    (((_b = config.markets.allowed) === null || _b === void 0 ? void 0 : _b.length)
                        ? config.markets.allowed.includes(item.address) ||
                            config.markets.allowed.includes(`${item.denoms[0].symbol}/${item.denoms[1].symbol}`)
                        : true);
            });
            const loadMarket = (market) => __awaiter(this, void 0, void 0, function* () {
                allMarkets.set(market.address, (0, kujira_convertors_1.convertKujiraMarketToMarket)(market));
            });
            yield (0, kujira_helpers_1.promiseAllInBatches)(loadMarket, basicMarkets.valueSeq().toArray());
            this.markets = allMarkets;
            return this.markets;
        });
    }
    getOrderBook(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const market = yield this.getMarket({
                id: options.marketId,
                name: options.marketName,
            });
            const orderBook = yield this.kujiraQueryClientWasmQueryContractSmart(market.connectorMarket.address, {
                book: {
                    offset: config.orderBook.offset,
                    limit: config.orderBook.limit,
                },
            });
            return (0, kujira_convertors_1.convertKujiraOrderBookToOrderBook)(market, orderBook);
        });
    }
    getOrderBooks(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!options.marketIds)
                if (!options.marketNames)
                    throw new kujira_types_1.MarketNotFoundError(`No market informed.`);
            const orderBooks = (0, kujira_types_1.IMap)().asMutable();
            if (options.marketIds) {
                const getOrderBook = (marketId) => __awaiter(this, void 0, void 0, function* () {
                    const orderBook = yield this.getOrderBook({ marketId });
                    orderBooks.set(marketId, orderBook);
                });
                yield (0, kujira_helpers_1.promiseAllInBatches)(getOrderBook, (0, kujira_helpers_1.getNotNullOrThrowError)(options.marketIds));
            }
            else {
                const getOrderBook = (marketName) => __awaiter(this, void 0, void 0, function* () {
                    const orderBook = yield this.getOrderBook({ marketName });
                    orderBooks.set(marketName, orderBook);
                });
                yield (0, kujira_helpers_1.promiseAllInBatches)(getOrderBook, (0, kujira_helpers_1.getNotNullOrThrowError)(options.marketNames));
            }
            return orderBooks;
        });
    }
    getAllOrderBooks(_options) {
        return __awaiter(this, void 0, void 0, function* () {
            const marketIds = (yield this.getAllMarkets({})).keySeq().toArray();
            return this.getOrderBooks({ marketIds });
        });
    }
    getTicker(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const market = yield this.getMarket(options.marketId ? { id: options.marketId } : { name: options.marketName });
            const orderBook = yield this.getOrderBook({ marketId: market.id });
            const bestBid = orderBook.bestBid;
            const bestAsk = orderBook.bestAsk;
            let simpleAveragePrice;
            if (bestBid && bestAsk) {
                simpleAveragePrice = (0, kujira_helpers_1.getNotNullOrThrowError)(bestBid.price)
                    .plus((0, kujira_helpers_1.getNotNullOrThrowError)(bestAsk.price))
                    .div((0, bignumber_js_1.BigNumber)(2));
            }
            else {
                simpleAveragePrice = (0, bignumber_js_1.BigNumber)('NaN');
            }
            const result = {
                price: simpleAveragePrice,
            };
            return (0, kujira_convertors_1.convertKujiraTickerToTicker)(result, market);
        });
    }
    getTickers(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!options.marketIds)
                if (!options.marketNames)
                    throw new kujira_types_1.MarketNotFoundError(`No market informed.`);
            const tickers = (0, kujira_types_1.IMap)().asMutable();
            if (options.marketIds) {
                const getTicker = (marketId) => __awaiter(this, void 0, void 0, function* () {
                    const ticker = yield this.getTicker({ marketId });
                    tickers.set(marketId, ticker);
                });
                yield (0, kujira_helpers_1.promiseAllInBatches)(getTicker, options.marketIds);
            }
            else {
                const getTicker = (marketName) => __awaiter(this, void 0, void 0, function* () {
                    const ticker = yield this.getTicker({ marketName });
                    tickers.set(marketName, ticker);
                });
                yield (0, kujira_helpers_1.promiseAllInBatches)(getTicker, (0, kujira_helpers_1.getNotNullOrThrowError)(options.marketNames));
            }
            return tickers;
        });
    }
    getAllTickers(_options) {
        return __awaiter(this, void 0, void 0, function* () {
            const marketIds = (yield this.getAllMarkets({})).keySeq().toArray();
            return yield this.getTickers({ marketIds });
        });
    }
    getBalance(options) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!options.tokenSymbol && options.tokenId) {
                if (options.tokenId.startsWith('ibc')) {
                    const tokenDenom = kujira_js_1.Denom.from(options.tokenId);
                    options.tokenId = (0, kujira_helpers_1.getNotNullOrThrowError)((_a = tokenDenom.trace) === null || _a === void 0 ? void 0 : _a.base_denom).replace(':', '/');
                }
            }
            const balances = yield this.getBalances({
                ownerAddress: options.ownerAddress,
                tokenIds: options.tokenId ? [options.tokenId] : undefined,
                tokenSymbols: options.tokenSymbol ? [options.tokenSymbol] : undefined,
            });
            if (options.tokenId) {
                if (balances.tokens.has(options.tokenId)) {
                    return (0, kujira_helpers_1.getNotNullOrThrowError)(balances.tokens.get(options.tokenId));
                }
                throw new Error(`Token "${options.tokenId}" not found.`);
            }
            else {
                if (((_b = (0, kujira_helpers_1.getNotNullOrThrowError)(balances.tokens.valueSeq().first()).token) === null || _b === void 0 ? void 0 : _b.symbol) == options.tokenSymbol) {
                    return (0, kujira_helpers_1.getNotNullOrThrowError)(balances.tokens.valueSeq().first());
                }
                throw new Error(`Token "${options.tokenSymbol}" not found.`);
            }
        });
    }
    getBalances(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const allBalances = yield this.getAllBalances({
                ownerAddress: options.ownerAddress,
            });
            const balances = {
                tokens: (0, kujira_types_1.IMap)().asMutable(),
                total: {
                    token: 'total',
                    free: (0, bignumber_js_1.BigNumber)(0),
                    lockedInOrders: (0, bignumber_js_1.BigNumber)(0),
                    unsettled: (0, bignumber_js_1.BigNumber)(0),
                },
            };
            const tokenIds = options.tokenIds ||
                (yield this.getTokenSymbolsToTokenIdsMap({
                    symbols: options.tokenSymbols,
                }))
                    .valueSeq()
                    .toArray();
            for (const [tokenId, balance] of allBalances.tokens) {
                if (tokenIds.includes(tokenId) ||
                    tokenIds.includes(kujira_js_1.Denom.from(tokenId).reference)) {
                    balances.tokens.set(tokenId, balance);
                    balances.total.free = balances.total.free.plus(balance.free);
                    balances.total.lockedInOrders = balances.total.lockedInOrders.plus(balance.lockedInOrders);
                    balances.total.unsettled = balances.total.unsettled.plus(balance.unsettled);
                }
            }
            return balances;
        });
    }
    getAllBalances(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const kujiraBalances = yield this.kujiraStargateClientGetAllBalances(options.ownerAddress);
            const orders = (0, kujira_types_1.IMap)();
            let tickers;
            try {
                const tokenIds = kujiraBalances.map((token) => token.denom);
                const uskToken = this.network.toLowerCase() == kujira_js_1.NETWORKS[kujira_js_1.MAINNET].toLowerCase()
                    ? (0, kujira_convertors_1.convertKujiraTokenToToken)(kujira_js_1.USK)
                    : (0, kujira_convertors_1.convertKujiraTokenToToken)(kujira_js_1.USK_TESTNET);
                const marketIds = (yield this.getAllMarkets({}))
                    .valueSeq()
                    .filter((market) => tokenIds.includes(market.baseToken.id) &&
                    market.quoteToken.id == uskToken.id)
                    .map((market) => market.id)
                    .toArray();
                tickers = yield this.getTickers({ marketIds });
            }
            catch (exception) {
                tickers = (0, kujira_types_1.IMap)().asMutable();
            }
            return (0, kujira_convertors_1.convertKujiraBalancesToBalances)(this.network, kujiraBalances, orders, tickers);
        });
    }
    getOrder(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.getOrders(Object.assign(Object.assign({}, options), { ids: [options.id], ownerAddresses: [options.ownerAddress] }))).first();
        });
    }
    getOrders(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const output = (0, kujira_types_1.IMap)().asMutable();
            const ownerAddresses = options.ownerAddresses
                ? (0, kujira_helpers_1.getNotNullOrThrowError)(options.ownerAddresses)
                : [(0, kujira_helpers_1.getNotNullOrThrowError)(options.ownerAddress)];
            for (const ownerAddress of ownerAddresses) {
                let orders;
                if (options.marketId || options.marketName) {
                    const market = yield this.getMarket({
                        id: options.marketId,
                        name: options.marketName,
                    });
                    const response = { orders: [] };
                    let partialResponse;
                    while ((!partialResponse ||
                        partialResponse.orders.length >=
                            kujira_config_1.KujiraConfig.config.orders.open.paginationLimit) &&
                        response.orders.length <= kujira_config_1.KujiraConfig.config.orders.open.limit) {
                        partialResponse = yield this.kujiraQueryClientWasmQueryContractSmart(market.connectorMarket.address, {
                            orders_by_user: {
                                address: ownerAddress,
                                limit: kujira_config_1.KujiraConfig.config.orders.open.limit,
                                start_after: partialResponse
                                    ? partialResponse.orders[partialResponse.orders.length - 1].idx.toString()
                                    : null,
                            },
                        });
                        response.orders = [...response.orders, ...partialResponse.orders];
                    }
                    const bundles = (0, kujira_types_1.IMap)().asMutable();
                    bundles.setIn(['common', 'response'], response);
                    bundles.setIn(['common', 'status'], options.status);
                    bundles.setIn(['common', 'market'], market);
                    bundles.setIn(['orders'], response.orders);
                    orders = (0, kujira_convertors_1.convertKujiraOrdersToMapOfOrders)({
                        type: kujira_types_1.ConvertOrderType.GET_ORDERS,
                        bundles,
                    });
                }
                else {
                    const marketIds = options.marketIds ||
                        (yield this.getAllMarkets({})).keySeq().toArray();
                    orders = (0, kujira_types_1.IMap)().asMutable();
                    const getOrders = (marketId) => __awaiter(this, void 0, void 0, function* () {
                        const marketOrders = (0, kujira_helpers_1.getNotNullOrThrowError)(yield this.getOrders(Object.assign(Object.assign({}, options), { marketId })));
                        orders.merge(marketOrders);
                    });
                    yield (0, kujira_helpers_1.promiseAllInBatches)(getOrders, marketIds);
                }
                orders = orders.filter((order) => {
                    if (options.status && order.status !== options.status) {
                        return false;
                    }
                    else if (options.statuses &&
                        !options.statuses.includes((0, kujira_helpers_1.getNotNullOrThrowError)(order.status))) {
                        return false;
                    }
                    else if (options.ids &&
                        !options.ids.includes((0, kujira_helpers_1.getNotNullOrThrowError)(order.id))) {
                        return false;
                    }
                    return true;
                });
                output.set(ownerAddress, orders);
            }
            if (ownerAddresses.length == 1) {
                return output.first();
            }
            return output;
        });
    }
    placeOrder(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.placeOrders({
                orders: [options],
                waitUntilIncludedInBlock: options.waitUntilIncludedInBlock,
            })).first();
        });
    }
    placeOrders(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const ownerAddress = options.ownerAddress ||
                (0, kujira_helpers_1.getNotNullOrThrowError)(options.orders[0].ownerAddress);
            const candidateMessages = [];
            const bundles = (0, kujira_types_1.IMap)().asMutable();
            let bundleIndex = 0;
            for (const candidate of options.orders) {
                bundles.setIn(['orders', bundleIndex, 'candidate'], candidate);
                const market = yield this.getMarket({
                    id: candidate.marketId,
                    name: candidate.marketName,
                });
                bundles.setIn(['orders', bundleIndex, 'market'], market);
                let denom;
                if (candidate.side == kujira_types_1.OrderSide.BUY) {
                    denom = market.connectorMarket.denoms[1];
                }
                else if (candidate.side == kujira_types_1.OrderSide.SELL) {
                    denom = market.connectorMarket.denoms[0];
                }
                else {
                    throw Error('Unrecognized order side.');
                }
                let innerMessage;
                if (candidate.type == kujira_types_1.OrderType.MARKET) {
                    innerMessage = {
                        swap: {},
                    };
                }
                else if (candidate.type == kujira_types_1.OrderType.LIMIT) {
                    innerMessage = {
                        submit_order: {
                            price: (0, bignumber_js_1.BigNumber)(candidate.price)
                                .decimalPlaces(market.connectorMarket.precision.decimal_places)
                                .toString(),
                        },
                    };
                }
                else {
                    throw new Error('Unrecognized order type.');
                }
                const message = kujira_js_1.msg.wasm.msgExecuteContract({
                    sender: ownerAddress,
                    contract: market.connectorMarket.address,
                    msg: Buffer.from(JSON.stringify(innerMessage)),
                    funds: (0, stargate_1.coins)((0, bignumber_js_1.BigNumber)(candidate.amount)
                        .multipliedBy((0, bignumber_js_1.BigNumber)(10).pow(denom.decimals))
                        .integerValue()
                        .toString(), denom.reference),
                });
                candidateMessages.push(message);
                bundleIndex++;
            }
            const messages = candidateMessages;
            const walletArtifacts = yield this.getWalletArtifacts({
                ownerAddress,
            });
            const response = yield this.kujiraSigningStargateClientSignAndBroadcast(walletArtifacts.signingStargateClient, ownerAddress, messages, config.orders.create.fee);
            bundles.setIn(['common', 'response'], response);
            bundles.setIn(['common', 'status'], kujira_types_1.OrderStatus.OPEN);
            bundles.setIn(['common', 'events'], (0, kujira_convertors_1.convertKujiraEventsToMapOfEvents)(response.events));
            const mapOfEvents = (0, kujira_convertors_1.convertKujiraRawLogEventsToMapOfEvents)(JSON.parse((0, kujira_helpers_1.getNotNullOrThrowError)(response.rawLog)));
            for (const [bundleIndex, events] of mapOfEvents.entries()) {
                for (const [key, value] of events.entries()) {
                    bundles.setIn(['orders', bundleIndex, 'events', key], value);
                }
            }
            return (0, kujira_convertors_1.convertKujiraOrdersToMapOfOrders)({
                type: kujira_types_1.ConvertOrderType.PLACE_ORDERS,
                bundles: bundles,
            });
        });
    }
    cancelOrder(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.cancelOrders({
                ids: [options.id],
                ownerAddresses: [options.ownerAddress],
                marketId: options.marketId,
                marketName: options.marketName,
            })).first();
        });
    }
    cancelOrders(options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const output = (0, kujira_types_1.IMap)().asMutable();
            if (options.ids) {
                let markets;
                if (options.marketName || options.marketId) {
                    options.marketIds = options.marketId ? [options.marketId] : undefined;
                    options.marketNames = options.marketName
                        ? [options.marketName]
                        : undefined;
                    markets = yield this.getMarkets({
                        ids: options.marketIds,
                        names: options.marketNames,
                    });
                }
                else {
                    markets = yield this.getMarkets({
                        ids: options.marketIds,
                        names: options.marketNames,
                    });
                }
                const ownerAddresses = options.ownerAddresses
                    ? (0, kujira_helpers_1.getNotNullOrThrowError)(options.ownerAddresses)
                    : [(0, kujira_helpers_1.getNotNullOrThrowError)(options.ownerAddress)];
                const ordersByMarketIds = (0, kujira_types_1.IMap)().asMutable();
                const ordersByOwnerByMarketIds = (0, kujira_types_1.IMap)().asMutable();
                for (const ownerAddress of ownerAddresses) {
                    for (const id of options.ids) {
                        const request = {
                            id: id,
                            ownerAddress: ownerAddress,
                            marketIds: markets.keySeq().toArray(),
                            statuses: [
                                kujira_types_1.OrderStatus.OPEN,
                                kujira_types_1.OrderStatus.CANCELLATION_PENDING,
                                kujira_types_1.OrderStatus.CREATION_PENDING,
                                kujira_types_1.OrderStatus.PARTIALLY_FILLED,
                                kujira_types_1.OrderStatus.UNKNOWN,
                            ],
                        };
                        const targetOrder = yield this.getOrder(request);
                        if (targetOrder == undefined) {
                            throw new kujira_types_1.OrderNotFoundError(`Order "${id}" not found on markets "${markets
                                .keySeq()
                                .toArray()
                                .join(', ')}".`);
                        }
                        else {
                            if (targetOrder.ownerAddress === ownerAddress) {
                                if (!ordersByMarketIds.get(targetOrder.marketId)) {
                                    ordersByMarketIds.set(targetOrder.marketId, [targetOrder]);
                                }
                                else {
                                    const aux = (0, kujira_helpers_1.getNotNullOrThrowError)(ordersByMarketIds.get(targetOrder.marketId));
                                    aux.push(targetOrder);
                                    ordersByMarketIds.set(targetOrder.marketId, aux);
                                }
                                ordersByOwnerByMarketIds.set(ownerAddress, ordersByMarketIds);
                            }
                        }
                    }
                }
                for (const market of markets.valueSeq()) {
                    for (const ownerAddress of ownerAddresses) {
                        const filteredOrdersByOwner = (0, kujira_types_1.IMap)(ordersByOwnerByMarketIds.get(ownerAddress));
                        const selectedOrdersIds = [];
                        for (const orders of filteredOrdersByOwner.valueSeq()) {
                            for (const order of orders) {
                                if (order.ownerAddress === ownerAddress) {
                                    if (order.marketId === market.id) {
                                        selectedOrdersIds.push(order.id);
                                    }
                                }
                            }
                        }
                        if (selectedOrdersIds.length == 0) {
                            continue;
                        }
                        const denom = market.connectorMarket.denoms[0];
                        const message = kujira_js_1.msg.wasm.msgExecuteContract({
                            sender: ownerAddress,
                            contract: market.id,
                            msg: Buffer.from(JSON.stringify({
                                retract_orders: {
                                    order_idxs: selectedOrdersIds,
                                },
                            })),
                            funds: (0, stargate_1.coins)(1, denom.reference),
                        });
                        const messages = [message];
                        const walletArtifacts = yield this.getWalletArtifacts({
                            ownerAddress,
                        });
                        const response = yield this.kujiraSigningStargateClientSignAndBroadcast(walletArtifacts.signingStargateClient, ownerAddress, messages, config.orders.create.fee);
                        const bundles = (0, kujira_types_1.IMap)().asMutable();
                        bundles.setIn(['common', 'response'], response);
                        bundles.setIn(['common', 'status'], kujira_types_1.OrderStatus.CANCELLED);
                        bundles.setIn(['common', 'events'], (0, kujira_convertors_1.convertKujiraEventsToMapOfEvents)(response.events));
                        const mapOfEvents = (0, kujira_convertors_1.convertKujiraRawLogEventsToMapOfEvents)(JSON.parse((0, kujira_helpers_1.getNotNullOrThrowError)(response.rawLog)), selectedOrdersIds.length);
                        for (const [bundleIndex, events] of mapOfEvents.entries()) {
                            for (const [key, value] of events.entries()) {
                                bundles.setIn(['orders', bundleIndex, 'id'], selectedOrdersIds[Number(bundleIndex)]);
                                bundles.setIn(['orders', bundleIndex, 'market'], market);
                                bundles.setIn(['orders', bundleIndex, 'events', key], value);
                            }
                        }
                        if (output.get(ownerAddress)) {
                            (_a = output.get(ownerAddress)) === null || _a === void 0 ? void 0 : _a.merge((0, kujira_convertors_1.convertKujiraOrdersToMapOfOrders)({
                                type: kujira_types_1.ConvertOrderType.CANCELLED_ORDERS,
                                bundles,
                            }));
                        }
                        else {
                            output.set(ownerAddress, (0, kujira_convertors_1.convertKujiraOrdersToMapOfOrders)({
                                type: kujira_types_1.ConvertOrderType.CANCELLED_ORDERS,
                                bundles,
                            }));
                        }
                    }
                }
                if (ownerAddresses.length == 1) {
                    return output.first();
                }
            }
            return output;
        });
    }
    cancelAllOrders(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const output = (0, kujira_types_1.IMap)().asMutable();
            const ownerAddresses = options.ownerAddresses
                ? (0, kujira_helpers_1.getNotNullOrThrowError)(options.ownerAddresses)
                : [(0, kujira_helpers_1.getNotNullOrThrowError)(options.ownerAddress)];
            let marketIds = [];
            if (options === null || options === void 0 ? void 0 : options.marketId) {
                marketIds.push(options === null || options === void 0 ? void 0 : options.marketId);
            }
            if (options === null || options === void 0 ? void 0 : options.marketIds) {
                marketIds = [...marketIds, ...options === null || options === void 0 ? void 0 : options.marketIds];
            }
            if (options === null || options === void 0 ? void 0 : options.marketName) {
                marketIds.push((yield this.getMarket({ name: options === null || options === void 0 ? void 0 : options.marketName })).id);
            }
            if (options === null || options === void 0 ? void 0 : options.marketNames) {
                marketIds = [
                    ...marketIds,
                    ...(yield this.getMarkets({ names: options === null || options === void 0 ? void 0 : options.marketNames }))
                        .keySeq()
                        .toArray(),
                ];
            }
            if (marketIds && !marketIds.length) {
                marketIds = (yield this.getAllMarkets({})).keySeq().toArray();
            }
            const openOrders = (0, kujira_types_1.IMap)().asMutable();
            for (const ownerAddress of ownerAddresses) {
                for (const marketId of marketIds) {
                    const partialOpenOrdersIds = (yield this.getOrders({
                        ownerAddress: ownerAddress,
                        marketId: marketId,
                        status: kujira_types_1.OrderStatus.OPEN,
                    }))
                        .keySeq()
                        .toArray();
                    openOrders.setIn([ownerAddress, marketId], partialOpenOrdersIds);
                }
            }
            if (openOrders.size > 0) {
                for (const ownerAddress of ownerAddresses) {
                    const cancelledOrders = (0, kujira_types_1.IMap)().asMutable();
                    for (const marketId of marketIds) {
                        const partialCancelledOrders = (yield this.cancelOrders({
                            ids: (0, kujira_helpers_1.getNotNullOrThrowError)(openOrders.getIn([ownerAddress, marketId])),
                            marketId: marketId,
                            ownerAddress: ownerAddress,
                        }));
                        cancelledOrders.merge(partialCancelledOrders);
                    }
                    output.set(ownerAddress, cancelledOrders);
                }
                if (ownerAddresses.length == 1) {
                    return output.first();
                }
            }
            return output;
        });
    }
    transferFromTo(_options) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Not implemented.');
        });
    }
    withdrawFromMarket(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const market = yield this.getMarket({ id: options.marketId });
            const output = (0, kujira_types_1.IMap)().asMutable();
            const ownerAddresses = options.ownerAddresses
                ? (0, kujira_helpers_1.getNotNullOrThrowError)(options.ownerAddresses)
                : [(0, kujira_helpers_1.getNotNullOrThrowError)(options.ownerAddress)];
            for (const ownerAddress of ownerAddresses) {
                const walletArtifacts = yield this.getWalletArtifacts({
                    ownerAddress,
                });
                const finClient = new kujira_js_1.fin.FinClient(walletArtifacts.signingCosmWasmClient, ownerAddress, market.id);
                walletArtifacts.finClients.set(ownerAddress, finClient);
                const filledOrdersIds = (0, kujira_helpers_1.getNotNullOrThrowError)((yield this.getOrders({
                    ownerAddresses: [ownerAddress],
                    status: kujira_types_1.OrderStatus.FILLED,
                })))
                    .valueSeq()
                    .map((order) => (0, kujira_helpers_1.getNotNullOrThrowError)(order.id))
                    .toArray();
                const result = yield this.kujiraFinClientWithdrawOrders(finClient, {
                    orderIdxs: filledOrdersIds,
                });
                output.set(ownerAddress, (0, kujira_convertors_1.convertKujiraSettlementToSettlement)(result));
            }
            if (ownerAddresses.length == 1) {
                return output.first();
            }
            return output;
        });
    }
    withdrawFromMarkets(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!options.marketIds)
                throw new kujira_types_1.MarketNotFoundError(`No market informed.`);
            const output = (0, kujira_types_1.IMap)().asMutable();
            const ownerAddresses = options.ownerAddresses
                ? (0, kujira_helpers_1.getNotNullOrThrowError)(options.ownerAddresses)
                : [(0, kujira_helpers_1.getNotNullOrThrowError)(options.ownerAddress)];
            for (const ownerAddress of ownerAddresses) {
                const settleMarketFunds = (options) => __awaiter(this, void 0, void 0, function* () {
                    const results = (yield this.withdrawFromMarket({
                        marketId: options.marketId,
                        ownerAddresses: ownerAddresses,
                    }));
                    output.setIn([ownerAddress, options.marketId], results);
                });
                for (const marketId of options.marketIds) {
                    yield settleMarketFunds({
                        marketId: marketId,
                        ownerAddresses: [ownerAddress],
                    });
                }
            }
            if (ownerAddresses.length == 1) {
                return output.first();
            }
            return output;
        });
    }
    withdrawFromAllMarkets(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const marketIds = (yield this.getAllMarkets({})).keySeq().toArray();
            const ownerAddresses = options.ownerAddresses
                ? (0, kujira_helpers_1.getNotNullOrThrowError)(options.ownerAddresses)
                : [(0, kujira_helpers_1.getNotNullOrThrowError)(options.ownerAddress)];
            return yield this.withdrawFromMarkets({
                marketIds,
                ownerAddresses,
            });
        });
    }
    getCurrentBlock(_options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.kujiraStargateClientGetHeight();
        });
    }
    getTransaction(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, kujira_convertors_1.convertKujiraTransactionToTransaction)((0, kujira_helpers_1.getNotNullOrThrowError)(yield this.kujiraStargateClientGetTx(options.hash)));
        });
    }
    getTransactions(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const transactions = (0, kujira_types_1.IMap)().asMutable();
            const getTransaction = (options) => __awaiter(this, void 0, void 0, function* () {
                const transaction = yield this.getTransaction(options);
                transactions.set(transaction.hash, transaction);
            });
            yield (0, kujira_helpers_1.promiseAllInBatches)(getTransaction, options.hashes.map((hash) => {
                return { hash };
            }));
            return transactions;
        });
    }
    getEstimatedFees(_options) {
        return {
            token: config.nativeToken,
            price: config.gasPrice,
            limit: config.gasLimitEstimate,
            cost: config.gasPrice.multipliedBy(config.gasLimitEstimate),
        };
    }
    getWalletPublicKey(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield (yield this.getDirectSecp256k1HdWallet(options.mnemonic, kujira_config_1.KujiraConfig.config.prefix, options.accountNumber || kujira_config_1.KujiraConfig.config.accountNumber)).getAccounts())[0].address;
        });
    }
    encryptWallet(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const passphrase = config_manager_cert_passphrase_1.ConfigManagerCertPassphrase.readPassphrase();
            if (!passphrase) {
                throw new Error('missing passphrase');
            }
            const keyAlgorithm = 'pbkdf2';
            const cipherAlgorithm = 'aes-256-cbc';
            const ivSize = 16;
            const saltSize = 16;
            const iterations = 500000;
            const keyLength = 32;
            const digest = 'sha256';
            const iv = crypto.randomBytes(ivSize);
            const salt = crypto.randomBytes(saltSize);
            const keyMaterial = yield pbkdf2(passphrase, salt, iterations, keyLength, digest);
            const cipher = crypto.createCipheriv(cipherAlgorithm, keyMaterial, iv);
            const cipherText = Buffer.concat([
                cipher.update(JSON.stringify(options.wallet), 'utf8'),
                cipher.final(),
            ]);
            const encryptedString = JSON.stringify({
                keyAlgorithm: {
                    name: keyAlgorithm,
                    salt: salt.toString('base64'),
                    iterations: iterations,
                    keyLength: keyLength,
                    digest: digest,
                },
                cipherAlgorithm: {
                    name: cipherAlgorithm,
                    iv: iv.toString('base64'),
                },
                ciphertext: cipherText.toString('base64'),
            });
            return encryptedString;
        });
    }
    decryptWallet(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = `${base_1.walletPath}/${this.chain}`;
            const encryptedPrivateKey = JSON.parse(yield fs_extra_1.default.readFile(`${path}/${options.accountAddress}.json`, 'utf8'), (key, value) => {
                switch (key) {
                    case 'ciphertext':
                    case 'salt':
                    case 'iv':
                        return Buffer.from(value, 'base64');
                    default:
                        return value;
                }
            });
            const passphrase = config_manager_cert_passphrase_1.ConfigManagerCertPassphrase.readPassphrase();
            if (!passphrase) {
                throw new Error('missing passphrase');
            }
            const keyMaterial = yield pbkdf2(passphrase, encryptedPrivateKey.keyAlgorithm.salt, encryptedPrivateKey.keyAlgorithm.iterations, encryptedPrivateKey.keyAlgorithm.keyLength, encryptedPrivateKey.keyAlgorithm.digest);
            const decipher = crypto.createDecipheriv(encryptedPrivateKey.cipherAlgorithm.name, keyMaterial, encryptedPrivateKey.cipherAlgorithm.iv);
            const decryptedString = decipher.update(encryptedPrivateKey.ciphertext, 'utf8') +
                decipher.final('utf8');
            return JSON.parse(decryptedString);
        });
    }
    toClient(endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield tendermint_rpc_1.Tendermint37Client.create(new tendermint_rpc_1.HttpBatchClient(endpoint, {
                dispatchInterval: 100,
                batchSizeLimit: 200,
            }));
            return [client, endpoint];
        });
    }
    getFastestRpc() {
        return __awaiter(this, void 0, void 0, function* () {
            const latencies = [];
            yield Promise.all(kujira_js_1.RPCS[this.kujiraNetwork].map((endpoint) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const start = new Date().getTime();
                    const [client] = yield this.toClient(endpoint);
                    const status = yield client.status();
                    const latency = new Date().getTime() - start;
                    const latestBlockTime = new Date(status.syncInfo.latestBlockTime.toISOString());
                    latencies.push({ endpoint, latency, latestBlockTime });
                }
                catch (error) {
                    console.error(`Failed to connect to RPC endpoint ${endpoint}`);
                }
            })));
            if (latencies.length === 0) {
                throw new Error('Cannot connect with any RPC.');
            }
            latencies.sort((a, b) => a.latency - b.latency);
            return latencies[0].endpoint;
        });
    }
}
exports.KujiraModel = KujiraModel;
//# sourceMappingURL=kujira.model.js.map