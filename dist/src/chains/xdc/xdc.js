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
exports.Xdc = void 0;
const ethereum_abi_json_1 = __importDefault(require("../ethereum/ethereum.abi.json"));
const logger_1 = require("../../services/logger");
const ethers_xdc_1 = require("ethers-xdc");
const xdc_base_1 = require("./xdc.base");
const ethereum_config_1 = require("../ethereum/ethereum.config");
const config_manager_v2_1 = require("../../services/config-manager-v2");
const base_1 = require("../../services/base");
const wallet_controllers_1 = require("../../services/wallet/wallet.controllers");
const fs_extra_1 = __importDefault(require("fs-extra"));
const config_manager_cert_passphrase_1 = require("../../services/config-manager-cert-passphrase");
const xsswap_config_1 = require("../../connectors/xsswap/xsswap.config");
class Xdc extends xdc_base_1.XdcBase {
    constructor(network) {
        const config = (0, ethereum_config_1.getEthereumConfig)('xdc', network);
        super('xdc', config.network.chainID, config.network.nodeURL, config.network.tokenListSource, config.network.tokenListType, config.manualGasPrice, config.gasLimitTransaction, config_manager_v2_1.ConfigManagerV2.getInstance().get('server.nonceDbPath'), config_manager_v2_1.ConfigManagerV2.getInstance().get('server.transactionDbPath'));
        this._chain = config.network.name;
        this._nativeTokenSymbol = config.nativeCurrencySymbol;
        this._gasPrice = config.manualGasPrice;
    }
    static getInstance(network) {
        if (Xdc._instances === undefined) {
            Xdc._instances = {};
        }
        if (!(network in Xdc._instances)) {
            Xdc._instances[network] = new Xdc(network);
        }
        return Xdc._instances[network];
    }
    static getConnectedInstances() {
        return Xdc._instances;
    }
    get gasPrice() {
        return this._gasPrice;
    }
    get nativeTokenSymbol() {
        return this._nativeTokenSymbol;
    }
    get chain() {
        return this._chain;
    }
    getContract(tokenAddress, signerOrProvider) {
        return new ethers_xdc_1.Contract(tokenAddress, ethereum_abi_json_1.default.ERC20Abi, signerOrProvider);
    }
    getSpender(reqSpender) {
        let spender;
        if (reqSpender === 'xsswap') {
            spender = xsswap_config_1.XsswapConfig.config.routerAddress(this._chain);
        }
        else {
            spender = (0, wallet_controllers_1.convertXdcAddressToEthAddress)(reqSpender);
        }
        return spender;
    }
    cancelTx(wallet, nonce) {
        const _super = Object.create(null, {
            cancelTxWithGasPrice: { get: () => super.cancelTxWithGasPrice }
        });
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info('Canceling any existing transaction(s) with nonce number ' + nonce + '.');
            return _super.cancelTxWithGasPrice.call(this, wallet, nonce, this._gasPrice * 2);
        });
    }
    getWallet(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = `${base_1.walletPath}/${this.chainName}`;
            const encryptedPrivateKey = yield fs_extra_1.default.readFile(`${path}/${(0, wallet_controllers_1.convertXdcAddressToEthAddress)(address)}.json`, 'utf8');
            const passphrase = config_manager_cert_passphrase_1.ConfigManagerCertPassphrase.readPassphrase();
            if (!passphrase) {
                throw new Error('missing passphrase');
            }
            return yield this.decrypt(encryptedPrivateKey, passphrase);
        });
    }
    close() {
        const _super = Object.create(null, {
            close: { get: () => super.close }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.close.call(this);
            if (this._chain in Xdc._instances) {
                delete Xdc._instances[this._chain];
            }
        });
    }
}
exports.Xdc = Xdc;
//# sourceMappingURL=xdc.js.map