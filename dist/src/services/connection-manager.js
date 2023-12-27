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
exports.getConnector = exports.getChainInstance = exports.getInitializedChain = exports.UnsupportedChainException = void 0;
const avalanche_1 = require("../chains/avalanche/avalanche");
const cronos_1 = require("../chains/cronos/cronos");
const ethereum_1 = require("../chains/ethereum/ethereum");
const binance_smart_chain_1 = require("../chains/binance-smart-chain/binance-smart-chain");
const harmony_1 = require("../chains/harmony/harmony");
const polygon_1 = require("../chains/polygon/polygon");
const xdc_1 = require("../chains/xdc/xdc");
const tezos_1 = require("../chains/tezos/tezos");
const xrpl_1 = require("../chains/xrpl/xrpl");
const mad_meerkat_1 = require("../connectors/mad_meerkat/mad_meerkat");
const openocean_1 = require("../connectors/openocean/openocean");
const pangolin_1 = require("../connectors/pangolin/pangolin");
const perp_1 = require("../connectors/perp/perp");
const quickswap_1 = require("../connectors/quickswap/quickswap");
const pancakeswap_1 = require("../connectors/pancakeswap/pancakeswap");
const uniswap_1 = require("../connectors/uniswap/uniswap");
const uniswap_lp_1 = require("../connectors/uniswap/uniswap.lp");
const vvs_1 = require("../connectors/vvs/vvs");
const traderjoe_1 = require("../connectors/traderjoe/traderjoe");
const sushiswap_1 = require("../connectors/sushiswap/sushiswap");
const near_1 = require("../chains/near/near");
const ref_1 = require("../connectors/ref/ref");
const xsswap_1 = require("../connectors/xsswap/xsswap");
const dexalot_1 = require("../connectors/dexalot/dexalot");
const algorand_1 = require("../chains/algorand/algorand");
const cosmos_1 = require("../chains/cosmos/cosmos");
const tinyman_1 = require("../connectors/tinyman/tinyman");
const plenty_1 = require("../connectors/plenty/plenty");
const curve_1 = require("../connectors/curve/curve");
const kujira_1 = require("../chains/kujira/kujira");
const kujira_2 = require("../connectors/kujira/kujira");
const pancakeswap_lp_1 = require("../connectors/pancakeswap/pancakeswap.lp");
const xrpl_2 = require("../connectors/xrpl/xrpl");
class UnsupportedChainException extends Error {
    constructor(message) {
        message =
            message !== undefined
                ? message
                : 'Please provide a supported chain name.';
        super(message);
        this.name = 'UnsupportedChainError';
        this.stack = new Error().stack;
    }
}
exports.UnsupportedChainException = UnsupportedChainException;
function getInitializedChain(chain, network) {
    return __awaiter(this, void 0, void 0, function* () {
        const chainInstance = yield getChainInstance(chain, network);
        if (chainInstance === undefined) {
            throw new UnsupportedChainException(`unsupported chain ${chain}`);
        }
        if (!chainInstance.ready()) {
            yield chainInstance.init();
        }
        return chainInstance;
    });
}
exports.getInitializedChain = getInitializedChain;
function getChainInstance(chain, network) {
    return __awaiter(this, void 0, void 0, function* () {
        let connection;
        if (chain === 'algorand') {
            connection = algorand_1.Algorand.getInstance(network);
        }
        else if (chain === 'ethereum') {
            connection = ethereum_1.Ethereum.getInstance(network);
        }
        else if (chain === 'avalanche') {
            connection = avalanche_1.Avalanche.getInstance(network);
        }
        else if (chain === 'harmony') {
            connection = harmony_1.Harmony.getInstance(network);
        }
        else if (chain === 'polygon') {
            connection = polygon_1.Polygon.getInstance(network);
        }
        else if (chain === 'cronos') {
            connection = cronos_1.Cronos.getInstance(network);
        }
        else if (chain === 'cosmos') {
            connection = cosmos_1.Cosmos.getInstance(network);
        }
        else if (chain === 'near') {
            connection = near_1.Near.getInstance(network);
        }
        else if (chain === 'binance-smart-chain') {
            connection = binance_smart_chain_1.BinanceSmartChain.getInstance(network);
        }
        else if (chain === 'xdc') {
            connection = xdc_1.Xdc.getInstance(network);
        }
        else if (chain === 'tezos') {
            connection = tezos_1.Tezos.getInstance(network);
        }
        else if (chain === 'xrpl') {
            connection = xrpl_1.XRPL.getInstance(network);
        }
        else if (chain === 'kujira') {
            connection = kujira_1.Kujira.getInstance(network);
        }
        else {
            connection = undefined;
        }
        return connection;
    });
}
exports.getChainInstance = getChainInstance;
function getConnector(chain, network, connector, address) {
    return __awaiter(this, void 0, void 0, function* () {
        let connectorInstance;
        if ((chain === 'ethereum' || chain === 'polygon') &&
            connector === 'uniswap') {
            connectorInstance = uniswap_1.Uniswap.getInstance(chain, network);
        }
        else if (chain === 'polygon' && connector === 'quickswap') {
            connectorInstance = quickswap_1.Quickswap.getInstance(chain, network);
        }
        else if ((chain === 'ethereum' || chain === 'polygon') &&
            connector === 'uniswapLP') {
            connectorInstance = uniswap_lp_1.UniswapLP.getInstance(chain, network);
        }
        else if (chain === 'ethereum' && connector === 'perp') {
            connectorInstance = perp_1.Perp.getInstance(chain, network, address);
        }
        else if (chain === 'avalanche' && connector === 'pangolin') {
            connectorInstance = pangolin_1.Pangolin.getInstance(chain, network);
        }
        else if (connector === 'openocean') {
            connectorInstance = openocean_1.Openocean.getInstance(chain, network);
        }
        else if (chain === 'avalanche' && connector === 'traderjoe') {
            connectorInstance = traderjoe_1.Traderjoe.getInstance(chain, network);
        }
        else if (chain === 'cronos' && connector === 'mad_meerkat') {
            connectorInstance = mad_meerkat_1.MadMeerkat.getInstance(chain, network);
        }
        else if (chain === 'cronos' && connector === 'vvs') {
            connectorInstance = vvs_1.VVSConnector.getInstance(chain, network);
        }
        else if (chain === 'near' && connector === 'ref') {
            connectorInstance = ref_1.Ref.getInstance(chain, network);
        }
        else if (chain === 'binance-smart-chain' && connector === 'pancakeswap') {
            connectorInstance = pancakeswap_1.PancakeSwap.getInstance(chain, network);
        }
        else if (chain === 'binance-smart-chain' && connector === 'pancakeswapLP') {
            connectorInstance = pancakeswap_lp_1.PancakeswapLP.getInstance(chain, network);
        }
        else if (connector === 'sushiswap') {
            connectorInstance = sushiswap_1.Sushiswap.getInstance(chain, network);
        }
        else if (chain === 'xdc' && connector === 'xsswap') {
            connectorInstance = xsswap_1.Xsswap.getInstance(chain, network);
        }
        else if (chain === 'avalanche' && connector === 'dexalot') {
            connectorInstance = dexalot_1.DexalotCLOB.getInstance(network);
        }
        else if (chain == 'algorand' && connector == 'tinyman') {
            connectorInstance = tinyman_1.Tinyman.getInstance(network);
        }
        else if (chain === 'tezos' && connector === 'plenty') {
            connectorInstance = plenty_1.Plenty.getInstance(network);
        }
        else if (chain === 'xrpl' && connector === 'xrpl') {
            connectorInstance = xrpl_2.XRPLCLOB.getInstance(chain, network);
        }
        else if (chain === 'kujira' && connector === 'kujira') {
            connectorInstance = kujira_2.KujiraCLOB.getInstance(chain, network);
        }
        else if ((chain === 'ethereum' || chain === 'polygon') &&
            connector === 'curve') {
            connectorInstance = curve_1.Curve.getInstance(chain, network);
        }
        else {
            throw new Error('unsupported chain or connector');
        }
        if (!connectorInstance.ready()) {
            yield connectorInstance.init();
        }
        return connectorInstance;
    });
}
exports.getConnector = getConnector;
//# sourceMappingURL=connection-manager.js.map