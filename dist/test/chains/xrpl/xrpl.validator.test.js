"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xrpl_validators_1 = require("../../../src/chains/xrpl/xrpl.validators");
const validators_1 = require("../../../src/services/validators");
const validators_2 = require("../../../src/services/validators");
require("jest-extended");
describe('validateXRPLPollRequest', () => {
    it('valid when req.txHash is a txHash', () => {
        expect((0, xrpl_validators_1.validateXRPLPollRequest)({
            txHash: '92EE240C1C31E50AAA7E3C00A6280A4BE52E65B5A8A4C1B4A6FEF9E170B14D0F',
        })).toEqual(undefined);
    });
    it('return error when req.txHash does not exist', () => {
        try {
            (0, xrpl_validators_1.validateXRPLPollRequest)({
                hello: 'world',
            });
        }
        catch (error) {
            expect(error.message).toEqual((0, validators_2.missingParameter)('txHash'));
        }
    });
    it('return error when req.txHash is invalid', () => {
        try {
            (0, xrpl_validators_1.validateXRPLPollRequest)({
                txHash: 123,
            });
        }
        catch (error) {
            expect(error.message).toEqual(validators_1.invalidTxHashError);
        }
    });
});
describe('validateAddress', () => {
    it('valid when req.address is a address', () => {
        expect((0, xrpl_validators_1.validateXRPLAddress)({
            address: 'r9wmQfStbNfPJ2XqAN7KH4iP8NJKmqPe16',
        })).toEqual([]);
    });
    it('return error when req.address does not exist', () => {
        expect((0, xrpl_validators_1.validateXRPLAddress)({
            hello: 'world',
        })).toEqual([(0, validators_2.missingParameter)('address')]);
    });
    it('return error when req.address is invalid', () => {
        expect((0, xrpl_validators_1.validateXRPLAddress)({
            address: 123,
        })).toEqual([xrpl_validators_1.invalidXRPLAddressError]);
    });
});
describe('validateXRPLBalanceRequest', () => {
    it('valid when req.token is a token and address is a valid address', () => {
        expect((0, xrpl_validators_1.validateXRPLBalanceRequest)({
            address: 'r9wmQfStbNfPJ2XqAN7KH4iP8NJKmqPe16',
        })).toEqual(undefined);
    });
    it('return error when req.address is invalid', () => {
        try {
            (0, xrpl_validators_1.validateXRPLBalanceRequest)({
                address: 123,
            });
        }
        catch (error) {
            expect(error.message).toEqual(xrpl_validators_1.invalidXRPLAddressError);
        }
    });
});
describe('validateXRPLGetTokenRequest', () => {
    it('valid when req.tokenSymbols is a token and address is a valid address', () => {
        expect((0, xrpl_validators_1.validateXRPLGetTokenRequest)({
            address: 'r9wmQfStbNfPJ2XqAN7KH4iP8NJKmqPe16',
            tokenSymbols: ['XRP'],
        })).toEqual(undefined);
    });
    it('return error when req.tokenSymbols and req.address does not exist', () => {
        try {
            (0, xrpl_validators_1.validateXRPLGetTokenRequest)({
                hello: 'world',
            });
        }
        catch (error) {
            expect(error.message).toEqual((0, validators_2.missingParameter)('tokenSymbols'));
        }
    });
    it('return error when req.tokenSymbols is invalid', () => {
        try {
            (0, xrpl_validators_1.validateXRPLGetTokenRequest)({
                address: 'r9wmQfStbNfPJ2XqAN7KH4iP8NJKmqPe16',
                tokenSymbols: 123,
            });
        }
        catch (error) {
            expect(error.message).toEqual(validators_1.invalidTokenSymbolsError);
        }
    });
    it('return error when req.address is invalid', () => {
        try {
            (0, xrpl_validators_1.validateXRPLGetTokenRequest)({
                address: 123,
                tokenSymbols: ['XRP'],
            });
        }
        catch (error) {
            expect(error.message).toEqual(xrpl_validators_1.invalidXRPLAddressError);
        }
    });
});
//# sourceMappingURL=xrpl.validator.test.js.map