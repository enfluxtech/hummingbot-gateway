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
exports.Tezos = void 0;
const tezos_base_1 = require("./tezos.base");
const tezos_config_1 = require("./tezos.config");
const logger_1 = require("../../services/logger");
const tezos_controllers_1 = require("./tezos.controllers");
class Tezos extends tezos_base_1.TezosBase {
    constructor(network) {
        super(network);
        const config = (0, tezos_config_1.getTezosConfig)('tezos', network);
        this._chain = network;
        this._nativeTokenSymbol = config.nativeCurrencySymbol;
        this._gasPrice = config.manualGasPrice;
        this._gasLimitTransaction = config.gasLimitTransaction;
        this._requestCount = 0;
        this._metricsLogInterval = 300000;
        this._metricTimer = setInterval(this.metricLogger.bind(this), this.metricsLogInterval);
        this.controller = tezos_controllers_1.TezosController;
    }
    static getInstance(network) {
        if (Tezos._instances === undefined) {
            Tezos._instances = {};
        }
        if (!(network in Tezos._instances)) {
            Tezos._instances[network] = new Tezos(network);
        }
        return Tezos._instances[network];
    }
    static getConnectedInstances() {
        return Tezos._instances;
    }
    requestCounter(msg) {
        if (msg.action === 'request')
            this._requestCount += 1;
    }
    metricLogger() {
        logger_1.logger.info(this.requestCount +
            ' request(s) sent in last ' +
            this.metricsLogInterval / 1000 +
            ' seconds.');
        this._requestCount = 0;
    }
    get gasPrice() {
        return this._gasPrice;
    }
    get gasLimitTransaction() {
        return this._gasLimitTransaction;
    }
    get chain() {
        return this._chain;
    }
    get nativeTokenSymbol() {
        return this._nativeTokenSymbol;
    }
    get requestCount() {
        return this._requestCount;
    }
    get metricsLogInterval() {
        return this._metricsLogInterval;
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            clearInterval(this._metricTimer);
        });
    }
}
exports.Tezos = Tezos;
//# sourceMappingURL=tezos.js.map