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
exports.XRPLOrderStorage = void 0;
const local_storage_1 = require("../../services/local-storage");
const refcounting_closeable_1 = require("../../services/refcounting-closeable");
const xrpl_types_1 = require("../../connectors/xrpl/xrpl.types");
class XRPLOrderStorage extends refcounting_closeable_1.ReferenceCountingCloseable {
    constructor(dbPath) {
        super(dbPath);
        this.localStorage = local_storage_1.LocalStorage.getInstance(dbPath, this.handle);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.localStorage.init();
            }
            catch (error) {
                throw new Error('Failed to initialize local storage: ' + error);
            }
        });
    }
    storageStatus() {
        return this.localStorage.dbStatus;
    }
    saveOrder(chain, network, walletAddress, order) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.localStorage.save(chain + '/' + network + '/' + walletAddress + '/' + order.hash, JSON.stringify(order));
        });
    }
    deleteOrder(chain, network, walletAddress, order) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.localStorage.del(chain + '/' + network + '/' + walletAddress + '/' + order.hash);
        });
    }
    getOrders(chain, network, walletAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.localStorage.get((key, value) => {
                const splitKey = key.split('/');
                if (splitKey.length === 4 &&
                    splitKey[0] === chain &&
                    splitKey[1] === network &&
                    splitKey[2] === walletAddress) {
                    return [splitKey[3], JSON.parse(value)];
                }
                return;
            });
        });
    }
    getOrdersByState(chain, network, walletAddress, state) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.localStorage.get((key, value) => {
                const splitKey = key.split('/');
                if (splitKey.length === 4 &&
                    splitKey[0] === chain &&
                    splitKey[1] === network &&
                    splitKey[2] === walletAddress) {
                    const order = JSON.parse(value);
                    if (order.state === state) {
                        return [splitKey[3], order];
                    }
                }
                return;
            });
        });
    }
    getOrdersByMarket(chain, network, walletAddress, marketId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.localStorage.get((key, value) => {
                const splitKey = key.split('/');
                if (splitKey.length === 4 &&
                    splitKey[0] === chain &&
                    splitKey[1] === network &&
                    splitKey[2] === walletAddress) {
                    const order = JSON.parse(value);
                    if (order.marketId === marketId) {
                        return [splitKey[3], order];
                    }
                }
                return;
            });
        });
    }
    getOrdersByHash(chain, network, walletAddress, hash) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.localStorage.get((key, value) => {
                const splitKey = key.split('/');
                if (splitKey.length === 4 &&
                    splitKey[0] === chain &&
                    splitKey[1] === network &&
                    splitKey[2] === walletAddress &&
                    splitKey[3] === hash) {
                    const order = JSON.parse(value);
                    return [splitKey[3], order];
                }
                return;
            });
        });
    }
    getInflightOrders(chain, network, walletAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.localStorage.get((key, value) => {
                const splitKey = key.split('/');
                if (splitKey.length === 4 &&
                    splitKey[0] === chain &&
                    splitKey[1] === network &&
                    splitKey[2] === walletAddress) {
                    const order = JSON.parse(value);
                    if (order.state === xrpl_types_1.OrderStatus.OPEN ||
                        order.state === xrpl_types_1.OrderStatus.PENDING_OPEN ||
                        order.state === xrpl_types_1.OrderStatus.PENDING_CANCEL ||
                        order.state === xrpl_types_1.OrderStatus.PARTIALLY_FILLED) {
                        return [splitKey[3], order];
                    }
                }
                return;
            });
        });
    }
    close(handle) {
        const _super = Object.create(null, {
            close: { get: () => super.close }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.close.call(this, handle);
            if (this.refCount < 1) {
                yield this.localStorage.close(this.handle);
            }
        });
    }
}
exports.XRPLOrderStorage = XRPLOrderStorage;
//# sourceMappingURL=xrpl.order-storage.js.map