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
exports.loadSwapDataWrapper = exports.swapWrapper = exports.computeReverseCalculationWrapper = exports.computeAllPathsWrapper = exports.calculateTokensInWrapper = exports.calculateTokensOutWrapper = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const plenty_types_1 = require("../plenty.types");
const error_handler_1 = require("../../../services/error-handler");
const logger_1 = require("../../../services/logger");
const pricing_1 = require("./pricing");
const swapdata_1 = require("./swapdata");
const paths_1 = require("./paths");
const router_1 = require("./router");
const calculateTokensOutWrapper = (plenty, tokenInAmount, exchangefee, slippage, tokenIn, tokenOut, tokenInSupply, tokenOutSupply, tokenInPrecision, tokenOutPrecision, target) => {
    try {
        const poolConfig = plenty.getPool(tokenIn, tokenOut);
        const type = poolConfig.type;
        let tokenInConfig = plenty.getTokenBySymbol(tokenIn);
        let tokenOutConfig = plenty.getTokenBySymbol(tokenOut);
        let outputData;
        if ((type === plenty_types_1.PoolType.VOLATILE || type === plenty_types_1.PoolType.TEZ) && tokenInSupply && tokenOutSupply) {
            outputData = (0, pricing_1.calculateTokenOutputVolatile)(tokenInAmount, tokenInSupply, tokenOutSupply, exchangefee, slippage, tokenOutConfig);
        }
        else {
            if (tokenInConfig.symbol === "XTZ" && tokenOutConfig.symbol === "CTEZ" && target) {
                outputData = (0, pricing_1.calculateTokensOutTezCtez)(tokenInSupply, tokenOutSupply, tokenInAmount, exchangefee, slippage, target, tokenInConfig.symbol);
            }
            else if (tokenInConfig.symbol === "CTEZ" && tokenOutConfig.symbol === "XTZ" && target) {
                outputData = (0, pricing_1.calculateTokensOutTezCtez)(tokenOutSupply, tokenInSupply, tokenInAmount, exchangefee, slippage, target, tokenInConfig.symbol);
            }
            else if (tokenInSupply && tokenOutSupply && tokenInPrecision && tokenOutPrecision) {
                outputData = (0, pricing_1.calculateTokensOutGeneralStable)(tokenInSupply, tokenOutSupply, tokenInAmount, exchangefee, slippage, tokenInConfig, tokenOutConfig, tokenInPrecision, tokenOutPrecision);
            }
            else {
                throw new error_handler_1.UniswapishPriceError("Plenty priceSwapOut: Invalid Parameter");
            }
        }
        return outputData;
    }
    catch (error) {
        logger_1.logger.error("Plenty: Swap data error - " + error);
        return {
            tokenOutAmount: new bignumber_js_1.default(0),
            fees: new bignumber_js_1.default(0),
            feePerc: new bignumber_js_1.default(0),
            minimumOut: new bignumber_js_1.default(0),
            exchangeRate: new bignumber_js_1.default(0),
            priceImpact: new bignumber_js_1.default(0),
            error,
        };
    }
};
exports.calculateTokensOutWrapper = calculateTokensOutWrapper;
const calculateTokensInWrapper = (plenty, tokenInAmount, Exchangefee, slippage, tokenIn, tokenOut, tokenInSupply, tokenOutSupply, tokenInPrecision, tokenOutPrecision, target) => {
    try {
        const poolConfig = plenty.getPool(tokenIn, tokenOut);
        const type = poolConfig.type;
        let tokenInConfig = plenty.getTokenBySymbol(tokenIn);
        let tokenOutConfig = plenty.getTokenBySymbol(tokenOut);
        let outputData;
        if ((type === plenty_types_1.PoolType.VOLATILE || type === plenty_types_1.PoolType.TEZ) && tokenInSupply && tokenOutSupply) {
            outputData = (0, pricing_1.calculateTokenInputVolatile)(tokenInAmount, tokenInSupply, tokenOutSupply, Exchangefee, slippage, tokenInConfig, tokenOutConfig);
        }
        else {
            if (tokenIn === "XTZ" && tokenOut === "CTEZ" && target) {
                outputData = (0, pricing_1.calculateTokensInTezCtez)(tokenInSupply, tokenOutSupply, tokenInAmount, Exchangefee, slippage, target, tokenIn);
            }
            else if (tokenIn === "CTEZ" && tokenOut === "XTZ" && target) {
                outputData = (0, pricing_1.calculateTokensInTezCtez)(tokenOutSupply, tokenInSupply, tokenInAmount, Exchangefee, slippage, target, tokenIn);
            }
            else if (tokenInSupply && tokenOutSupply && tokenInPrecision && tokenOutPrecision) {
                outputData = (0, pricing_1.calculateTokensInGeneralStable)(tokenInSupply, tokenOutSupply, tokenInAmount, Exchangefee, slippage, tokenInConfig, tokenOutConfig, tokenInPrecision, tokenOutPrecision);
            }
            else {
                throw new Error("Invalid Parameter");
            }
        }
        return outputData;
    }
    catch (error) {
        console.log({ message: "swap data error", error });
        return {
            tokenOutAmount: new bignumber_js_1.default(0),
            fees: new bignumber_js_1.default(0),
            feePerc: new bignumber_js_1.default(0),
            minimumOut: new bignumber_js_1.default(0),
            exchangeRate: new bignumber_js_1.default(0),
            priceImpact: new bignumber_js_1.default(0),
            error,
        };
    }
};
exports.calculateTokensInWrapper = calculateTokensInWrapper;
const computeAllPathsWrapper = (plenty, paths, tokenInAmount, slippage = '1/200', swapData) => {
    try {
        const bestPath = (0, paths_1.computeAllPaths)(plenty, paths, tokenInAmount, slippage, swapData);
        const isStable = [];
        let finalPriceImpact = new bignumber_js_1.default(0);
        let finalFeePerc = new bignumber_js_1.default(0);
        for (var x of bestPath.priceImpact) {
            finalPriceImpact = finalPriceImpact.plus(x);
        }
        for (var y of bestPath.feePerc) {
            finalFeePerc = finalFeePerc.plus(y);
        }
        for (var z = 0; z < bestPath.path.length - 1; z++) {
            const dexType = plenty.getPool(bestPath.path[z], bestPath.path[z + 1]).type;
            if (dexType === plenty_types_1.PoolType.STABLE)
                isStable.push(true);
            else
                isStable.push(false);
        }
        const exchangeRate = bestPath.tokenOutAmount.dividedBy(tokenInAmount);
        return {
            path: bestPath.path,
            tokenOutAmount: bestPath.tokenOutAmount,
            finalMinimumTokenOut: bestPath.minimumTokenOut[bestPath.minimumTokenOut.length - 1],
            minimumTokenOut: bestPath.minimumTokenOut,
            finalPriceImpact: finalPriceImpact,
            finalFeePerc: finalFeePerc,
            feePerc: bestPath.feePerc,
            isStable: isStable,
            exchangeRate: exchangeRate,
        };
    }
    catch (error) {
        logger_1.logger.error('Plenty: compute all paths error - ', error);
        return {
            path: [],
            tokenOutAmount: new bignumber_js_1.default(0),
            finalMinimumTokenOut: new bignumber_js_1.default(0),
            minimumTokenOut: [],
            finalPriceImpact: new bignumber_js_1.default(0),
            finalFeePerc: new bignumber_js_1.default(0),
            feePerc: [],
            isStable: [],
            exchangeRate: new bignumber_js_1.default(0),
        };
    }
};
exports.computeAllPathsWrapper = computeAllPathsWrapper;
const computeReverseCalculationWrapper = (plenty, paths, tokenInAmount, slippage = '1/200', swapData, paths2, swapData2) => {
    try {
        const bestPath = (0, paths_1.computeAllPathsReverse)(plenty, paths, tokenInAmount, slippage, swapData);
        let temp = (0, paths_1.computeAllPaths)(plenty, paths2, bestPath.tokenOutAmount, slippage, swapData2);
        const path = paths2[0].split(" ");
        const tokenIn = path[0];
        const tokenInConfig = plenty.getTokenBySymbol(tokenIn);
        let low = bestPath.tokenOutAmount;
        while (temp.tokenOutAmount.isGreaterThan(tokenInAmount) && temp.tokenOutAmount.isGreaterThan(new bignumber_js_1.default(0))) {
            low = low.minus(1);
            if (low.isLessThan(0)) {
                low = new bignumber_js_1.default(1).dividedBy(new bignumber_js_1.default(10).pow(tokenInConfig.decimals));
                break;
            }
            temp = (0, paths_1.computeAllPaths)(plenty, paths2, low, slippage, swapData2);
        }
        let high = low.plus(1);
        let mid = new bignumber_js_1.default(0);
        while (low.isLessThanOrEqualTo(high)) {
            mid = (low.plus(high)).dividedBy(2).decimalPlaces(tokenInConfig.decimals, 1);
            let currAns = (0, paths_1.computeAllPaths)(plenty, paths2, mid, slippage, swapData2);
            if (currAns.tokenOutAmount.isEqualTo(tokenInAmount)) {
                break;
            }
            else if (tokenInAmount.isGreaterThan(currAns.tokenOutAmount)) {
                low = mid.plus(new bignumber_js_1.default(1).dividedBy(new bignumber_js_1.default(10).pow(tokenInConfig.decimals)));
            }
            else {
                high = mid.minus(new bignumber_js_1.default(1).dividedBy(new bignumber_js_1.default(10).pow(tokenInConfig.decimals)));
            }
        }
        const forwardPass = (0, paths_1.computeAllPaths)(plenty, paths2, mid, slippage, swapData2);
        const isStable = [];
        let finalPriceImpact = new bignumber_js_1.default(0);
        let finalFeePerc = new bignumber_js_1.default(0);
        for (var x of forwardPass.priceImpact) {
            finalPriceImpact = finalPriceImpact.plus(x);
        }
        for (var x of forwardPass.feePerc) {
            finalFeePerc = finalFeePerc.plus(x);
        }
        for (var z = 0; z < forwardPass.path.length - 1; z++) {
            const dexType = plenty.getPool(forwardPass.path[z], forwardPass.path[z + 1]).type;
            if (dexType === plenty_types_1.PoolType.STABLE)
                isStable.push(true);
            else
                isStable.push(false);
        }
        const exchangeRate = tokenInAmount.dividedBy(mid);
        return {
            path: forwardPass.path,
            tokenOutAmount: mid,
            userFinalTokenOut: forwardPass.tokenOutAmount,
            finalMinimumTokenOut: forwardPass.minimumTokenOut[forwardPass.minimumTokenOut.length - 1],
            minimumTokenOut: forwardPass.minimumTokenOut,
            finalPriceImpact: finalPriceImpact,
            finalFeePerc: finalFeePerc,
            feePerc: forwardPass.feePerc,
            isStable: isStable,
            exchangeRate: exchangeRate,
        };
    }
    catch (error) {
        console.log(error);
        return {
            path: [],
            tokenOutAmount: new bignumber_js_1.default(0),
            finalMinimumTokenOut: new bignumber_js_1.default(0),
            minimumTokenOut: [],
            finalPriceImpact: new bignumber_js_1.default(0),
            finalFeePerc: new bignumber_js_1.default(0),
            feePerc: [],
            isStable: [],
            exchangeRate: new bignumber_js_1.default(0),
        };
    }
};
exports.computeReverseCalculationWrapper = computeReverseCalculationWrapper;
const swapWrapper = (tezos, plenty, tokenIn, tokenOut, tokenInAmount, caller, slippage) => __awaiter(void 0, void 0, void 0, function* () {
    const paths = yield (0, paths_1.allPaths)(tezos, plenty, tokenIn, tokenOut, true);
    const path = (0, exports.computeAllPathsWrapper)(plenty, paths.paths, tokenInAmount, slippage, paths.swapData);
    return yield (0, router_1.routerSwap)(tezos, plenty, path.path, path.minimumTokenOut, caller, caller, tokenInAmount);
});
exports.swapWrapper = swapWrapper;
const loadSwapDataWrapper = (tezos, plenty, analytics, tokenIn, tokenOut) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dex = plenty.getPool(tokenIn, tokenOut);
        const dexType = dex.type;
        const poolAnalytics = analytics.find(analytic => analytic.pool === dex.address);
        let fullTokenIn = plenty.getTokenBySymbol(tokenIn);
        let fullTokenOut = plenty.getTokenBySymbol(tokenOut);
        let swapData;
        if (dexType === plenty_types_1.PoolType.TEZ) {
            swapData = (0, swapdata_1.loadSwapDataTezPairs)(dex, poolAnalytics, fullTokenIn, fullTokenOut);
        }
        else if (dexType === plenty_types_1.PoolType.VOLATILE) {
            swapData = (0, swapdata_1.loadSwapDataVolatile)(dex, poolAnalytics, fullTokenIn, fullTokenOut);
        }
        else {
            if ((tokenIn === "XTZ" && tokenOut === "CTEZ") ||
                (tokenIn === "CTEZ" && tokenOut === "XTZ")) {
                const ctezAdmin = yield tezos.getContractStorage(tezos.ctezAdminAddress);
                swapData = (0, swapdata_1.loadSwapDataTezCtez)(dex, poolAnalytics, tokenIn, tokenOut);
                swapData.target = ctezAdmin.target;
            }
            else {
                swapData = (0, swapdata_1.loadSwapDataGeneralStable)(dex, poolAnalytics, fullTokenIn, fullTokenOut);
            }
        }
        return swapData;
    }
    catch (error) {
        logger_1.logger.error("Plenty: load swap data error - ", error);
        return {
            success: false,
            tokenIn: tokenIn,
            tokenOut: tokenOut,
            tokenInSupply: new bignumber_js_1.default(0),
            tokenOutSupply: new bignumber_js_1.default(0),
            exchangeFee: new bignumber_js_1.default(0),
            lpToken: undefined,
        };
    }
});
exports.loadSwapDataWrapper = loadSwapDataWrapper;
//# sourceMappingURL=wrappers.js.map