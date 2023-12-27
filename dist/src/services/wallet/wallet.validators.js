"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateWalletSignRequest = exports.validateRemoveWalletRequest = exports.validateAddWalletRequest = exports.validateMessage = exports.validateAccountID = exports.validateAddress = exports.validateNetwork = exports.validateChain = exports.invalidMessageError = exports.invalidAccountIDError = exports.invalidAddressError = exports.invalidNetworkError = exports.invalidChainError = exports.validatePrivateKey = exports.isTezosPrivateKey = exports.isCosmosPrivateKey = exports.isNearPrivateKey = exports.isEthPrivateKey = exports.invalidKujiraPrivateKeyError = exports.isAlgorandPrivateKeyOrMnemonic = exports.invalidTezosPrivateKeyError = exports.invalidCosmosPrivateKeyError = exports.invalidNearPrivateKeyError = exports.invalidEthPrivateKeyError = exports.invalidAlgorandPrivateKeyOrMnemonicError = void 0;
const kujira_helpers_1 = require("../../connectors/kujira/kujira.helpers");
const validators_1 = require("../validators");
const { fromBase64 } = require('@cosmjs/encoding');
const xrpl_validators_1 = require("../../chains/xrpl/xrpl.validators");
exports.invalidAlgorandPrivateKeyOrMnemonicError = 'The privateKey param is not a valid Algorand private key or mnemonic.';
exports.invalidEthPrivateKeyError = 'The privateKey param is not a valid Ethereum private key (64 hexadecimal characters).';
exports.invalidNearPrivateKeyError = 'The privateKey param is not a valid Near private key.';
exports.invalidCosmosPrivateKeyError = 'The privateKey param is not a valid Cosmos private key.';
exports.invalidTezosPrivateKeyError = 'The privateKey param is not a valid Tezos private key.';
const isAlgorandPrivateKeyOrMnemonic = (str) => {
    const parts = str.split(' ');
    return parts.length === 25;
};
exports.isAlgorandPrivateKeyOrMnemonic = isAlgorandPrivateKeyOrMnemonic;
exports.invalidKujiraPrivateKeyError = 'Invalid Kujira mnemonic.';
const isEthPrivateKey = (str) => {
    return /^(0x|xdc)?[a-fA-F0-9]{64}$/.test(str);
};
exports.isEthPrivateKey = isEthPrivateKey;
const isNearPrivateKey = (str) => {
    const parts = str.split(':');
    return parts.length === 2;
};
exports.isNearPrivateKey = isNearPrivateKey;
const isCosmosPrivateKey = (str) => {
    try {
        fromBase64(str);
        return true;
    }
    catch (_a) {
        return false;
    }
};
exports.isCosmosPrivateKey = isCosmosPrivateKey;
const isTezosPrivateKey = (str) => {
    try {
        const prefix = str.substring(0, 4);
        if (prefix !== 'edsk' && prefix !== 'spsk' && prefix !== 'p2sk') {
            return false;
        }
        return true;
    }
    catch (_a) {
        return false;
    }
};
exports.isTezosPrivateKey = isTezosPrivateKey;
exports.validatePrivateKey = (0, validators_1.mkSelectingValidator)('chain', (req, key) => req[key], {
    algorand: (0, validators_1.mkValidator)('privateKey', exports.invalidAlgorandPrivateKeyOrMnemonicError, (val) => typeof val === 'string' && (0, exports.isAlgorandPrivateKeyOrMnemonic)(val)),
    ethereum: (0, validators_1.mkValidator)('privateKey', exports.invalidEthPrivateKeyError, (val) => typeof val === 'string' && (0, exports.isEthPrivateKey)(val)),
    cronos: (0, validators_1.mkValidator)('privateKey', exports.invalidEthPrivateKeyError, (val) => typeof val === 'string' && (0, exports.isEthPrivateKey)(val)),
    avalanche: (0, validators_1.mkValidator)('privateKey', exports.invalidEthPrivateKeyError, (val) => typeof val === 'string' && (0, exports.isEthPrivateKey)(val)),
    harmony: (0, validators_1.mkValidator)('privateKey', exports.invalidEthPrivateKeyError, (val) => typeof val === 'string' && (0, exports.isEthPrivateKey)(val)),
    near: (0, validators_1.mkValidator)('privateKey', exports.invalidNearPrivateKeyError, (val) => typeof val === 'string' && (0, exports.isNearPrivateKey)(val)),
    cosmos: (0, validators_1.mkValidator)('privateKey', exports.invalidCosmosPrivateKeyError, (val) => typeof val === 'string' && (0, exports.isCosmosPrivateKey)(val)),
    polygon: (0, validators_1.mkValidator)('privateKey', exports.invalidEthPrivateKeyError, (val) => typeof val === 'string' && (0, exports.isEthPrivateKey)(val)),
    'binance-smart-chain': (0, validators_1.mkValidator)('privateKey', exports.invalidEthPrivateKeyError, (val) => typeof val === 'string' && (0, exports.isEthPrivateKey)(val)),
    xdc: (0, validators_1.mkValidator)('privateKey', exports.invalidEthPrivateKeyError, (val) => typeof val === 'string' && (0, exports.isEthPrivateKey)(val)),
    tezos: (0, validators_1.mkValidator)('privateKey', exports.invalidTezosPrivateKeyError, (val) => typeof val === 'string' && (0, exports.isTezosPrivateKey)(val)),
    xrpl: (0, validators_1.mkValidator)('privateKey', xrpl_validators_1.invalidXRPLPrivateKeyError, (val) => typeof val === 'string' && (0, xrpl_validators_1.isXRPLSeedKey)(val)),
    kujira: (0, validators_1.mkValidator)('privateKey', exports.invalidKujiraPrivateKeyError, (val) => typeof val === 'string' && (0, kujira_helpers_1.isKujiraPrivateKey)(val)),
});
exports.invalidChainError = 'chain must be "ethereum", "avalanche", "near", "harmony", "cosmos", "binance-smart-chain", "kujira"';
exports.invalidNetworkError = 'expected a string for the network key';
exports.invalidAddressError = 'address must be a string';
exports.invalidAccountIDError = 'account ID must be a string';
exports.invalidMessageError = 'message to be signed must be a string';
exports.validateChain = (0, validators_1.mkValidator)('chain', exports.invalidChainError, (val) => typeof val === 'string' &&
    (val === 'algorand' ||
        val === 'ethereum' ||
        val === 'avalanche' ||
        val === 'polygon' ||
        val === 'xdc' ||
        val === 'near' ||
        val === 'harmony' ||
        val === 'cronos' ||
        val === 'cosmos' ||
        val === 'binance-smart-chain' ||
        val === 'tezos' ||
        val === 'xrpl' ||
        val === 'kujira'));
exports.validateNetwork = (0, validators_1.mkValidator)('network', exports.invalidNetworkError, (val) => typeof val === 'string');
exports.validateAddress = (0, validators_1.mkValidator)('address', exports.invalidAddressError, (val) => typeof val === 'string');
exports.validateAccountID = (0, validators_1.mkValidator)('accountId', exports.invalidAccountIDError, (val) => typeof val === 'string', true);
exports.validateMessage = (0, validators_1.mkValidator)('message', exports.invalidMessageError, (val) => typeof val === 'string', true);
exports.validateAddWalletRequest = (0, validators_1.mkRequestValidator)([
    exports.validatePrivateKey,
    exports.validateChain,
    exports.validateNetwork,
    exports.validateAccountID,
]);
exports.validateRemoveWalletRequest = (0, validators_1.mkRequestValidator)([exports.validateAddress, exports.validateChain]);
exports.validateWalletSignRequest = (0, validators_1.mkRequestValidator)([
    exports.validateAddress,
    exports.validateChain,
    exports.validateNetwork,
    exports.validateMessage,
]);
//# sourceMappingURL=wallet.validators.js.map