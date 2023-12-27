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
exports.OrderTracker = void 0;
const xrpl_1 = require("xrpl");
const xrpl_2 = require("./xrpl");
const xrpl_3 = require("../../../src/connectors/xrpl/xrpl");
const xrpl_config_1 = require("./xrpl.config");
const xrpl_types_1 = require("../../connectors/xrpl/xrpl.types");
const xrpl_utils_1 = require("../../connectors/xrpl/xrpl.utils");
const xrpl_helpers_1 = require("./xrpl.helpers");
const metadata_1 = require("xrpl/dist/npm/models/transactions/metadata");
const lru_cache_1 = __importDefault(require("lru-cache"));
class OrderTracker {
    constructor(chain, network, wallet) {
        this.chain = chain;
        this.network = network;
        this._xrpl = xrpl_2.XRPL.getInstance(network);
        this._xrplClob = xrpl_3.XRPLCLOB.getInstance(chain, network);
        this._orderStorage = this._xrpl.orderStorage;
        this._wallet = wallet;
        this._inflightOrders = {};
        this._orderMutexManager = new xrpl_utils_1.OrderMutexManager(this._inflightOrders);
        this._isTracking = false;
        this._isProcessing = false;
        this._orderTrackingInterval = 1000;
        this.startTracking();
    }
    static getInstance(chain, network, wallet) {
        if (OrderTracker._instances === undefined) {
            const config = (0, xrpl_config_1.getXRPLConfig)(chain, network);
            OrderTracker._instances = new lru_cache_1.default({
                max: config.network.maxLRUCacheInstances,
            });
        }
        const instanceKey = chain + network + wallet.classicAddress;
        if (!OrderTracker._instances.has(instanceKey)) {
            OrderTracker._instances.set(instanceKey, new OrderTracker(chain, network, wallet));
        }
        return OrderTracker._instances.get(instanceKey);
    }
    get wallet() {
        return this._wallet;
    }
    get isTracking() {
        return this._isTracking;
    }
    addOrder(order) {
        return __awaiter(this, void 0, void 0, function* () {
            this._inflightOrders[order.hash] = order;
            while (this._isProcessing) {
                yield new Promise((resolve) => setTimeout(resolve, 100));
            }
            this._isProcessing = true;
            yield this.saveInflightOrdersToDB();
            this._isProcessing = false;
        });
    }
    getOrder(hash) {
        return this._inflightOrders[hash];
    }
    saveInflightOrdersToDB() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all(Object.keys(this._inflightOrders).map((hash) => __awaiter(this, void 0, void 0, function* () {
                yield this._orderStorage.saveOrder(this.chain, this.network, this._wallet.classicAddress, this._inflightOrders[parseInt(hash)]);
            })));
        });
    }
    loadInflightOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            const orders = yield this._orderStorage.getInflightOrders(this.chain, this.network, this._wallet.classicAddress);
            Object.keys(orders).forEach((hash) => {
                this._inflightOrders[parseInt(hash)] = orders[parseInt(hash)];
            });
            this._orderMutexManager.updateOrders(this._inflightOrders);
        });
    }
    startTracking() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._isTracking) {
                return;
            }
            this._isTracking = true;
            yield this._xrpl.ensureConnection();
            yield this.loadInflightOrders();
            const client = this._xrpl.client;
            client.on('transaction', (event) => __awaiter(this, void 0, void 0, function* () {
                while (this._isProcessing) {
                    yield new Promise((resolve) => setTimeout(resolve, 100));
                }
                this._isProcessing = true;
                const updatedOrders = yield this.processTransactionStream(this._inflightOrders, event, this._orderMutexManager);
                Object.keys(updatedOrders).forEach((hash) => {
                    this._inflightOrders[parseInt(hash)] = updatedOrders[parseInt(hash)];
                });
                this._orderMutexManager.updateOrders(this._inflightOrders);
                yield this.saveInflightOrdersToDB();
                this._isProcessing = false;
            }));
            yield client.request({
                command: 'subscribe',
                accounts: [this._wallet.classicAddress],
            });
            while (this._isTracking) {
                yield this._xrpl.ensureConnection();
                while (this._isProcessing) {
                    yield new Promise((resolve) => setTimeout(resolve, 100));
                }
                this._isProcessing = true;
                const updatedOrders = yield this.checkOpenOrders(this._inflightOrders, this._wallet.classicAddress, client, this._orderMutexManager);
                Object.keys(updatedOrders).forEach((hash) => {
                    this._inflightOrders[parseInt(hash)] = updatedOrders[parseInt(hash)];
                });
                this._orderMutexManager.updateOrders(this._inflightOrders);
                yield this.saveInflightOrdersToDB();
                this._isProcessing = false;
                yield new Promise((resolve) => setTimeout(resolve, this._orderTrackingInterval));
            }
        });
    }
    stopTracking() {
        return __awaiter(this, void 0, void 0, function* () {
            this._isTracking = false;
            const client = this._xrpl.client;
            client.removeAllListeners('transaction');
            if (client.isConnected()) {
                yield client.request({
                    command: 'unsubscribe',
                    accounts: [this._wallet.classicAddress],
                });
            }
        });
    }
    static stopTrackingOnAllInstances() {
        return __awaiter(this, void 0, void 0, function* () {
            const instances = OrderTracker._instances;
            if (instances === undefined) {
                return;
            }
            yield Promise.all(Array.from(instances.values()).map((instance) => __awaiter(this, void 0, void 0, function* () {
                yield instance.stopTracking();
            })));
        });
    }
    static stopTrackingOnAllInstancesForNetwork(network) {
        return __awaiter(this, void 0, void 0, function* () {
            const instances = OrderTracker._instances;
            if (instances === undefined) {
                return;
            }
            yield Promise.all(Array.from(instances.values()).map((instance) => __awaiter(this, void 0, void 0, function* () {
                if (instance.network === network) {
                    yield instance.stopTracking();
                }
            })));
        });
    }
    checkOpenOrders(openOrders, account, client, omm) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const ordersToCheck = openOrders;
            const hashes = Object.keys(ordersToCheck);
            let minLedgerIndex = yield this._xrpl.getCurrentLedgerIndex();
            for (const hash of hashes) {
                if (ordersToCheck[parseInt(hash)].updatedAtLedgerIndex < minLedgerIndex) {
                    minLedgerIndex = ordersToCheck[parseInt(hash)].updatedAtLedgerIndex;
                }
            }
            const txStack = yield this.getTransactionsStack(client, account, minLedgerIndex);
            if (txStack === null) {
                return ordersToCheck;
            }
            if (((_a = txStack.result) === null || _a === void 0 ? void 0 : _a.transactions) === undefined) {
                return ordersToCheck;
            }
            const transactionStack = txStack.result.transactions;
            transactionStack.reverse();
            for (const tx of transactionStack) {
                const transformedTx = this.transformAccountTransaction(tx);
                if (transformedTx === null) {
                    continue;
                }
                const updatedOrders = yield this.processTransactionStream(ordersToCheck, transformedTx, omm);
                Object.keys(updatedOrders).forEach((hash) => {
                    ordersToCheck[parseInt(hash)] = updatedOrders[parseInt(hash)];
                });
            }
            return ordersToCheck;
        });
    }
    processTransactionStream(inflightOrders, transaction, omm) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const transactionIntents = yield this.getTransactionIntentsFromStream(this.wallet.classicAddress, transaction);
            const ordersToCheck = inflightOrders;
            if (transactionIntents.length === 0) {
                return ordersToCheck;
            }
            for (const intent of transactionIntents) {
                if (intent.sequence === undefined) {
                    continue;
                }
                const matchOrder = ordersToCheck[intent.sequence];
                if (matchOrder === undefined) {
                    continue;
                }
                while (omm.isLocked(matchOrder.hash)) {
                    yield new Promise((resolve) => setTimeout(resolve, 300));
                }
                omm.lock(matchOrder.hash);
                matchOrder.updatedAt = transaction.transaction.date
                    ? (0, xrpl_1.rippleTimeToUnixTime)(transaction.transaction.date)
                    : 0;
                matchOrder.updatedAtLedgerIndex = (_a = transaction.ledger_index) !== null && _a !== void 0 ? _a : 0;
                const foundIndex = matchOrder.associatedTxns.findIndex((hash) => {
                    return hash === intent.tx.transaction.hash;
                });
                if (foundIndex === -1) {
                    matchOrder.associatedTxns.push((_b = intent.tx.transaction.hash) !== null && _b !== void 0 ? _b : 'UNKNOWN');
                }
                else {
                }
                let filledAmount = 0.0;
                let node;
                let fields;
                let foundTradeIndex = 0;
                let fillData;
                switch (intent.type) {
                    case xrpl_types_1.TransactionIntentType.OFFER_CREATE_FINALIZED:
                        if (matchOrder.state === xrpl_types_1.OrderStatus.PENDING_OPEN) {
                            matchOrder.state = xrpl_types_1.OrderStatus.OPEN;
                        }
                        break;
                    case xrpl_types_1.TransactionIntentType.OFFER_CANCEL_FINALIZED:
                        matchOrder.state = xrpl_types_1.OrderStatus.CANCELED;
                        break;
                    case xrpl_types_1.TransactionIntentType.OFFER_PARTIAL_FILL:
                        matchOrder.state = xrpl_types_1.OrderStatus.PARTIALLY_FILLED;
                        if (intent.node === undefined) {
                            break;
                        }
                        node = intent.node;
                        if ((0, metadata_1.isCreatedNode)(node)) {
                            fields = node.CreatedNode.NewFields;
                        }
                        else {
                            fields = node.ModifiedNode.FinalFields;
                        }
                        if (matchOrder.tradeType === 'SELL') {
                            if (typeof fields.TakerGets === 'string') {
                                filledAmount =
                                    parseFloat(matchOrder.amount) -
                                        parseFloat((0, xrpl_1.dropsToXrp)(fields.TakerGets));
                            }
                            else {
                                filledAmount =
                                    parseFloat(matchOrder.amount) -
                                        parseFloat(fields.TakerGets.value);
                            }
                        }
                        if (matchOrder.tradeType === 'BUY') {
                            if (typeof fields.TakerPays === 'string') {
                                filledAmount =
                                    parseFloat(matchOrder.amount) -
                                        parseFloat((0, xrpl_1.dropsToXrp)(fields.TakerPays));
                            }
                            else {
                                filledAmount =
                                    parseFloat(matchOrder.amount) -
                                        parseFloat(fields.TakerPays.value);
                            }
                        }
                        foundTradeIndex = matchOrder.associatedFills.findIndex((fill) => {
                            if (node === undefined) {
                                return (fill.tradeId ===
                                    `${intent.type}-${transaction.transaction.hash}`);
                            }
                            if ((0, metadata_1.isCreatedNode)(node)) {
                                return (fill.tradeId ===
                                    `${intent.type}-${node.CreatedNode.LedgerIndex}`);
                            }
                            if ((0, metadata_1.isModifiedNode)(node)) {
                                return (fill.tradeId ===
                                    `${intent.type}-${node.ModifiedNode.LedgerIndex}`);
                            }
                            return false;
                        });
                        if (foundTradeIndex === -1) {
                            fillData = this.buildFillData(intent, node, matchOrder, transaction);
                            matchOrder.associatedFills.push(fillData);
                        }
                        else {
                        }
                        matchOrder.filledAmount = filledAmount.toString();
                        break;
                    case xrpl_types_1.TransactionIntentType.OFFER_FILL:
                        matchOrder.state = xrpl_types_1.OrderStatus.FILLED;
                        matchOrder.filledAmount = matchOrder.amount;
                        node = intent.node;
                        foundTradeIndex = matchOrder.associatedFills.findIndex((fill) => {
                            if (node === undefined) {
                                return (fill.tradeId ===
                                    `${intent.type}-${transaction.transaction.hash}`);
                            }
                            if ((0, metadata_1.isCreatedNode)(node)) {
                                return (fill.tradeId ===
                                    `${intent.type}-${node.CreatedNode.LedgerIndex}`);
                            }
                            if ((0, metadata_1.isDeletedNode)(node)) {
                                return (fill.tradeId ===
                                    `${intent.type}-${node.DeletedNode.LedgerIndex}`);
                            }
                            return false;
                        });
                        if (foundTradeIndex === -1) {
                            fillData = this.buildFillData(intent, node, matchOrder, transaction);
                            matchOrder.associatedFills.push(fillData);
                        }
                        else {
                        }
                        break;
                    case xrpl_types_1.TransactionIntentType.OFFER_EXPIRED_OR_UNFUNDED:
                        matchOrder.state = xrpl_types_1.OrderStatus.OFFER_EXPIRED_OR_UNFUNDED;
                        break;
                    case xrpl_types_1.TransactionIntentType.UNKNOWN:
                        matchOrder.state = xrpl_types_1.OrderStatus.UNKNOWN;
                        break;
                }
                ordersToCheck[matchOrder.hash] = matchOrder;
                omm.release(matchOrder.hash);
            }
            return ordersToCheck;
        });
    }
    getTransactionIntentsFromStream(walletAddress, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const transactionType = transaction.transaction.TransactionType;
            const intents = [];
            if (transaction.transaction.Sequence === undefined) {
                return [
                    {
                        type: xrpl_types_1.TransactionIntentType.UNKNOWN,
                        sequence: 0,
                        tx: transaction,
                    },
                ];
            }
            if (transaction.meta === undefined) {
                return [
                    {
                        type: xrpl_types_1.TransactionIntentType.UNKNOWN,
                        sequence: transaction.transaction.Sequence,
                        tx: transaction,
                    },
                ];
            }
            if (transaction.transaction.Account !== walletAddress) {
                switch (transactionType) {
                    case 'OfferCreate':
                        for (const affnode of transaction.meta.AffectedNodes) {
                            if ((0, metadata_1.isModifiedNode)(affnode)) {
                                if (affnode.ModifiedNode.LedgerEntryType == 'Offer') {
                                    if (affnode.ModifiedNode.FinalFields === undefined) {
                                        intents.push({
                                            type: xrpl_types_1.TransactionIntentType.UNKNOWN,
                                            sequence: transaction.transaction.Sequence,
                                            tx: transaction,
                                            node: affnode,
                                        });
                                    }
                                    const finalFields = affnode.ModifiedNode.FinalFields;
                                    intents.push({
                                        type: xrpl_types_1.TransactionIntentType.OFFER_PARTIAL_FILL,
                                        sequence: finalFields.Sequence,
                                        tx: transaction,
                                        node: affnode,
                                    });
                                }
                            }
                            else if ((0, metadata_1.isDeletedNode)(affnode)) {
                                if (affnode.DeletedNode.LedgerEntryType == 'Offer') {
                                    if (affnode.DeletedNode.FinalFields === undefined) {
                                        intents.push({
                                            type: xrpl_types_1.TransactionIntentType.UNKNOWN,
                                            sequence: transaction.transaction.Sequence,
                                            tx: transaction,
                                            node: affnode,
                                        });
                                    }
                                    const finalFields = affnode.DeletedNode.FinalFields;
                                    intents.push({
                                        type: xrpl_types_1.TransactionIntentType.OFFER_FILL,
                                        sequence: finalFields.Sequence,
                                        tx: transaction,
                                        node: affnode,
                                    });
                                }
                            }
                        }
                        break;
                }
            }
            else {
                let consumedNodeCount = 0;
                let createNodeCount = 0;
                let deleteNodeCount = 0;
                switch (transactionType) {
                    case 'OfferCreate':
                        for (const affnode of transaction.meta.AffectedNodes) {
                            if ((0, metadata_1.isModifiedNode)(affnode)) {
                                if (affnode.ModifiedNode.LedgerEntryType == 'Offer') {
                                    if (affnode.ModifiedNode.FinalFields === undefined) {
                                        intents.push({
                                            type: xrpl_types_1.TransactionIntentType.UNKNOWN,
                                            sequence: transaction.transaction.Sequence,
                                            tx: transaction,
                                            node: affnode,
                                        });
                                    }
                                    const finalFields = affnode.ModifiedNode.FinalFields;
                                    intents.push({
                                        type: xrpl_types_1.TransactionIntentType.OFFER_PARTIAL_FILL,
                                        sequence: finalFields.Sequence,
                                        tx: transaction,
                                        node: affnode,
                                    });
                                    consumedNodeCount++;
                                }
                            }
                            else if ((0, metadata_1.isDeletedNode)(affnode)) {
                                if (affnode.DeletedNode.LedgerEntryType == 'Offer') {
                                    if (affnode.DeletedNode.FinalFields === undefined) {
                                        intents.push({
                                            type: xrpl_types_1.TransactionIntentType.UNKNOWN,
                                            sequence: transaction.transaction.Sequence,
                                            tx: transaction,
                                            node: affnode,
                                        });
                                    }
                                    else {
                                        const finalFields = affnode.DeletedNode.FinalFields;
                                        if (transaction.transaction.Account === walletAddress &&
                                            finalFields.Account === walletAddress) {
                                            const replacingOfferSequnce = transaction.transaction.OfferSequence;
                                            if (finalFields.Sequence !== replacingOfferSequnce) {
                                                intents.push({
                                                    type: xrpl_types_1.TransactionIntentType.OFFER_EXPIRED_OR_UNFUNDED,
                                                    sequence: finalFields.Sequence,
                                                    tx: transaction,
                                                    node: affnode,
                                                });
                                            }
                                            else {
                                                intents.push({
                                                    type: xrpl_types_1.TransactionIntentType.OFFER_CANCEL_FINALIZED,
                                                    sequence: finalFields.Sequence,
                                                    tx: transaction,
                                                    node: affnode,
                                                });
                                            }
                                        }
                                        else {
                                            intents.push({
                                                type: xrpl_types_1.TransactionIntentType.OFFER_FILL,
                                                sequence: finalFields.Sequence,
                                                tx: transaction,
                                                node: affnode,
                                            });
                                            consumedNodeCount++;
                                        }
                                    }
                                }
                            }
                            else if ((0, metadata_1.isCreatedNode)(affnode)) {
                                if (affnode.CreatedNode.LedgerEntryType == 'Offer') {
                                    if (affnode.CreatedNode.NewFields === undefined) {
                                        intents.push({
                                            type: xrpl_types_1.TransactionIntentType.UNKNOWN,
                                            sequence: transaction.transaction.Sequence,
                                            tx: transaction,
                                            node: affnode,
                                        });
                                    }
                                    else {
                                        const newFields = affnode.CreatedNode.NewFields;
                                        if (consumedNodeCount > 0) {
                                            intents.push({
                                                type: xrpl_types_1.TransactionIntentType.OFFER_PARTIAL_FILL,
                                                sequence: newFields.Sequence,
                                                tx: transaction,
                                                node: affnode,
                                            });
                                        }
                                        else {
                                            intents.push({
                                                type: xrpl_types_1.TransactionIntentType.OFFER_CREATE_FINALIZED,
                                                sequence: newFields.Sequence,
                                                tx: transaction,
                                                node: affnode,
                                            });
                                        }
                                        createNodeCount++;
                                    }
                                }
                            }
                        }
                        if (createNodeCount === 0) {
                            if (consumedNodeCount > 0) {
                                intents.push({
                                    type: xrpl_types_1.TransactionIntentType.OFFER_FILL,
                                    sequence: transaction.transaction.Sequence,
                                    tx: transaction,
                                });
                            }
                            else {
                                intents.push({
                                    type: xrpl_types_1.TransactionIntentType.UNKNOWN,
                                    sequence: transaction.transaction.Sequence,
                                    tx: transaction,
                                });
                            }
                        }
                        break;
                    case 'OfferCancel':
                        for (const affnode of transaction.meta.AffectedNodes) {
                            if ((0, metadata_1.isDeletedNode)(affnode)) {
                                if (affnode.DeletedNode.LedgerEntryType == 'Offer') {
                                    if (affnode.DeletedNode.FinalFields === undefined) {
                                        intents.push({
                                            type: xrpl_types_1.TransactionIntentType.UNKNOWN,
                                            sequence: transaction.transaction.OfferSequence,
                                            tx: transaction,
                                            node: affnode,
                                        });
                                    }
                                    else {
                                        const finalFields = affnode.DeletedNode.FinalFields;
                                        if (finalFields.Account === walletAddress) {
                                            intents.push({
                                                type: xrpl_types_1.TransactionIntentType.OFFER_CANCEL_FINALIZED,
                                                sequence: finalFields.Sequence,
                                                tx: transaction,
                                                node: affnode,
                                            });
                                            deleteNodeCount++;
                                        }
                                    }
                                }
                            }
                        }
                        if (deleteNodeCount === 0) {
                            intents.push({
                                type: xrpl_types_1.TransactionIntentType.OFFER_CANCEL_FINALIZED,
                                sequence: transaction.transaction.OfferSequence,
                                tx: transaction,
                            });
                        }
                        break;
                }
            }
            return intents;
        });
    }
    getTransaction(client, txHash) {
        return __awaiter(this, void 0, void 0, function* () {
            if (txHash === '') {
                return null;
            }
            const tx_resp = yield client.request({
                command: 'tx',
                transaction: txHash,
                binary: false,
            });
            const result = tx_resp;
            return result;
        });
    }
    getTransactionsStack(client, account, minLedgerIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            if (account === '') {
                return null;
            }
            const tx_resp = yield client.request({
                command: 'account_tx',
                account: account,
                ledger_index_min: minLedgerIndex,
                binary: false,
            });
            const result = tx_resp;
            return result;
        });
    }
    transformAccountTransaction(transaction) {
        var _a;
        if (typeof transaction.meta === 'string') {
            return null;
        }
        if (transaction.tx === undefined) {
            return null;
        }
        const transformedTx = {
            ledger_index: (_a = transaction.tx.ledger_index) !== null && _a !== void 0 ? _a : 0,
            meta: transaction.meta,
            transaction: transaction.tx,
            tx_blob: transaction.tx_blob,
            validated: transaction.validated,
        };
        return transformedTx;
    }
    buildFillData(intent, node, order, transaction) {
        let tradeId;
        const orderHash = order.hash;
        if (node === undefined) {
            const feeToken = order.tradeType === 'BUY'
                ? (0, xrpl_helpers_1.getQuoteTokenFromMarketId)(order.marketId)
                : (0, xrpl_helpers_1.getBaseTokenFromMarketId)(order.marketId);
            const fee = this.calculateFee(order.marketId, order.tradeType, order.amount);
            const timestamp = transaction.transaction.date
                ? (0, xrpl_1.rippleTimeToUnixTime)(transaction.transaction.date)
                : 0;
            return {
                tradeId: `${intent.type}-${transaction.transaction.hash}`,
                orderHash: order.hash,
                price: order.price,
                quantity: order.amount,
                feeToken: feeToken,
                side: order.tradeType,
                fee: fee,
                timestamp: timestamp,
                type: 'Taker',
            };
        }
        if ((0, metadata_1.isModifiedNode)(node)) {
            tradeId = `${intent.type}-${node.ModifiedNode.LedgerIndex}`;
        }
        else if ((0, metadata_1.isDeletedNode)(node)) {
            tradeId = `${intent.type}-${node.DeletedNode.LedgerIndex}`;
        }
        else {
            tradeId = `${intent.type}-${node.CreatedNode.LedgerIndex}`;
        }
        const price = order.price;
        const quantity = this.getFilledAmountFromNode(order, node, order.tradeType).toString();
        const feeToken = order.tradeType === 'BUY'
            ? (0, xrpl_helpers_1.getQuoteTokenFromMarketId)(order.marketId)
            : (0, xrpl_helpers_1.getBaseTokenFromMarketId)(order.marketId);
        const side = order.tradeType;
        const fee = this.calculateFee(order.marketId, order.tradeType, quantity);
        const timestamp = transaction.transaction.date
            ? (0, xrpl_1.rippleTimeToUnixTime)(transaction.transaction.date)
            : 0;
        const type = 'Maker';
        return {
            tradeId,
            orderHash,
            price,
            quantity,
            feeToken,
            side,
            fee,
            timestamp,
            type,
        };
    }
    calculateFee(marketId, tradeType, quantity) {
        let fee = '0';
        const market = this._xrplClob.parsedMarkets[marketId];
        if (market === undefined) {
            return '0';
        }
        if (tradeType === 'BUY') {
            fee = (parseFloat(quantity) * market.quoteTransferRate).toString();
        }
        else {
            fee = (parseFloat(quantity) * market.baseTransferRate).toString();
        }
        return fee;
    }
    getFilledAmountFromNode(order, node, tradeType) {
        let filledAmount = 0;
        let ledgerEntryType = '';
        let previousFields, finalFields;
        try {
            if ((0, metadata_1.isModifiedNode)(node)) {
                ledgerEntryType = node.ModifiedNode.LedgerEntryType;
                previousFields = node.ModifiedNode.PreviousFields;
                finalFields = node.ModifiedNode.FinalFields;
            }
            else if ((0, metadata_1.isDeletedNode)(node)) {
                ledgerEntryType = node.DeletedNode.LedgerEntryType;
                previousFields = node.DeletedNode.PreviousFields;
                finalFields = node.DeletedNode.FinalFields;
            }
            else {
                ledgerEntryType = node.CreatedNode.LedgerEntryType;
                previousFields = undefined;
                finalFields = node.CreatedNode.NewFields;
            }
        }
        catch (error) {
            throw new Error('Error parsing node: ' + error);
        }
        if (ledgerEntryType === 'Offer' && (0, metadata_1.isCreatedNode)(node)) {
            if (finalFields === undefined)
                throw new Error('Final fields undefined');
            if (tradeType === 'SELL') {
                if (typeof finalFields.TakerGets === 'string') {
                    filledAmount =
                        parseFloat(order.amount) -
                            parseFloat((0, xrpl_1.dropsToXrp)(finalFields.TakerGets));
                }
                else {
                    filledAmount =
                        parseFloat(order.amount) -
                            parseFloat(finalFields.TakerGets.value);
                }
            }
            if (tradeType === 'BUY') {
                if (typeof finalFields.TakerPays === 'string') {
                    filledAmount =
                        parseFloat(order.amount) -
                            parseFloat((0, xrpl_1.dropsToXrp)(finalFields.TakerPays));
                }
                else {
                    filledAmount =
                        parseFloat(order.amount) -
                            parseFloat(finalFields.TakerPays.value);
                }
            }
        }
        else if (ledgerEntryType === 'Offer') {
            if (previousFields === undefined)
                throw new Error('Previous fields undefined');
            if (finalFields === undefined)
                throw new Error('Final fields undefined');
            if (tradeType === 'SELL') {
                if (typeof finalFields.TakerGets === 'string') {
                    filledAmount =
                        parseFloat((0, xrpl_1.dropsToXrp)(previousFields.TakerGets)) -
                            parseFloat((0, xrpl_1.dropsToXrp)(finalFields.TakerGets));
                }
                else {
                    filledAmount =
                        parseFloat(previousFields.TakerGets.value) -
                            parseFloat(finalFields.TakerGets.value);
                }
            }
            if (tradeType === 'BUY') {
                if (typeof finalFields.TakerPays === 'string') {
                    filledAmount =
                        parseFloat((0, xrpl_1.dropsToXrp)(previousFields.TakerPays)) -
                            parseFloat((0, xrpl_1.dropsToXrp)(finalFields.TakerPays));
                }
                else {
                    filledAmount =
                        parseFloat(previousFields.TakerPays.value) -
                            parseFloat(finalFields.TakerPays.value);
                }
            }
        }
        else {
            throw new Error('Invalid ledgerEntryType type');
        }
        return filledAmount;
    }
}
exports.OrderTracker = OrderTracker;
//# sourceMappingURL=xrpl.order-tracker.js.map