"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTokensInGeneralStable = exports.calculateTokensInTezCtez = exports.calculateTokenInputVolatile = exports.calculateTokensOutGeneralStable = exports.calculateTokensOutTezCtez = exports.calculateTokenOutputVolatile = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const calculateTokenOutputVolatile = (tokenInAmount, tokenInSupply, tokenOutSupply, exchangeFee, slippage = '1/100', tokenOut) => {
    try {
        tokenInAmount = new bignumber_js_1.default(tokenInAmount);
        tokenInSupply = new bignumber_js_1.default(tokenInSupply);
        tokenOutSupply = new bignumber_js_1.default(tokenOutSupply);
        exchangeFee = new bignumber_js_1.default(exchangeFee);
        const feePerc = exchangeFee.multipliedBy(100);
        let tokenOutAmount = new bignumber_js_1.default(0);
        tokenOutAmount = new bignumber_js_1.default(1)
            .minus(exchangeFee)
            .multipliedBy(tokenOutSupply)
            .multipliedBy(tokenInAmount);
        tokenOutAmount = tokenOutAmount.dividedBy(tokenInSupply.plus(new bignumber_js_1.default(1).minus(exchangeFee).multipliedBy(tokenInAmount)));
        tokenOutAmount = new bignumber_js_1.default(tokenOutAmount.decimalPlaces(tokenOut.decimals, 1));
        const fees = tokenInAmount.multipliedBy(exchangeFee);
        let slippageNumerator = new bignumber_js_1.default(slippage.split("/")[0]);
        let slippageDenominator = new bignumber_js_1.default(slippage.split("/")[1]);
        slippageNumerator = slippageNumerator.multipliedBy(100).dividedBy(slippageDenominator);
        slippageDenominator = new bignumber_js_1.default(100);
        let minimumOut = tokenOutAmount.minus(tokenOutAmount.multipliedBy(slippageNumerator).dividedBy(slippageDenominator));
        minimumOut = new bignumber_js_1.default(minimumOut.decimalPlaces(tokenOut.decimals, 1));
        const updatedTokenInSupply = tokenInSupply.minus(tokenInAmount);
        const updatedTokenOutSupply = tokenOutSupply.minus(tokenOutAmount);
        let nextTokenOutAmount = new bignumber_js_1.default(1)
            .minus(exchangeFee)
            .multipliedBy(updatedTokenOutSupply)
            .multipliedBy(tokenInAmount);
        nextTokenOutAmount = nextTokenOutAmount.dividedBy(updatedTokenInSupply.plus(new bignumber_js_1.default(1).minus(exchangeFee).multipliedBy(tokenInAmount)));
        let priceImpact = tokenOutAmount
            .minus(nextTokenOutAmount)
            .dividedBy(tokenOutAmount);
        priceImpact = priceImpact.multipliedBy(100);
        priceImpact = priceImpact.absoluteValue();
        priceImpact = priceImpact.multipliedBy(100);
        const exchangeRate = tokenOutAmount.dividedBy(tokenInAmount);
        return {
            tokenOutAmount,
            fees,
            feePerc,
            minimumOut,
            exchangeRate,
            priceImpact,
        };
    }
    catch (error) {
        return {
            tokenOutAmount: new bignumber_js_1.default(0),
            fees: new bignumber_js_1.default(0),
            feePerc: new bignumber_js_1.default(0),
            minimumOut: new bignumber_js_1.default(0),
            exchangeRate: new bignumber_js_1.default(0),
            priceImpact: new bignumber_js_1.default(0),
            error
        };
    }
};
exports.calculateTokenOutputVolatile = calculateTokenOutputVolatile;
const calculateTokensOutTezCtez = (tezSupply, ctezSupply, tokenInAmount, pairFeeDenom, slippage = '1/100', target, tokenIn) => {
    tezSupply = new bignumber_js_1.default(tezSupply);
    ctezSupply = new bignumber_js_1.default(ctezSupply);
    tokenInAmount = new bignumber_js_1.default(tokenInAmount);
    pairFeeDenom = new bignumber_js_1.default(pairFeeDenom);
    target = new bignumber_js_1.default(target);
    const feePerc = new bignumber_js_1.default(100).dividedBy(pairFeeDenom);
    tokenInAmount = tokenInAmount.multipliedBy(new bignumber_js_1.default(10).pow(6));
    tezSupply = tezSupply.multipliedBy(new bignumber_js_1.default(10).pow(6));
    ctezSupply = ctezSupply.multipliedBy(new bignumber_js_1.default(10).pow(6));
    try {
        if (tokenIn === 'CTez') {
            const dy = newton_dx_to_dy(target.multipliedBy(ctezSupply), tezSupply.multipliedBy(new bignumber_js_1.default(2).pow(48)), tokenInAmount.multipliedBy(target), 5).dividedBy(new bignumber_js_1.default(2).pow(48));
            let fee = dy.dividedBy(pairFeeDenom);
            let tokenOut = dy.minus(fee);
            let slippageNumerator = new bignumber_js_1.default(slippage.split("/")[0]);
            let slippageDenominator = new bignumber_js_1.default(slippage.split("/")[1]);
            slippageNumerator = slippageNumerator.multipliedBy(100).dividedBy(slippageDenominator);
            slippageDenominator = new bignumber_js_1.default(100);
            let minOut = tokenOut.minus(tokenOut.multipliedBy(slippageNumerator).dividedBy(slippageDenominator));
            minOut = minOut.dividedBy(new bignumber_js_1.default(10).pow(6));
            const exchangeRate = tokenOut.dividedBy(tokenInAmount);
            const updatedCtezSupply = ctezSupply.plus(tokenInAmount);
            const updatedTezSupply = tezSupply.minus(tokenOut);
            const nextDy = newton_dx_to_dy(target.multipliedBy(updatedCtezSupply), updatedTezSupply.multipliedBy(new bignumber_js_1.default(2).pow(48)), tokenInAmount.multipliedBy(target), 5).dividedBy(new bignumber_js_1.default(2).pow(48));
            const nextFee = nextDy.dividedBy(pairFeeDenom);
            const nextTokenOut = nextDy.minus(nextFee);
            let priceImpact = tokenOut.minus(nextTokenOut).dividedBy(tokenOut);
            priceImpact = priceImpact.multipliedBy(100);
            priceImpact = new bignumber_js_1.default(Math.abs(Number(priceImpact)));
            const tokenOutAmount = new bignumber_js_1.default(tokenOut.dividedBy(new bignumber_js_1.default(10).pow(6)).decimalPlaces(6, 1));
            const fees = fee.dividedBy(new bignumber_js_1.default(10).pow(6));
            const minimumOut = new bignumber_js_1.default(minOut.decimalPlaces(6, 1));
            return {
                tokenOutAmount,
                fees,
                feePerc,
                minimumOut,
                exchangeRate,
                priceImpact,
            };
        }
        else if (tokenIn === 'XTZ') {
            const dy = newton_dx_to_dy(tezSupply.multipliedBy(new bignumber_js_1.default(2).pow(48)), target.multipliedBy(ctezSupply), tokenInAmount.multipliedBy(new bignumber_js_1.default(2).pow(48)), 5).dividedBy(target);
            let fee = dy.dividedBy(pairFeeDenom);
            let tokenOut = dy.minus(fee);
            let slippageNumerator = new bignumber_js_1.default(slippage.split("/")[0]);
            let slippageDenominator = new bignumber_js_1.default(slippage.split("/")[1]);
            slippageNumerator = slippageNumerator.multipliedBy(100).dividedBy(slippageDenominator);
            slippageDenominator = new bignumber_js_1.default(100);
            let minOut = tokenOut.minus(tokenOut.multipliedBy(slippageNumerator).dividedBy(slippageDenominator));
            minOut = minOut.dividedBy(new bignumber_js_1.default(10).pow(6));
            const exchangeRate = tokenOut.dividedBy(tokenInAmount);
            const updatedCtezSupply = ctezSupply.minus(tokenOut);
            const updatedTezSupply = tezSupply.plus(tokenInAmount);
            const nextDy = newton_dx_to_dy(updatedTezSupply.multipliedBy(new bignumber_js_1.default(2).pow(48)), target.multipliedBy(updatedCtezSupply), tokenInAmount.multipliedBy(new bignumber_js_1.default(2).pow(48)), 5).dividedBy(target);
            const nextFee = nextDy.dividedBy(pairFeeDenom);
            const nextTokenOut = nextDy.minus(nextFee);
            let priceImpact = tokenOut.minus(nextTokenOut).dividedBy(tokenOut);
            priceImpact = priceImpact.multipliedBy(100);
            priceImpact = new bignumber_js_1.default(Math.abs(Number(priceImpact)));
            const tokenOutAmount = new bignumber_js_1.default(tokenOut.dividedBy(new bignumber_js_1.default(10).pow(6)).decimalPlaces(6, 1));
            const fees = fee.dividedBy(new bignumber_js_1.default(10).pow(6));
            const minimumOut = new bignumber_js_1.default(minOut.decimalPlaces(6, 1));
            return {
                tokenOutAmount,
                fees,
                feePerc,
                minimumOut,
                exchangeRate,
                priceImpact,
            };
        }
        return {
            tokenOutAmount: new bignumber_js_1.default(0),
            fees: new bignumber_js_1.default(0),
            feePerc: new bignumber_js_1.default(0),
            minimumOut: new bignumber_js_1.default(0),
            exchangeRate: new bignumber_js_1.default(0),
            priceImpact: new bignumber_js_1.default(0),
        };
    }
    catch (error) {
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
exports.calculateTokensOutTezCtez = calculateTokensOutTezCtez;
const calculateTokensOutGeneralStable = (tokenInSupply, tokenOutSupply, tokenInAmount, Exchangefee, slippage = "1/100", tokenIn, tokenOut, tokenInPrecision, tokenOutPrecision) => {
    const feePerc = new bignumber_js_1.default(100).dividedBy(Exchangefee);
    tokenInSupply = new bignumber_js_1.default(tokenInSupply);
    tokenOutSupply = new bignumber_js_1.default(tokenOutSupply);
    tokenInAmount = new bignumber_js_1.default(tokenInAmount);
    Exchangefee = new bignumber_js_1.default(Exchangefee);
    tokenInAmount = tokenInAmount.multipliedBy(new bignumber_js_1.default(10).pow(tokenIn.decimals));
    tokenInSupply = tokenInSupply.multipliedBy(new bignumber_js_1.default(10).pow(tokenIn.decimals));
    tokenOutSupply = tokenOutSupply.multipliedBy(new bignumber_js_1.default(10).pow(tokenOut.decimals));
    try {
        tokenInSupply = tokenInSupply.multipliedBy(tokenInPrecision);
        tokenOutSupply = tokenOutSupply.multipliedBy(tokenOutPrecision);
        const dy = newton_dx_to_dy(tokenInSupply, tokenOutSupply, tokenInAmount.multipliedBy(tokenInPrecision), 5);
        let fee = dy.dividedBy(Exchangefee);
        let tokenOutAmt = dy.minus(fee).dividedBy(tokenOutPrecision);
        let slippageNumerator = new bignumber_js_1.default(slippage.split("/")[0]);
        let slippageDenominator = new bignumber_js_1.default(slippage.split("/")[1]);
        slippageNumerator = slippageNumerator.multipliedBy(100).dividedBy(slippageDenominator);
        slippageDenominator = new bignumber_js_1.default(100);
        let minOut = tokenOutAmt.minus(tokenOutAmt.multipliedBy(slippageNumerator).dividedBy(slippageDenominator));
        minOut = minOut.dividedBy(new bignumber_js_1.default(10).pow(tokenOut.decimals));
        const updatedTokenInPool = tokenInSupply.plus(tokenInAmount);
        const updatedTokenOutPool = tokenOutSupply.minus(tokenOutAmt);
        const nextDy = newton_dx_to_dy(updatedTokenInPool, updatedTokenOutPool, tokenInAmount.multipliedBy(tokenInPrecision), 5);
        const nextFee = nextDy.dividedBy(Exchangefee);
        const nextTokenOut = nextDy.minus(nextFee).dividedBy(tokenOutPrecision);
        let priceImpact = tokenOutAmt.minus(nextTokenOut).dividedBy(tokenOutAmt);
        priceImpact = priceImpact.multipliedBy(100);
        priceImpact = new bignumber_js_1.default(Math.abs(Number(priceImpact)));
        tokenOutAmt = tokenOutAmt.dividedBy(new bignumber_js_1.default(10).pow(tokenOut.decimals));
        fee = fee.dividedBy(tokenOutPrecision);
        fee = fee.dividedBy(new bignumber_js_1.default(10).pow(tokenOut.decimals));
        const tokenOutAmount = new bignumber_js_1.default(tokenOutAmt.decimalPlaces(tokenOut.decimals, 1));
        const minimumOut = new bignumber_js_1.default(minOut.decimalPlaces(tokenOut.decimals, 1));
        const fees = fee;
        const exchangeRate = tokenOutAmount.dividedBy(tokenInAmount.dividedBy(new bignumber_js_1.default(10).pow(tokenIn.decimals)));
        return {
            tokenOutAmount,
            fees,
            feePerc,
            minimumOut,
            exchangeRate,
            priceImpact,
        };
    }
    catch (error) {
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
exports.calculateTokensOutGeneralStable = calculateTokensOutGeneralStable;
const calculateTokenInputVolatile = (tokenInAmount, tokenInSupply, tokenOutSupply, exchangeFee, slippage = '1/100', tokenIn, tokenOut) => {
    try {
        const feePerc = exchangeFee.multipliedBy(100);
        let tokenOutAmount = new bignumber_js_1.default(0);
        tokenInAmount = tokenInAmount.multipliedBy(new bignumber_js_1.default(10).pow(tokenIn.decimals));
        tokenInSupply = tokenInSupply.multipliedBy(new bignumber_js_1.default(10).pow(tokenIn.decimals));
        tokenOutSupply = tokenOutSupply.multipliedBy(new bignumber_js_1.default(10).pow(tokenOut.decimals));
        let fee = tokenInAmount.multipliedBy(exchangeFee);
        tokenInAmount = tokenInAmount.plus(fee);
        let invariant = tokenInSupply.multipliedBy(tokenOutSupply);
        tokenOutAmount = (invariant.dividedBy(tokenInSupply.minus(tokenInAmount))).minus(tokenOutSupply);
        tokenInAmount = tokenInAmount.dividedBy(new bignumber_js_1.default(10).pow(tokenIn.decimals));
        tokenInSupply = tokenInSupply.dividedBy(new bignumber_js_1.default(10).pow(tokenIn.decimals));
        tokenOutSupply = tokenOutSupply.dividedBy(new bignumber_js_1.default(10).pow(tokenOut.decimals));
        tokenOutAmount = tokenOutAmount.dividedBy(new bignumber_js_1.default(10).pow(tokenOut.decimals));
        tokenOutAmount = new bignumber_js_1.default(tokenOutAmount.decimalPlaces(tokenOut.decimals, 1));
        const fees = tokenInAmount.multipliedBy(exchangeFee);
        let slippageNumerator = new bignumber_js_1.default(slippage.split("/")[0]);
        let slippageDenominator = new bignumber_js_1.default(slippage.split("/")[1]);
        slippageNumerator = slippageNumerator.multipliedBy(100).dividedBy(slippageDenominator);
        slippageDenominator = new bignumber_js_1.default(100);
        let minimumOut = tokenOutAmount.minus(tokenOutAmount.multipliedBy(slippageNumerator).dividedBy(slippageDenominator));
        minimumOut = new bignumber_js_1.default(minimumOut.decimalPlaces(tokenOut.decimals, 1));
        const updatedTokenInSupply = tokenInSupply.minus(tokenInAmount);
        const updatedTokenOutSupply = tokenOutSupply.minus(tokenOutAmount);
        let nextTokenOutAmount = new bignumber_js_1.default(1)
            .minus(exchangeFee)
            .multipliedBy(updatedTokenOutSupply)
            .multipliedBy(tokenInAmount);
        nextTokenOutAmount = nextTokenOutAmount.dividedBy(updatedTokenInSupply.plus(new bignumber_js_1.default(1).minus(exchangeFee).multipliedBy(tokenInAmount)));
        let priceImpact = tokenOutAmount
            .minus(nextTokenOutAmount)
            .dividedBy(tokenOutAmount);
        priceImpact = priceImpact.multipliedBy(100);
        priceImpact = priceImpact.absoluteValue();
        priceImpact = priceImpact.multipliedBy(100);
        const exchangeRate = tokenOutAmount.dividedBy(tokenInAmount);
        return {
            tokenOutAmount,
            fees,
            feePerc,
            minimumOut,
            exchangeRate,
            priceImpact,
        };
    }
    catch (error) {
        return {
            tokenOutAmount: new bignumber_js_1.default(0),
            fees: new bignumber_js_1.default(0),
            feePerc: new bignumber_js_1.default(0),
            minimumOut: new bignumber_js_1.default(0),
            exchangeRate: new bignumber_js_1.default(0),
            priceImpact: new bignumber_js_1.default(0),
            error
        };
    }
};
exports.calculateTokenInputVolatile = calculateTokenInputVolatile;
const calculateTokensInTezCtez = (tezSupply, ctezSupply, tokenInAmount, pairFeeDenom, slippage = '1/100', target, tokenIn) => {
    const feePerc = new bignumber_js_1.default(100).dividedBy(pairFeeDenom);
    tokenInAmount = tokenInAmount.multipliedBy(new bignumber_js_1.default(10).pow(6));
    tezSupply = tezSupply.multipliedBy(new bignumber_js_1.default(10).pow(6));
    ctezSupply = ctezSupply.multipliedBy(new bignumber_js_1.default(10).pow(6));
    try {
        if (tokenIn === 'CTez') {
            const dy = newton_dx_to_dy(target.multipliedBy(ctezSupply), tezSupply.multipliedBy(new bignumber_js_1.default(2).pow(48)), tokenInAmount.multipliedBy(new bignumber_js_1.default(1000).dividedBy(999)).multipliedBy(target), 5).dividedBy(new bignumber_js_1.default(2).pow(48));
            let fee = dy.dividedBy(pairFeeDenom);
            let tokenOut = dy;
            let slippageNumerator = new bignumber_js_1.default(slippage.split("/")[0]);
            let slippageDenominator = new bignumber_js_1.default(slippage.split("/")[1]);
            slippageNumerator = slippageNumerator.multipliedBy(100).dividedBy(slippageDenominator);
            slippageDenominator = new bignumber_js_1.default(100);
            let minOut = tokenOut.minus(tokenOut.multipliedBy(slippageNumerator).dividedBy(slippageDenominator));
            minOut = minOut.dividedBy(new bignumber_js_1.default(10).pow(6));
            const exchangeRate = tokenOut.dividedBy(tokenInAmount);
            const updatedCtezSupply = ctezSupply.plus(tokenInAmount);
            const updatedTezSupply = tezSupply.minus(tokenOut);
            const nextDy = newton_dx_to_dy(target.multipliedBy(updatedCtezSupply), updatedTezSupply.multipliedBy(new bignumber_js_1.default(2).pow(48)), tokenInAmount.multipliedBy(new bignumber_js_1.default(1000).dividedBy(999)).multipliedBy(target), 5).dividedBy(new bignumber_js_1.default(2).pow(48));
            const nextFee = nextDy.dividedBy(pairFeeDenom);
            const nextTokenOut = nextDy.minus(nextFee);
            let priceImpact = tokenOut.minus(nextTokenOut).dividedBy(tokenOut);
            priceImpact = priceImpact.multipliedBy(100);
            priceImpact = new bignumber_js_1.default(Math.abs(Number(priceImpact)));
            const tokenOutAmount = new bignumber_js_1.default(tokenOut.dividedBy(new bignumber_js_1.default(10).pow(6)).decimalPlaces(6, 1));
            const fees = fee.dividedBy(new bignumber_js_1.default(10).pow(6));
            const minimumOut = new bignumber_js_1.default(minOut.decimalPlaces(6, 1));
            return {
                tokenOutAmount,
                fees,
                feePerc,
                minimumOut,
                exchangeRate,
                priceImpact,
            };
        }
        else if (tokenIn === 'XTZ') {
            const dy = newton_dx_to_dy(tezSupply.multipliedBy(new bignumber_js_1.default(2).pow(48)), target.multipliedBy(ctezSupply), tokenInAmount.multipliedBy(new bignumber_js_1.default(1000).dividedBy(999)).multipliedBy(new bignumber_js_1.default(2).pow(48)), 5).dividedBy(target);
            let fee = dy.dividedBy(pairFeeDenom);
            let tokenOut = dy;
            let slippageNumerator = new bignumber_js_1.default(slippage.split("/")[0]);
            let slippageDenominator = new bignumber_js_1.default(slippage.split("/")[1]);
            slippageNumerator = slippageNumerator.multipliedBy(100).dividedBy(slippageDenominator);
            slippageDenominator = new bignumber_js_1.default(100);
            let minOut = tokenOut.minus(tokenOut.multipliedBy(slippageNumerator).dividedBy(slippageDenominator));
            minOut = minOut.dividedBy(new bignumber_js_1.default(10).pow(6));
            const exchangeRate = tokenOut.dividedBy(tokenInAmount);
            const updatedCtezSupply = ctezSupply.minus(tokenOut);
            const updatedTezSupply = tezSupply.plus(tokenInAmount);
            const nextDy = newton_dx_to_dy(updatedTezSupply.multipliedBy(new bignumber_js_1.default(2).pow(48)), target.multipliedBy(updatedCtezSupply), tokenInAmount.multipliedBy(new bignumber_js_1.default(1000).dividedBy(999)).multipliedBy(new bignumber_js_1.default(2).pow(48)), 5).dividedBy(target);
            const nextFee = nextDy.dividedBy(pairFeeDenom);
            const nextTokenOut = nextDy.minus(nextFee);
            let priceImpact = tokenOut.minus(nextTokenOut).dividedBy(tokenOut);
            priceImpact = priceImpact.multipliedBy(100);
            priceImpact = new bignumber_js_1.default(Math.abs(Number(priceImpact)));
            const tokenOutAmount = new bignumber_js_1.default(tokenOut.dividedBy(new bignumber_js_1.default(10).pow(6)).decimalPlaces(6, 1));
            const fees = fee.dividedBy(new bignumber_js_1.default(10).pow(6));
            const minimumOut = new bignumber_js_1.default(minOut.decimalPlaces(6, 1));
            return {
                tokenOutAmount,
                fees,
                feePerc,
                minimumOut,
                exchangeRate,
                priceImpact,
            };
        }
        return {
            tokenOutAmount: new bignumber_js_1.default(0),
            fees: new bignumber_js_1.default(0),
            feePerc: new bignumber_js_1.default(0),
            minimumOut: new bignumber_js_1.default(0),
            exchangeRate: new bignumber_js_1.default(0),
            priceImpact: new bignumber_js_1.default(0),
        };
    }
    catch (error) {
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
exports.calculateTokensInTezCtez = calculateTokensInTezCtez;
const calculateTokensInGeneralStable = (tokenInSupply, tokenOutSupply, tokenInAmount, Exchangefee, slippage = "1/100", tokenIn, tokenOut, tokenInPrecision, tokenOutPrecision) => {
    const feePerc = new bignumber_js_1.default(100).dividedBy(Exchangefee);
    tokenInAmount = tokenInAmount.multipliedBy(new bignumber_js_1.default(10).pow(tokenIn.decimals));
    tokenInSupply = tokenInSupply.multipliedBy(new bignumber_js_1.default(10).pow(tokenIn.decimals));
    tokenOutSupply = tokenOutSupply.multipliedBy(new bignumber_js_1.default(10).pow(tokenOut.decimals));
    try {
        tokenInSupply = tokenInSupply.multipliedBy(tokenInPrecision);
        tokenOutSupply = tokenOutSupply.multipliedBy(tokenOutPrecision);
        const dy = newton_dx_to_dy(tokenInSupply, tokenOutSupply, tokenInAmount.multipliedBy(new bignumber_js_1.default(1000).dividedBy(999)).multipliedBy(tokenInPrecision), 5);
        let fee = dy.dividedBy(Exchangefee);
        let tokenOutAmt = dy.dividedBy(tokenOutPrecision);
        let slippageNumerator = new bignumber_js_1.default(slippage.split("/")[0]);
        let slippageDenominator = new bignumber_js_1.default(slippage.split("/")[1]);
        slippageNumerator = slippageNumerator.multipliedBy(100).dividedBy(slippageDenominator);
        slippageDenominator = new bignumber_js_1.default(100);
        let minOut = tokenOutAmt.minus(tokenOutAmt.multipliedBy(slippageNumerator).dividedBy(slippageDenominator));
        minOut = minOut.dividedBy(new bignumber_js_1.default(10).pow(tokenOut.decimals));
        const updatedTokenInPool = tokenInSupply.plus(tokenInAmount);
        const updatedTokenOutPool = tokenOutSupply.minus(tokenOutAmt);
        const nextDy = newton_dx_to_dy(updatedTokenInPool, updatedTokenOutPool, tokenInAmount.multipliedBy(new bignumber_js_1.default(1000).dividedBy(999)).multipliedBy(tokenInPrecision), 5);
        const nextFee = nextDy.dividedBy(Exchangefee);
        const nextTokenOut = nextDy.minus(nextFee).dividedBy(tokenOutPrecision);
        let priceImpact = tokenOutAmt.minus(nextTokenOut).dividedBy(tokenOutAmt);
        priceImpact = priceImpact.multipliedBy(100);
        priceImpact = new bignumber_js_1.default(Math.abs(Number(priceImpact)));
        tokenOutAmt = tokenOutAmt.dividedBy(new bignumber_js_1.default(10).pow(tokenOut.decimals));
        fee = fee.dividedBy(tokenOutPrecision);
        fee = fee.dividedBy(new bignumber_js_1.default(10).pow(tokenOut.decimals));
        const tokenOutAmount = new bignumber_js_1.default(tokenOutAmt.decimalPlaces(tokenOut.decimals, 1));
        const minimumOut = new bignumber_js_1.default(minOut.decimalPlaces(tokenOut.decimals, 1));
        const fees = fee;
        const exchangeRate = tokenOutAmount.dividedBy(tokenInAmount.dividedBy(new bignumber_js_1.default(10).pow(tokenIn.decimals)));
        return {
            tokenOutAmount,
            fees,
            feePerc,
            minimumOut,
            exchangeRate,
            priceImpact,
        };
    }
    catch (error) {
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
exports.calculateTokensInGeneralStable = calculateTokensInGeneralStable;
const newton_dx_to_dy = (x, y, dx, rounds) => {
    const utility = util(x, y);
    const u = utility.first;
    const dy = newton(x, y, dx, new bignumber_js_1.default(0), u, rounds);
    return dy;
};
const util = (x, y) => {
    const plus = x.plus(y);
    const minus = x.minus(y);
    const plus2 = plus.multipliedBy(plus);
    const plus4 = plus2.multipliedBy(plus2);
    const plus8 = plus4.multipliedBy(plus4);
    const plus7 = plus4.multipliedBy(plus2).multipliedBy(plus);
    const minus2 = minus.multipliedBy(minus);
    const minus4 = minus2.multipliedBy(minus2);
    const minus8 = minus4.multipliedBy(minus4);
    const minus7 = minus4.multipliedBy(minus2).multipliedBy(minus);
    return {
        first: plus8.minus(minus8),
        second: new bignumber_js_1.default(8).multipliedBy(minus7.plus(plus7)),
    };
};
const newton = (x, y, dx, dy, u, n) => {
    let dy1 = dy;
    let newUtil = util(x.plus(dx), y.minus(dy));
    let newU = newUtil.first;
    let newDuDy = newUtil.second;
    while (n !== 0) {
        newUtil = util(x.plus(dx), y.minus(dy1));
        newU = newUtil.first;
        newDuDy = newUtil.second;
        dy1 = dy1.plus(newU.minus(u).dividedBy(newDuDy));
        n = n - 1;
    }
    return dy1;
};
//# sourceMappingURL=pricing.js.map