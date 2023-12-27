"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSwapDataGeneralStable = exports.loadSwapDataTezCtez = exports.loadSwapDataVolatile = exports.loadSwapDataTezPairs = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const logger_1 = require("../../../services/logger");
const loadSwapDataTezPairs = (AMM, poolAnalytics, tokenIn, tokenOut) => {
    try {
        const dexContractAddress = AMM.address;
        if (dexContractAddress === "false") {
            throw new Error("No dex found");
        }
        const token1Pool = (0, bignumber_js_1.default)(poolAnalytics.tvl.token1Amount).multipliedBy(Math.pow(10, AMM.token1.decimals));
        const token2Pool = (0, bignumber_js_1.default)(poolAnalytics.tvl.token2Amount).multipliedBy(Math.pow(10, AMM.token2.decimals));
        const lpFee = (0, bignumber_js_1.default)(AMM.fees);
        const lpToken = AMM.lpToken;
        let tokenInSupply = (0, bignumber_js_1.default)(0);
        let tokenOutSupply = (0, bignumber_js_1.default)(0);
        if (tokenOut.symbol === AMM.token2.symbol) {
            tokenOutSupply = token2Pool;
            tokenInSupply = token1Pool;
        }
        else if (tokenOut.symbol === AMM.token1.symbol) {
            tokenOutSupply = token1Pool;
            tokenInSupply = token2Pool;
        }
        tokenInSupply = tokenInSupply.dividedBy((0, bignumber_js_1.default)(10).pow(tokenIn.decimals));
        tokenOutSupply = tokenOutSupply.dividedBy((0, bignumber_js_1.default)(10).pow(tokenOut.decimals));
        const exchangeFee = (0, bignumber_js_1.default)(1).dividedBy(lpFee);
        return {
            success: true,
            tokenIn: tokenIn.symbol,
            tokenInSupply,
            tokenOut: tokenOut.symbol,
            tokenOutSupply,
            exchangeFee,
            lpToken,
        };
    }
    catch (error) {
        logger_1.logger.error("Plenty: Tez pair swap data error", error);
        return {
            success: true,
            tokenIn: tokenIn.symbol,
            tokenInSupply: (0, bignumber_js_1.default)(0),
            tokenOut: tokenOut.symbol,
            tokenOutSupply: (0, bignumber_js_1.default)(0),
            exchangeFee: (0, bignumber_js_1.default)(0),
            lpToken: undefined,
        };
    }
};
exports.loadSwapDataTezPairs = loadSwapDataTezPairs;
const loadSwapDataVolatile = (AMM, poolAnalytics, tokenIn, tokenOut) => {
    try {
        const dexContractAddress = AMM.address;
        if (dexContractAddress === "false") {
            throw new Error("No dex found");
        }
        const token1Pool = (0, bignumber_js_1.default)(poolAnalytics.tvl.token1Amount).multipliedBy(Math.pow(10, AMM.token1.decimals));
        const token2Pool = (0, bignumber_js_1.default)(poolAnalytics.tvl.token2Amount).multipliedBy(Math.pow(10, AMM.token2.decimals));
        const lpFee = (0, bignumber_js_1.default)(AMM.fees);
        const lpToken = AMM.lpToken;
        let tokenInSupply = (0, bignumber_js_1.default)(0);
        let tokenOutSupply = (0, bignumber_js_1.default)(0);
        if (tokenOut.symbol === AMM.token2.symbol) {
            tokenOutSupply = token2Pool;
            tokenInSupply = token1Pool;
        }
        else if (tokenOut.symbol === AMM.token1.symbol) {
            tokenOutSupply = token1Pool;
            tokenInSupply = token2Pool;
        }
        tokenInSupply = tokenInSupply.dividedBy((0, bignumber_js_1.default)(10).pow(tokenIn.decimals));
        tokenOutSupply = tokenOutSupply.dividedBy((0, bignumber_js_1.default)(10).pow(tokenOut.decimals));
        const exchangeFee = (0, bignumber_js_1.default)(1).dividedBy(lpFee);
        return {
            success: true,
            tokenIn: tokenIn.symbol,
            tokenInSupply,
            tokenOut: tokenOut.symbol,
            tokenOutSupply,
            exchangeFee,
            lpToken,
        };
    }
    catch (error) {
        logger_1.logger.error("Plenty: Volatileswap data error", error);
        return {
            success: true,
            tokenIn: tokenIn.symbol,
            tokenInSupply: (0, bignumber_js_1.default)(0),
            tokenOut: tokenOut.symbol,
            tokenOutSupply: (0, bignumber_js_1.default)(0),
            exchangeFee: (0, bignumber_js_1.default)(0),
            lpToken: undefined,
        };
    }
};
exports.loadSwapDataVolatile = loadSwapDataVolatile;
const loadSwapDataTezCtez = (AMM, poolAnalytics, tokenIn, tokenOut) => {
    try {
        let tezSupply = (0, bignumber_js_1.default)(poolAnalytics.tvl.token1Amount).multipliedBy(Math.pow(10, AMM.token1.decimals));
        let ctezSupply = (0, bignumber_js_1.default)(poolAnalytics.tvl.token2Amount).multipliedBy(Math.pow(10, AMM.token2.decimals));
        const exchangeFee = (0, bignumber_js_1.default)(AMM.fees);
        const lpToken = AMM.lpToken;
        tezSupply = tezSupply.dividedBy((0, bignumber_js_1.default)(10).pow(6));
        ctezSupply = ctezSupply.dividedBy((0, bignumber_js_1.default)(10).pow(6));
        let tokenInSupply = (0, bignumber_js_1.default)(0);
        let tokenOutSupply = (0, bignumber_js_1.default)(0);
        if (tokenOut === AMM.token2.symbol) {
            tokenOutSupply = ctezSupply;
            tokenInSupply = tezSupply;
        }
        else if (tokenOut === AMM.token1.symbol) {
            tokenOutSupply = tezSupply;
            tokenInSupply = ctezSupply;
        }
        return {
            success: true,
            tokenInSupply,
            tokenOutSupply,
            tokenIn,
            tokenOut,
            exchangeFee,
            lpToken,
        };
    }
    catch (error) {
        logger_1.logger.error('Plenty: Tez-Ctez swap data error - ', error);
        return {
            success: false,
            tokenInSupply: (0, bignumber_js_1.default)(0),
            tokenOutSupply: (0, bignumber_js_1.default)(0),
            tokenIn,
            tokenOut,
            exchangeFee: (0, bignumber_js_1.default)(0),
            lpToken: undefined,
            target: (0, bignumber_js_1.default)(0),
        };
    }
};
exports.loadSwapDataTezCtez = loadSwapDataTezCtez;
const loadSwapDataGeneralStable = (AMM, poolAnalytics, tokenIn, tokenOut) => {
    try {
        const token1Pool = (0, bignumber_js_1.default)(poolAnalytics.tvl.token1Amount).multipliedBy(Math.pow(10, AMM.token1.decimals));
        const token2Pool = (0, bignumber_js_1.default)(poolAnalytics.tvl.token2Amount).multipliedBy(Math.pow(10, AMM.token2.decimals));
        const token1Precision = (0, bignumber_js_1.default)(AMM.token1Precision);
        const token2Precision = (0, bignumber_js_1.default)(AMM.token2Precision);
        let tokenInSupply = (0, bignumber_js_1.default)(0);
        let tokenOutSupply = (0, bignumber_js_1.default)(0);
        let tokenInPrecision = (0, bignumber_js_1.default)(0);
        let tokenOutPrecision = (0, bignumber_js_1.default)(0);
        if (tokenOut.symbol === AMM.token2.symbol) {
            tokenOutSupply = token2Pool;
            tokenOutPrecision = token2Precision;
            tokenInSupply = token1Pool;
            tokenInPrecision = token1Precision;
        }
        else if (tokenOut.symbol === AMM.token1.symbol) {
            tokenOutSupply = token1Pool;
            tokenOutPrecision = token1Precision;
            tokenInSupply = token2Pool;
            tokenInPrecision = token2Precision;
        }
        const exchangeFee = (0, bignumber_js_1.default)(AMM.fees);
        const lpToken = AMM.lpToken;
        tokenInSupply = tokenInSupply.dividedBy((0, bignumber_js_1.default)(10).pow(tokenIn.decimals));
        tokenOutSupply = tokenOutSupply.dividedBy((0, bignumber_js_1.default)(10).pow(tokenOut.decimals));
        return {
            success: true,
            tokenIn: tokenIn.symbol,
            tokenInSupply,
            tokenOut: tokenOut.symbol,
            tokenOutSupply,
            exchangeFee,
            lpToken,
            tokenInPrecision,
            tokenOutPrecision,
        };
    }
    catch (error) {
        logger_1.logger.error('Plenty: load swap data general error - ', error);
        return {
            success: false,
            tokenIn: tokenIn.symbol,
            tokenInSupply: (0, bignumber_js_1.default)(0),
            tokenOut: tokenOut.symbol,
            tokenOutSupply: (0, bignumber_js_1.default)(0),
            exchangeFee: (0, bignumber_js_1.default)(0),
            lpToken: undefined,
            tokenInPrecision: (0, bignumber_js_1.default)(0),
            tokenOutPrecision: (0, bignumber_js_1.default)(0),
        };
    }
};
exports.loadSwapDataGeneralStable = loadSwapDataGeneralStable;
//# sourceMappingURL=swapdata.js.map