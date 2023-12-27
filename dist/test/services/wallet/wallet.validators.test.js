"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wallet_validators_1 = require("../../../src/services/wallet/wallet.validators");
const validators_1 = require("../../../src/services/validators");
require("jest-extended");
describe('isEthPrivateKey', () => {
    it('pass against a well formed private key', () => {
        expect((0, wallet_validators_1.isEthPrivateKey)('da857cbda0ba96757fed842617a40693d06d00001e55aa972955039ae747bac4')).toEqual(true);
    });
    it('fail against a string that is too short', () => {
        expect((0, wallet_validators_1.isEthPrivateKey)('da857cbda0ba96757fed842617a40693d0')).toEqual(false);
    });
    it('fail against a string that has non-hexadecimal characters', () => {
        expect((0, wallet_validators_1.isEthPrivateKey)('da857cbda0ba96757fed842617a40693d06d00001e55aa972955039ae747qwer')).toEqual(false);
    });
});
describe('isCosmosPrivateKey', () => {
    it('pass against a well formed private key', () => {
        expect((0, wallet_validators_1.isCosmosPrivateKey)('218507defde7d91a9eba858437115b8aea68e3cbc7a4b68b3edac53d5ec89515')).toEqual(true);
    });
    it('fail against a string that is invalid', () => {
        expect((0, wallet_validators_1.isCosmosPrivateKey)('218507defde7d91a9eba858437115b8aea68e3cbc7a4b68b3edac53d5ec8951')).toEqual(false);
    });
});
describe('isNearPrivateKey', () => {
    it('pass against a well formed private key', () => {
        expect((0, wallet_validators_1.isNearPrivateKey)('ed25519:5r1MuqBa3L9gpXHqULS3u2B142c5jA8szrEiL8cprvhjJDe6S2xz9Q4uppgaLegmuPpq4ftBpcMw7NNoJHJefiTt')).toEqual(true);
    });
    it('fail against a string that is invalid', () => {
        expect((0, wallet_validators_1.isEthPrivateKey)('ed25519')).toEqual(false);
    });
});
describe('validatePrivateKey', () => {
    it('valid when req.privateKey is an ethereum key', () => {
        expect((0, wallet_validators_1.validatePrivateKey)({
            chain: 'ethereum',
            privateKey: 'da857cbda0ba96757fed842617a40693d06d00001e55aa972955039ae747bac4',
        })).toEqual([]);
    });
    it('valid when req.privateKey is a near key', () => {
        expect((0, wallet_validators_1.validatePrivateKey)({
            chain: 'near',
            privateKey: 'ed25519:5r1MuqBa3L9gpXHqULS3u2B142c5jA8szrEiL8cprvhjJDe6S2xz9Q4uppgaLegmuPpq4ftBpcMw7NNoJHJefiTt',
        })).toEqual([]);
    });
    it('valid when req.privateKey is a harmony key', () => {
        expect((0, wallet_validators_1.validatePrivateKey)({
            chain: 'harmony',
            privateKey: 'da857cbda0ba96757fed842617a40693d06d00001e55aa972955039ae747bac4',
        })).toEqual([]);
    });
    it('valid when req.privateKey is a cronos key', () => {
        expect((0, wallet_validators_1.validatePrivateKey)({
            chain: 'cronos',
            privateKey: 'da857cbda0ba96757fed842617a40693d06d00001e55aa972955039ae747bac4',
        })).toEqual([]);
    });
    it('valid when req.privateKey is a polygon key', () => {
        expect((0, wallet_validators_1.validatePrivateKey)({
            chain: 'polygon',
            privateKey: 'da857cbda0ba96757fed842617a40693d06d00001e55aa972955039ae747bac4',
        })).toEqual([]);
    });
    it('valid when req.privateKey is a avalanche key', () => {
        expect((0, wallet_validators_1.validatePrivateKey)({
            chain: 'avalanche',
            privateKey: 'da857cbda0ba96757fed842617a40693d06d00001e55aa972955039ae747bac4',
        })).toEqual([]);
    });
    it('valid when req.privateKey is an binance-smart-chain key', () => {
        expect((0, wallet_validators_1.validatePrivateKey)({
            chain: 'binance-smart-chain',
            privateKey: 'da857cbda0ba96757fed842617a40693d06d00001e55aa972955039ae747bac4',
        })).toEqual([]);
    });
    it('valid when req.privateKey is a cosmos key', () => {
        expect((0, wallet_validators_1.validatePrivateKey)({
            chain: 'cosmos',
            privateKey: '218507defde7d91a9eba858437115b8aea68e3cbc7a4b68b3edac53d5ec89516',
        })).toEqual([]);
    });
    it('return error when req.privateKey does not exist', () => {
        expect((0, wallet_validators_1.validatePrivateKey)({
            chain: 'ethereum',
            hello: 'world',
        })).toEqual([(0, validators_1.missingParameter)('privateKey')]);
    });
    it('return error when req.chain does not exist', () => {
        expect((0, wallet_validators_1.validatePrivateKey)({
            privateKey: '5r1MuqBa3L9gpXHqULS3u2B142c5jA8szrEiL8cprvhjJDe6S2xz9Q4uppgaLegmuPpq4ftBpcMw7NNoJHJefiTt',
        })).toEqual([(0, validators_1.missingParameter)('chain')]);
    });
    it('return error when req.privateKey is invalid ethereum key', () => {
        expect((0, wallet_validators_1.validatePrivateKey)({
            chain: 'ethereum',
            privateKey: 'world',
        })).toEqual([wallet_validators_1.invalidEthPrivateKeyError]);
    });
    it('return error when req.privateKey is invalid binance-smart-chain key', () => {
        expect((0, wallet_validators_1.validatePrivateKey)({
            chain: 'binance-smart-chain',
            privateKey: 'someErroneousPrivateKey',
        })).toEqual([wallet_validators_1.invalidEthPrivateKeyError]);
    });
    it('return error when req.privateKey is invalid cosmos key', () => {
        expect((0, wallet_validators_1.validatePrivateKey)({
            chain: 'cosmos',
            privateKey: 'someErroneousPrivateKey',
        })).toEqual([wallet_validators_1.invalidCosmosPrivateKeyError]);
    });
});
describe('validateChain', () => {
    it('valid when chain is ethereum', () => {
        expect((0, wallet_validators_1.validateChain)({
            chain: 'ethereum',
        })).toEqual([]);
    });
    it('valid when chain is avalanche', () => {
        expect((0, wallet_validators_1.validateChain)({
            chain: 'avalanche',
        })).toEqual([]);
    });
    it('valid when chain is harmony', () => {
        expect((0, wallet_validators_1.validateChain)({
            chain: 'harmony',
        })).toEqual([]);
    });
    it('valid when chain is binance-smart-chain', () => {
        expect((0, wallet_validators_1.validateChain)({
            chain: 'binance-smart-chain',
        })).toEqual([]);
    });
    it('valid when chain is cronos', () => {
        expect((0, wallet_validators_1.validateChain)({
            chain: 'cronos',
        })).toEqual([]);
    });
    it('valid when chain is binance-smart-chain', () => {
        expect((0, wallet_validators_1.validateChain)({
            chain: 'binance-smart-chain',
        })).toEqual([]);
    });
    it('valid when chain is cosmos', () => {
        expect((0, wallet_validators_1.validateChain)({
            chain: 'cosmos',
        })).toEqual([]);
    });
    it('return error when req.chain does not exist', () => {
        expect((0, wallet_validators_1.validateChain)({
            hello: 'world',
        })).toEqual([(0, validators_1.missingParameter)('chain')]);
    });
    it('return error when req.chain is invalid', () => {
        expect((0, wallet_validators_1.validateChain)({
            chain: 'shibainu',
        })).toEqual([wallet_validators_1.invalidChainError]);
    });
});
describe('validateAddress', () => {
    it('valid when address is a string', () => {
        expect((0, wallet_validators_1.validateAddress)({
            address: '0x000000000000000000000000000000000000000',
        })).toEqual([]);
    });
    it('return error when req.address does not exist', () => {
        expect((0, wallet_validators_1.validateAddress)({
            hello: 'world',
        })).toEqual([(0, validators_1.missingParameter)('address')]);
    });
    it('return error when req.address is not a string', () => {
        expect((0, wallet_validators_1.validateAddress)({
            address: 1,
        })).toEqual([wallet_validators_1.invalidAddressError]);
    });
});
describe('validateAccountID', () => {
    it('valid when account ID is a string', () => {
        expect((0, wallet_validators_1.validateAccountID)({
            accountId: '0x000000000000000000000000000000000000000',
        })).toEqual([]);
    });
    it('valid when account ID is not specified', () => {
        expect((0, wallet_validators_1.validateAccountID)({})).toEqual([]);
    });
    it('return error when req.accountId is not a string', () => {
        expect((0, wallet_validators_1.validateAccountID)({ accountId: 1 })).toEqual([
            wallet_validators_1.invalidAccountIDError,
        ]);
    });
});
//# sourceMappingURL=wallet.validators.test.js.map