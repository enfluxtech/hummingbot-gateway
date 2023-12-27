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
exports.computeAllPathsReverse = exports.computeAllPaths = exports.allPaths = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const wrappers_1 = require("./wrappers");
const logger_1 = require("../../../services/logger");
const allPaths = (tezos, plenty, tokenIn, tokenOut, multihop) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const TOKEN = plenty.tokenList;
        const visited = {};
        let paths = [];
        Object.keys(TOKEN).forEach(function (key) {
            visited[key] = false;
        });
        allPathHelper(tokenIn, tokenOut, visited, tokenIn, TOKEN, paths);
        let tempPaths = [];
        for (const i in paths) {
            const path = paths[i].split(' ');
            if (!multihop) {
                if (path.length === 2)
                    tempPaths.push(paths[i]);
            }
            else {
                if (path.length <= 5)
                    tempPaths.push(paths[i]);
            }
        }
        tempPaths.sort((a, b) => a.length - b.length);
        paths = tempPaths;
        let swapData = [];
        const promises = [];
        const analytics = yield plenty.getAnalytics();
        for (const path of paths) {
            const pathArray = path.split(' ');
            swapData.push([]);
            for (let j = 0; j < pathArray.length - 1; j++) {
                promises.push((0, wrappers_1.loadSwapDataWrapper)(tezos, plenty, analytics, pathArray[j], pathArray[j + 1]));
            }
        }
        const responses = yield Promise.all(promises);
        let responseIndex = 0;
        for (let i = 0; i < paths.length; i++) {
            const path = paths[i].split(' ');
            for (let j = 0; j < path.length - 1; j++) {
                swapData[i][j] = responses[responseIndex++];
            }
        }
        return {
            paths,
            swapData
        };
    }
    catch (error) {
        logger_1.logger.error("Plenty: all paths error - ", error);
        return {
            paths: [],
            swapData: []
        };
    }
});
exports.allPaths = allPaths;
const allPathHelper = (src, dest, visited, psf, TOKEN, paths) => {
    if (src === dest) {
        paths.push(psf);
    }
    visited[src] = true;
    for (const x in TOKEN[src].pairs) {
        if (visited[TOKEN[src].pairs[x]] == false) {
            allPathHelper(TOKEN[src].pairs[x], dest, visited, psf + ' ' + TOKEN[src].pairs[x], TOKEN, paths);
        }
    }
    visited[src] = false;
};
const computeAllPaths = (plenty, paths, tokenInAmount, slippage, swapData) => {
    var _a, _b, _c;
    try {
        let bestPath;
        for (const i in paths) {
            const tokenInAmountArr = [];
            tokenInAmountArr.push(tokenInAmount);
            const fees = [];
            const minimumTokenOut = [];
            const feePerc = [];
            const priceImpact = [];
            const path = paths[i].split(' ');
            for (let j = 0; j < path.length - 1; j++) {
                const res = swapData[i][j];
                const output = (0, wrappers_1.calculateTokensOutWrapper)(plenty, tokenInAmountArr[j], res.exchangeFee, slippage, path[j], path[j + 1], res.tokenInSupply, res.tokenOutSupply, (_a = res.tokenInPrecision) !== null && _a !== void 0 ? _a : undefined, (_b = res.tokenOutPrecision) !== null && _b !== void 0 ? _b : undefined, (_c = res.target) !== null && _c !== void 0 ? _c : undefined);
                tokenInAmountArr.push(output.tokenOutAmount);
                minimumTokenOut.push(output.minimumOut);
                fees.push(output.fees);
                feePerc.push(output.feePerc);
                priceImpact.push(output.priceImpact);
            }
            if (bestPath) {
                if (tokenInAmountArr[tokenInAmountArr.length - 1].isGreaterThan(bestPath.tokenOutAmount)) {
                    bestPath.path = path;
                    bestPath.tokenOutAmount = tokenInAmountArr[tokenInAmountArr.length - 1];
                    bestPath.minimumTokenOut = minimumTokenOut;
                    bestPath.fees = fees;
                    bestPath.feePerc = feePerc;
                    bestPath.priceImpact = priceImpact;
                    bestPath.bestPathSwapData = swapData[i];
                }
            }
            else {
                bestPath = {
                    path: path,
                    tokenOutAmount: tokenInAmountArr[tokenInAmountArr.length - 1],
                    minimumTokenOut: minimumTokenOut,
                    fees: fees,
                    feePerc: feePerc,
                    priceImpact: priceImpact,
                    bestPathSwapData: swapData[i],
                };
            }
        }
        if (bestPath)
            return bestPath;
        else
            throw new Error('Can not calculate Route');
    }
    catch (error) {
        logger_1.logger.error('Plenty: compute all paths error - ', error);
        const bestPath = {
            path: [],
            bestPathSwapData: [],
            tokenOutAmount: new bignumber_js_1.default(0),
            minimumTokenOut: [],
            priceImpact: [],
            fees: [],
            feePerc: [],
        };
        return bestPath;
    }
};
exports.computeAllPaths = computeAllPaths;
const computeAllPathsReverse = (plenty, paths, tokenInAmount, slippage, swapData) => {
    var _a, _b, _c;
    try {
        let bestPath;
        for (const i in paths) {
            const tokenInAmountArr = [];
            tokenInAmountArr.push(tokenInAmount);
            const fees = [];
            const minimumTokenOut = [];
            const feePerc = [];
            const priceImpact = [];
            const path = paths[i].split(' ');
            for (let j = 0; j < path.length - 1; j++) {
                const res = swapData[i][j];
                const output = (0, wrappers_1.calculateTokensInWrapper)(plenty, tokenInAmountArr[j], res.exchangeFee, slippage, path[j], path[j + 1], res.tokenInSupply, res.tokenOutSupply, (_a = res.tokenInPrecision) !== null && _a !== void 0 ? _a : undefined, (_b = res.tokenOutPrecision) !== null && _b !== void 0 ? _b : undefined, (_c = res.target) !== null && _c !== void 0 ? _c : undefined);
                tokenInAmountArr.push(output.tokenOutAmount);
                minimumTokenOut.push(output.minimumOut);
                fees.push(output.fees);
                feePerc.push(output.feePerc);
                priceImpact.push(output.priceImpact);
            }
            if (bestPath) {
                if (tokenInAmountArr[tokenInAmountArr.length - 1].isGreaterThan(bestPath.tokenOutAmount)) {
                    bestPath.path = path;
                    bestPath.tokenOutAmount = tokenInAmountArr[tokenInAmountArr.length - 1];
                    bestPath.minimumTokenOut = minimumTokenOut;
                    bestPath.fees = fees;
                    bestPath.feePerc = feePerc;
                    bestPath.priceImpact = priceImpact;
                    bestPath.bestPathSwapData = swapData[i];
                }
            }
            else {
                bestPath = {
                    path: path,
                    tokenOutAmount: tokenInAmountArr[tokenInAmountArr.length - 1],
                    minimumTokenOut: minimumTokenOut,
                    fees: fees,
                    feePerc: feePerc,
                    priceImpact: priceImpact,
                    bestPathSwapData: swapData[i],
                };
            }
        }
        if (bestPath)
            return bestPath;
        else
            throw new Error('Can not calculate Route');
    }
    catch (error) {
        console.log(error);
        const bestPath = {
            path: [],
            bestPathSwapData: [],
            tokenOutAmount: new bignumber_js_1.default(0),
            minimumTokenOut: [],
            priceImpact: [],
            fees: [],
            feePerc: [],
        };
        return bestPath;
    }
};
exports.computeAllPathsReverse = computeAllPathsReverse;
//# sourceMappingURL=paths.js.map