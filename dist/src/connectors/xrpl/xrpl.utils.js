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
exports.convertHexToString = exports.getsSequenceNumberFromTxn = exports.getTakerPaysFundedAmount = exports.getTakerGetsFundedAmount = exports.getTakerPaysAmount = exports.getTakerGetsAmount = exports.OrderMutexManager = void 0;
const xrpl_1 = require("xrpl");
const xrpl_2 = require("../../chains/xrpl/xrpl");
class OrderMutexManager {
    constructor(ordersToManage) {
        this.locks = {};
        this.orders = {};
        this.orders = ordersToManage;
        Object.keys(this.orders).forEach((hash) => {
            this.locks[parseInt(hash)] = false;
        });
    }
    lock(hash) {
        this.locks[hash] = true;
    }
    release(hash) {
        this.locks[hash] = false;
    }
    reset() {
        Object.keys(this.orders).forEach((hash) => {
            this.locks[parseInt(hash)] = false;
        });
    }
    addOrders(orders) {
        Object.keys(orders).forEach((hash) => {
            this.orders[parseInt(hash)] = orders[parseInt(hash)];
            this.locks[parseInt(hash)] = false;
        });
    }
    removeOrders(orders) {
        Object.keys(orders).forEach((hash) => {
            delete this.orders[parseInt(hash)];
            delete this.locks[parseInt(hash)];
        });
    }
    updateOrders(orders) {
        this.orders = orders;
        this.reset();
    }
    isLocked(hash) {
        return this.locks[hash];
    }
}
exports.OrderMutexManager = OrderMutexManager;
function getTakerGetsAmount(offer) {
    if (typeof offer.TakerGets === 'string') {
        return (0, xrpl_1.dropsToXrp)(offer.TakerGets);
    }
    return offer.TakerGets.value;
}
exports.getTakerGetsAmount = getTakerGetsAmount;
function getTakerPaysAmount(offer) {
    if (typeof offer.TakerPays === 'string') {
        return (0, xrpl_1.dropsToXrp)(offer.TakerPays);
    }
    return offer.TakerPays.value;
}
exports.getTakerPaysAmount = getTakerPaysAmount;
function getTakerGetsFundedAmount(offer) {
    if (typeof offer.taker_gets_funded === 'string') {
        return (0, xrpl_1.dropsToXrp)(offer.taker_gets_funded);
    }
    if (!offer.taker_gets_funded) {
        return '0';
    }
    return offer.taker_gets_funded.value;
}
exports.getTakerGetsFundedAmount = getTakerGetsFundedAmount;
function getTakerPaysFundedAmount(offer) {
    if (typeof offer.taker_pays_funded === 'string') {
        return (0, xrpl_1.dropsToXrp)(offer.taker_pays_funded);
    }
    if (!offer.taker_pays_funded) {
        return '0';
    }
    return offer.taker_pays_funded.value;
}
exports.getTakerPaysFundedAmount = getTakerPaysFundedAmount;
function getsSequenceNumberFromTxn(network, TxnHash) {
    return __awaiter(this, void 0, void 0, function* () {
        const xrpl = xrpl_2.XRPL.getInstance(network);
        const txn = yield xrpl.getTransaction(TxnHash);
        if (txn) {
            return txn.result.Sequence;
        }
        return undefined;
    });
}
exports.getsSequenceNumberFromTxn = getsSequenceNumberFromTxn;
function convertHexToString(hex) {
    if (hex.length === 40) {
        const str = Buffer.from(hex, 'hex').toString();
        return str.replace(/\0/g, '');
    }
    return hex;
}
exports.convertHexToString = convertHexToString;
//# sourceMappingURL=xrpl.utils.js.map