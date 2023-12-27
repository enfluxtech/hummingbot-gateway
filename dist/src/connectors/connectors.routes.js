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
exports.ConnectorsRoutes = void 0;
const express_1 = require("express");
const error_handler_1 = require("../services/error-handler");
const mad_meerkat_config_1 = require("./mad_meerkat/mad_meerkat.config");
const openocean_config_1 = require("./openocean/openocean.config");
const pangolin_config_1 = require("./pangolin/pangolin.config");
const perp_config_1 = require("./perp/perp.config");
const quickswap_config_1 = require("./quickswap/quickswap.config");
const sushiswap_config_1 = require("./sushiswap/sushiswap.config");
const traderjoe_config_1 = require("./traderjoe/traderjoe.config");
const uniswap_config_1 = require("./uniswap/uniswap.config");
const vvs_config_1 = require("./vvs/vvs.config");
const ref_config_1 = require("./ref/ref.config");
const pancakeswap_config_1 = require("./pancakeswap/pancakeswap.config");
const xsswap_config_1 = require("./xsswap/xsswap.config");
const dexalot_clob_config_1 = require("./dexalot/dexalot.clob.config");
const tinyman_config_1 = require("./tinyman/tinyman.config");
const curveswap_config_1 = require("./curve/curveswap.config");
const plenty_config_1 = require("./plenty/plenty.config");
const xrpl_clob_config_1 = require("./xrpl/xrpl.clob.config");
const kujira_config_1 = require("./kujira/kujira.config");
var ConnectorsRoutes;
(function (ConnectorsRoutes) {
    ConnectorsRoutes.router = (0, express_1.Router)();
    ConnectorsRoutes.router.get('/', (0, error_handler_1.asyncHandler)((_req, res) => __awaiter(this, void 0, void 0, function* () {
        res.status(200).json({
            connectors: [
                {
                    name: 'uniswap',
                    trading_type: uniswap_config_1.UniswapConfig.config.tradingTypes('swap'),
                    chain_type: uniswap_config_1.UniswapConfig.config.chainType,
                    available_networks: uniswap_config_1.UniswapConfig.config.availableNetworks,
                },
                {
                    name: 'uniswapLP',
                    trading_type: uniswap_config_1.UniswapConfig.config.tradingTypes('LP'),
                    chain_type: uniswap_config_1.UniswapConfig.config.chainType,
                    available_networks: JSON.parse(JSON.stringify(uniswap_config_1.UniswapConfig.config.availableNetworks)),
                    additional_spenders: ['uniswap'],
                },
                {
                    name: 'pangolin',
                    trading_type: pangolin_config_1.PangolinConfig.config.tradingTypes,
                    chain_type: pangolin_config_1.PangolinConfig.config.chainType,
                    available_networks: pangolin_config_1.PangolinConfig.config.availableNetworks,
                },
                {
                    name: 'openocean',
                    trading_type: openocean_config_1.OpenoceanConfig.config.tradingTypes,
                    chain_type: openocean_config_1.OpenoceanConfig.config.chainType,
                    available_networks: openocean_config_1.OpenoceanConfig.config.availableNetworks,
                },
                {
                    name: 'quickswap',
                    trading_type: quickswap_config_1.QuickswapConfig.config.tradingTypes,
                    chain_type: quickswap_config_1.QuickswapConfig.config.chainType,
                    available_networks: quickswap_config_1.QuickswapConfig.config.availableNetworks,
                },
                {
                    name: 'perp',
                    trading_type: perp_config_1.PerpConfig.config.tradingTypes('perp'),
                    chain_type: perp_config_1.PerpConfig.config.chainType,
                    available_networks: perp_config_1.PerpConfig.config.availableNetworks,
                },
                {
                    name: 'sushiswap',
                    trading_type: sushiswap_config_1.SushiswapConfig.config.tradingTypes,
                    chain_type: sushiswap_config_1.SushiswapConfig.config.chainType,
                    available_networks: sushiswap_config_1.SushiswapConfig.config.availableNetworks,
                },
                {
                    name: 'traderjoe',
                    trading_type: traderjoe_config_1.TraderjoeConfig.config.tradingTypes,
                    chain_type: traderjoe_config_1.TraderjoeConfig.config.chainType,
                    available_networks: traderjoe_config_1.TraderjoeConfig.config.availableNetworks,
                },
                {
                    name: 'mad_meerkat',
                    trading_type: mad_meerkat_config_1.MadMeerkatConfig.config.tradingTypes,
                    chain_type: mad_meerkat_config_1.MadMeerkatConfig.config.chainType,
                    available_networks: mad_meerkat_config_1.MadMeerkatConfig.config.availableNetworks,
                },
                {
                    name: 'vvs',
                    trading_type: vvs_config_1.VVSConfig.config.tradingTypes,
                    chain_type: vvs_config_1.VVSConfig.config.chainType,
                    available_networks: vvs_config_1.VVSConfig.config.availableNetworks,
                },
                {
                    name: 'ref',
                    trading_type: ref_config_1.RefConfig.config.tradingTypes,
                    chain_type: ref_config_1.RefConfig.config.chainType,
                    available_networks: ref_config_1.RefConfig.config.availableNetworks,
                },
                {
                    name: 'pancakeswap',
                    trading_type: pancakeswap_config_1.PancakeSwapConfig.config.tradingTypes('swap'),
                    chain_type: pancakeswap_config_1.PancakeSwapConfig.config.chainType,
                    available_networks: pancakeswap_config_1.PancakeSwapConfig.config.availableNetworks,
                },
                {
                    name: 'pancakeswapLP',
                    trading_type: pancakeswap_config_1.PancakeSwapConfig.config.tradingTypes('LP'),
                    chain_type: pancakeswap_config_1.PancakeSwapConfig.config.chainType,
                    available_networks: pancakeswap_config_1.PancakeSwapConfig.config.availableNetworks,
                    additional_spenders: ['pancakeswap'],
                },
                {
                    name: 'xswap',
                    trading_type: xsswap_config_1.XsswapConfig.config.tradingTypes,
                    chain_type: xsswap_config_1.XsswapConfig.config.chainType,
                    available_networks: xsswap_config_1.XsswapConfig.config.availableNetworks,
                },
                {
                    name: 'dexalot',
                    trading_type: dexalot_clob_config_1.DexalotCLOBConfig.config.tradingTypes('spot'),
                    chain_type: dexalot_clob_config_1.DexalotCLOBConfig.config.chainType,
                    available_networks: dexalot_clob_config_1.DexalotCLOBConfig.config.availableNetworks,
                    additional_add_wallet_prompts: {
                        api_key: 'Enter a Dexalot API Key if you have one, otherwise hit return >>> ',
                    },
                },
                {
                    name: 'tinyman',
                    trading_type: tinyman_config_1.TinymanConfig.config.tradingTypes,
                    chain_type: tinyman_config_1.TinymanConfig.config.chainType,
                    available_networks: tinyman_config_1.TinymanConfig.config.availableNetworks,
                },
                {
                    name: 'curve',
                    trading_type: curveswap_config_1.CurveConfig.config.tradingTypes,
                    chain_type: curveswap_config_1.CurveConfig.config.chainType,
                    available_networks: curveswap_config_1.CurveConfig.config.availableNetworks,
                },
                {
                    name: 'plenty',
                    trading_type: plenty_config_1.PlentyConfig.config.tradingTypes,
                    chain_type: plenty_config_1.PlentyConfig.config.chainType,
                    available_networks: plenty_config_1.PlentyConfig.config.availableNetworks,
                },
                {
                    name: 'xrpl',
                    trading_type: xrpl_clob_config_1.XRPLCLOBConfig.config.tradingTypes,
                    chain_type: xrpl_clob_config_1.XRPLCLOBConfig.config.chainType,
                    available_networks: xrpl_clob_config_1.XRPLCLOBConfig.config.availableNetworks,
                },
                {
                    name: 'kujira',
                    trading_type: kujira_config_1.KujiraConfig.config.tradingTypes,
                    chain_type: kujira_config_1.KujiraConfig.config.chainType,
                    available_networks: kujira_config_1.KujiraConfig.config.availableNetworks,
                    additional_add_wallet_prompts: {
                        accountId: 'Enter your kujira account number (input 0 if unsure) >>> ',
                    },
                },
            ],
        });
    })));
})(ConnectorsRoutes || (exports.ConnectorsRoutes = ConnectorsRoutes = {}));
//# sourceMappingURL=connectors.routes.js.map