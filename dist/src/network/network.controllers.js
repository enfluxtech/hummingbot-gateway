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
exports.getStatus = void 0;
const avalanche_1 = require("../chains/avalanche/avalanche");
const binance_smart_chain_1 = require("../chains/binance-smart-chain/binance-smart-chain");
const ethereum_1 = require("../chains/ethereum/ethereum");
const harmony_1 = require("../chains/harmony/harmony");
const polygon_1 = require("../chains/polygon/polygon");
const xdc_1 = require("../chains/xdc/xdc");
const tezos_1 = require("../chains/tezos/tezos");
const kujira_1 = require("../chains/kujira/kujira");
const error_handler_1 = require("../services/error-handler");
const cronos_1 = require("../chains/cronos/cronos");
const near_1 = require("../chains/near/near");
const algorand_1 = require("../chains/algorand/algorand");
const connection_manager_1 = require("../services/connection-manager");
const xrpl_1 = require("../chains/xrpl/xrpl");
function getStatus(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const statuses = [];
        let connections = [];
        let chain;
        let chainId;
        let network;
        let rpcUrl;
        let currentBlockNumber;
        let nativeCurrency;
        if (req.chain) {
            try {
                connections.push(yield (0, connection_manager_1.getInitializedChain)(req.chain, req.network));
            }
            catch (e) {
                if (e instanceof connection_manager_1.UnsupportedChainException) {
                    throw new error_handler_1.HttpException(500, (0, error_handler_1.UNKNOWN_KNOWN_CHAIN_ERROR_MESSAGE)(req.chain), error_handler_1.UNKNOWN_CHAIN_ERROR_CODE);
                }
                throw e;
            }
        }
        else {
            const algorandConnections = algorand_1.Algorand.getConnectedInstances();
            connections = connections.concat(algorandConnections ? Object.values(algorandConnections) : []);
            const avalancheConnections = avalanche_1.Avalanche.getConnectedInstances();
            connections = connections.concat(avalancheConnections ? Object.values(avalancheConnections) : []);
            const harmonyConnections = harmony_1.Harmony.getConnectedInstances();
            connections = connections.concat(harmonyConnections ? Object.values(harmonyConnections) : []);
            const ethereumConnections = ethereum_1.Ethereum.getConnectedInstances();
            connections = connections.concat(ethereumConnections ? Object.values(ethereumConnections) : []);
            const polygonConnections = polygon_1.Polygon.getConnectedInstances();
            connections = connections.concat(polygonConnections ? Object.values(polygonConnections) : []);
            const xdcConnections = xdc_1.Xdc.getConnectedInstances();
            connections = connections.concat(xdcConnections ? Object.values(xdcConnections) : []);
            const cronosConnections = cronos_1.Cronos.getConnectedInstances();
            connections = connections.concat(cronosConnections ? Object.values(cronosConnections) : []);
            const nearConnections = near_1.Near.getConnectedInstances();
            connections = connections.concat(nearConnections ? Object.values(nearConnections) : []);
            const bscConnections = binance_smart_chain_1.BinanceSmartChain.getConnectedInstances();
            connections = connections.concat(bscConnections ? Object.values(bscConnections) : []);
            const tezosConnections = tezos_1.Tezos.getConnectedInstances();
            connections = connections.concat(tezosConnections ? Object.values(tezosConnections) : []);
            const xrplConnections = xrpl_1.XRPL.getConnectedInstances();
            connections = connections.concat(xrplConnections ? Object.values(xrplConnections) : []);
            const kujiraConnections = kujira_1.Kujira.getConnectedInstances();
            connections = connections.concat(kujiraConnections ? Object.values(kujiraConnections) : []);
        }
        for (const connection of connections) {
            chain = connection.chain;
            chainId = connection.chainId;
            network = connection.network;
            rpcUrl = connection.rpcUrl;
            nativeCurrency = connection.nativeTokenSymbol;
            try {
                currentBlockNumber = yield connection.getCurrentBlockNumber();
            }
            catch (_e) {
                if (yield connection.provider.getNetwork())
                    currentBlockNumber = 1;
            }
            statuses.push({
                chain,
                chainId,
                network,
                rpcUrl,
                currentBlockNumber,
                nativeCurrency,
            });
        }
        return req.chain ? statuses[0] : statuses;
    });
}
exports.getStatus = getStatus;
//# sourceMappingURL=network.controllers.js.map