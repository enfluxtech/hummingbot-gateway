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
exports.EVMTxBroadcaster = void 0;
const ethers_1 = require("ethers");
const lru_cache_1 = __importDefault(require("lru-cache"));
const process_1 = require("process");
const logger_1 = require("../../services/logger");
class EVMTxBroadcaster {
    constructor(chain, wallet_address) {
        this._chain = chain;
        this._wallet_address = wallet_address;
        this._isBlocked = false;
        this._txQueue = [];
    }
    static getInstance(chain, wallet_address) {
        if (EVMTxBroadcaster._instances === undefined) {
            EVMTxBroadcaster._instances = new lru_cache_1.default({
                max: 50,
            });
        }
        const instanceKey = chain.chainName + chain.chainId + wallet_address;
        if (!EVMTxBroadcaster._instances.has(instanceKey)) {
            EVMTxBroadcaster._instances.set(instanceKey, new EVMTxBroadcaster(chain, wallet_address));
        }
        return EVMTxBroadcaster._instances.get(instanceKey);
    }
    isNextTx(tx) {
        return !this._isBlocked && tx === this._txQueue[0];
    }
    sleep(ms) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => setTimeout(resolve, ms));
        });
    }
    broadcast(transaction, nonce) {
        return __awaiter(this, void 0, void 0, function* () {
            let txResponse = {
                hash: '',
                confirmations: 0,
                from: '',
                wait: function (confirmations) {
                    throw new Error(confirmations + 'Function not implemented.');
                },
                nonce: 0,
                gasLimit: ethers_1.BigNumber.from('0'),
                data: '',
                value: ethers_1.BigNumber.from('0'),
                chainId: 0,
            };
            this._txQueue.push(transaction);
            try {
                while (!this.isNextTx(transaction)) {
                    yield this.sleep(10);
                }
                this._isBlocked = true;
                const currentNonce = yield this._chain.nonceManager.getNextNonce(this._wallet_address);
                txResponse = yield this.createAndSend(transaction, nonce ? nonce : currentNonce);
                yield this._chain.nonceManager.commitNonce(this._wallet_address, currentNonce);
            }
            catch (e) {
                if (e instanceof Error) {
                    if (e.message.includes('current nonce (')) {
                        const expectedSequence = Number(e.message.split('current nonce (')[1].split(')')[0]);
                        logger_1.logger.info(`Expected nonce: ${expectedSequence}`);
                        yield this._chain.nonceManager.overridePendingNonce(this._wallet_address, expectedSequence);
                        txResponse = yield this.createAndSend(transaction, expectedSequence);
                    }
                    else {
                        logger_1.logger.error(e.message);
                        throw e;
                    }
                }
            }
            finally {
                this._txQueue.shift();
                this._isBlocked = false;
            }
            if (process_1.env.DEBUG)
                logger_1.logger.error(yield this.getRevertReason(txResponse));
            return txResponse;
        });
    }
    createAndSend(tx, nonce) {
        return __awaiter(this, void 0, void 0, function* () {
            tx.nonce = nonce;
            if (this._wallet === undefined)
                this._wallet = yield this._chain.getWallet(this._wallet_address);
            return yield this._wallet.sendTransaction(tx);
        });
    }
    getRevertReason(err) {
        return __awaiter(this, void 0, void 0, function* () {
            let reason;
            try {
                yield err.wait();
            }
            catch (error) {
                if (!error.transaction) {
                    logger_1.logger.error('getRevertReason: error.transaction is undefined');
                }
                else {
                    const code = yield this._chain.provider.call(error.transaction, error.blockNumber || error.receipt.blockNumber);
                    reason = ethers_1.utils.toUtf8String('0x' + code.substring(138));
                    const i = reason.indexOf('0');
                    if (i > -1) {
                        return reason.substring(0, i);
                    }
                }
            }
            return reason;
        });
    }
}
exports.EVMTxBroadcaster = EVMTxBroadcaster;
//# sourceMappingURL=evm.broadcaster.js.map