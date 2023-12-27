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
exports.Cosmos = void 0;
const cosmos_base_1 = require("./cosmos-base");
const cosmos_config_1 = require("./cosmos.config");
const logger_1 = require("../../services/logger");
const cosmos_controllers_1 = require("./cosmos.controllers");
class Cosmos extends cosmos_base_1.CosmosBase {
    constructor(network) {
        const config = (0, cosmos_config_1.getCosmosConfig)('cosmos');
        super('cosmos', config.network.rpcURL, config.network.tokenListSource, config.network.tokenListType, config.manualGasPrice);
        this._chain = network;
        this._nativeTokenSymbol = config.nativeCurrencySymbol;
        this._gasPrice = config.manualGasPrice;
        this._requestCount = 0;
        this._metricsLogInterval = 300000;
        this._metricTimer = setInterval(this.metricLogger.bind(this), this.metricsLogInterval);
        this.controller = cosmos_controllers_1.CosmosController;
    }
    static getInstance(network) {
        if (Cosmos._instances === undefined) {
            Cosmos._instances = {};
        }
        if (!(network in Cosmos._instances)) {
            Cosmos._instances[network] = new Cosmos(network);
        }
        return Cosmos._instances[network];
    }
    static getConnectedInstances() {
        return Cosmos._instances;
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
            if (this._chain in Cosmos._instances) {
                delete Cosmos._instances[this._chain];
            }
        });
    }
}
exports.Cosmos = Cosmos;
//# sourceMappingURL=cosmos.js.map