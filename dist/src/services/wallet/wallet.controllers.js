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
exports.getWallets = exports.getJsonFiles = exports.dropExtension = exports.getLastPath = exports.getDirectories = exports.signMessage = exports.removeWallet = exports.addWallet = exports.mkdirIfDoesNotExist = exports.convertXdcAddressToEthAddress = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const xdc_1 = require("../../chains/xdc/xdc");
const cosmos_1 = require("../../chains/cosmos/cosmos");
const tezos_1 = require("../../chains/tezos/tezos");
const xrpl_1 = require("../../chains/xrpl/xrpl");
const kujira_1 = require("../../chains/kujira/kujira");
const config_manager_cert_passphrase_1 = require("../config-manager-cert-passphrase");
const error_handler_1 = require("../error-handler");
const ethereum_base_1 = require("../../chains/ethereum/ethereum-base");
const near_1 = require("../../chains/near/near");
const connection_manager_1 = require("../connection-manager");
const algorand_1 = require("../../chains/algorand/algorand");
function convertXdcAddressToEthAddress(publicKey) {
    return publicKey.length === 43 && publicKey.slice(0, 3) === 'xdc'
        ? '0x' + publicKey.slice(3)
        : publicKey;
}
exports.convertXdcAddressToEthAddress = convertXdcAddressToEthAddress;
const walletPath = './conf/wallets';
function mkdirIfDoesNotExist(path) {
    return __awaiter(this, void 0, void 0, function* () {
        const exists = yield fs_extra_1.default.pathExists(path);
        if (!exists) {
            yield fs_extra_1.default.mkdir(path, { recursive: true });
        }
    });
}
exports.mkdirIfDoesNotExist = mkdirIfDoesNotExist;
function addWallet(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const passphrase = config_manager_cert_passphrase_1.ConfigManagerCertPassphrase.readPassphrase();
        if (!passphrase) {
            throw new Error('There is no passphrase');
        }
        let connection;
        let address;
        let encryptedPrivateKey;
        if (req.chain === 'near') {
            if (!('address' in req)) {
                throw new error_handler_1.HttpException(500, (0, error_handler_1.ACCOUNT_NOT_SPECIFIED_ERROR_MESSAGE)(), error_handler_1.ACCOUNT_NOT_SPECIFIED_CODE);
            }
        }
        try {
            connection = yield (0, connection_manager_1.getInitializedChain)(req.chain, req.network);
        }
        catch (e) {
            if (e instanceof connection_manager_1.UnsupportedChainException) {
                throw new error_handler_1.HttpException(500, (0, error_handler_1.UNKNOWN_KNOWN_CHAIN_ERROR_MESSAGE)(req.chain), error_handler_1.UNKNOWN_CHAIN_ERROR_CODE);
            }
            throw e;
        }
        try {
            if (connection instanceof algorand_1.Algorand) {
                address = connection.getAccountFromPrivateKey(req.privateKey).addr;
                encryptedPrivateKey = connection.encrypt(req.privateKey, passphrase);
            }
            else if (connection instanceof ethereum_base_1.EthereumBase) {
                address = connection.getWalletFromPrivateKey(req.privateKey).address;
                encryptedPrivateKey = yield connection.encrypt(req.privateKey, passphrase);
            }
            else if (connection instanceof xdc_1.Xdc) {
                address = convertXdcAddressToEthAddress(connection.getWalletFromPrivateKey(req.privateKey).address);
                encryptedPrivateKey = yield connection.encrypt(req.privateKey, passphrase);
            }
            else if (connection instanceof cosmos_1.Cosmos) {
                const wallet = yield connection.getAccountsfromPrivateKey(req.privateKey, 'cosmos');
                address = wallet.address;
                encryptedPrivateKey = yield connection.encrypt(req.privateKey, passphrase);
            }
            else if (connection instanceof near_1.Near) {
                address = (yield connection.getWalletFromPrivateKey(req.privateKey, req.address)).accountId;
                encryptedPrivateKey = connection.encrypt(req.privateKey, passphrase);
            }
            else if (connection instanceof tezos_1.Tezos) {
                const tezosWallet = yield connection.getWalletFromPrivateKey(req.privateKey);
                address = yield tezosWallet.signer.publicKeyHash();
                encryptedPrivateKey = connection.encrypt(req.privateKey, passphrase);
            }
            else if (connection instanceof kujira_1.Kujira) {
                const mnemonic = req.privateKey;
                const accountNumber = Number(req.accountId);
                address = yield connection.getWalletPublicKey(mnemonic, accountNumber);
                if (accountNumber !== undefined) {
                    encryptedPrivateKey = yield connection.encrypt(mnemonic, accountNumber, address);
                }
                else {
                    throw new Error('Kujira wallet requires an account number.');
                }
            }
            else if (connection instanceof xrpl_1.XRPL) {
                address = connection.getWalletFromSeed(req.privateKey).classicAddress;
                encryptedPrivateKey = yield connection.encrypt(req.privateKey, passphrase);
            }
            if (address === undefined || encryptedPrivateKey === undefined) {
                throw new Error('ERROR_RETRIEVING_WALLET_ADDRESS_ERROR_CODE');
            }
        }
        catch (_e) {
            throw new error_handler_1.HttpException(500, (0, error_handler_1.ERROR_RETRIEVING_WALLET_ADDRESS_ERROR_MESSAGE)(req.privateKey), error_handler_1.ERROR_RETRIEVING_WALLET_ADDRESS_ERROR_CODE);
        }
        const path = `${walletPath}/${req.chain}`;
        yield mkdirIfDoesNotExist(path);
        yield fs_extra_1.default.writeFile(`${path}/${address}.json`, encryptedPrivateKey);
        return { address };
    });
}
exports.addWallet = addWallet;
function removeWallet(req) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fs_extra_1.default.remove(`./conf/wallets/${req.chain}/${req.address}.json`);
    });
}
exports.removeWallet = removeWallet;
function signMessage(req) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.chain === 'tezos') {
            const chain = yield (0, connection_manager_1.getInitializedChain)(req.chain, req.network);
            const wallet = yield chain.getWallet(req.address);
            return {
                signature: (yield wallet.signer.sign('0x03' + req.message)).sbytes.slice(4),
            };
        }
        else {
            const chain = yield (0, connection_manager_1.getInitializedChain)(req.chain, req.network);
            const wallet = yield chain.getWallet(req.address);
            return { signature: yield wallet.signMessage(req.message) };
        }
    });
}
exports.signMessage = signMessage;
function getDirectories(source) {
    return __awaiter(this, void 0, void 0, function* () {
        yield mkdirIfDoesNotExist(walletPath);
        const files = yield fs_extra_1.default.readdir(source, { withFileTypes: true });
        return files
            .filter((dirent) => dirent.isDirectory())
            .map((dirent) => dirent.name);
    });
}
exports.getDirectories = getDirectories;
function getLastPath(path) {
    return path.split('/').slice(-1)[0];
}
exports.getLastPath = getLastPath;
function dropExtension(path) {
    return path.substr(0, path.lastIndexOf('.')) || path;
}
exports.dropExtension = dropExtension;
function getJsonFiles(source) {
    return __awaiter(this, void 0, void 0, function* () {
        const files = yield fs_extra_1.default.readdir(source, { withFileTypes: true });
        return files
            .filter((f) => f.isFile() && f.name.endsWith('.json'))
            .map((f) => f.name);
    });
}
exports.getJsonFiles = getJsonFiles;
function getWallets() {
    return __awaiter(this, void 0, void 0, function* () {
        const chains = yield getDirectories(walletPath);
        const responses = [];
        for (const chain of chains) {
            const walletFiles = yield getJsonFiles(`${walletPath}/${chain}`);
            const response = { chain, walletAddresses: [] };
            for (const walletFile of walletFiles) {
                const address = dropExtension(getLastPath(walletFile));
                response.walletAddresses.push(address);
            }
            responses.push(response);
        }
        return responses;
    });
}
exports.getWallets = getWallets;
//# sourceMappingURL=wallet.controllers.js.map