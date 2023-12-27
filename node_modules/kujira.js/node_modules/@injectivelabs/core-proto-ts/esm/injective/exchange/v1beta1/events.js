/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Coin } from "../../../cosmos/base/v1beta1/coin";
import { AccountRewards, BinaryOptionsMarket, CampaignRewardPool, DepositUpdate, DerivativeLimitOrder, DerivativeMarket, DerivativeMarketOrder, DerivativeOrder, DerivativeTradeLog, executionTypeFromJSON, executionTypeToJSON, ExpiryFuturesMarketInfo, FeeDiscountSchedule, Level, MarketFeeMultiplier, PerpetualMarketFunding, PerpetualMarketInfo, SpotLimitOrder, SpotMarket, SubaccountPosition, TradeLog, TradingRewardCampaignInfo, } from "./exchange";
function createBaseEventBatchSpotExecution() {
    return { marketId: "", isBuy: false, executionType: 0, trades: [] };
}
export const EventBatchSpotExecution = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.marketId !== "") {
            writer.uint32(10).string(message.marketId);
        }
        if (message.isBuy === true) {
            writer.uint32(16).bool(message.isBuy);
        }
        if (message.executionType !== 0) {
            writer.uint32(24).int32(message.executionType);
        }
        for (const v of message.trades) {
            TradeLog.encode(v, writer.uint32(34).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEventBatchSpotExecution();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.marketId = reader.string();
                    continue;
                case 2:
                    if (tag !== 16) {
                        break;
                    }
                    message.isBuy = reader.bool();
                    continue;
                case 3:
                    if (tag !== 24) {
                        break;
                    }
                    message.executionType = reader.int32();
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.trades.push(TradeLog.decode(reader, reader.uint32()));
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            marketId: isSet(object.marketId) ? String(object.marketId) : "",
            isBuy: isSet(object.isBuy) ? Boolean(object.isBuy) : false,
            executionType: isSet(object.executionType) ? executionTypeFromJSON(object.executionType) : 0,
            trades: Array.isArray(object === null || object === void 0 ? void 0 : object.trades) ? object.trades.map((e) => TradeLog.fromJSON(e)) : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.marketId !== undefined && (obj.marketId = message.marketId);
        message.isBuy !== undefined && (obj.isBuy = message.isBuy);
        message.executionType !== undefined && (obj.executionType = executionTypeToJSON(message.executionType));
        if (message.trades) {
            obj.trades = message.trades.map((e) => e ? TradeLog.toJSON(e) : undefined);
        }
        else {
            obj.trades = [];
        }
        return obj;
    },
    create(base) {
        return EventBatchSpotExecution.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaseEventBatchSpotExecution();
        message.marketId = (_a = object.marketId) !== null && _a !== void 0 ? _a : "";
        message.isBuy = (_b = object.isBuy) !== null && _b !== void 0 ? _b : false;
        message.executionType = (_c = object.executionType) !== null && _c !== void 0 ? _c : 0;
        message.trades = ((_d = object.trades) === null || _d === void 0 ? void 0 : _d.map((e) => TradeLog.fromPartial(e))) || [];
        return message;
    },
};
function createBaseEventBatchDerivativeExecution() {
    return { marketId: "", isBuy: false, isLiquidation: false, cumulativeFunding: "", executionType: 0, trades: [] };
}
export const EventBatchDerivativeExecution = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.marketId !== "") {
            writer.uint32(10).string(message.marketId);
        }
        if (message.isBuy === true) {
            writer.uint32(16).bool(message.isBuy);
        }
        if (message.isLiquidation === true) {
            writer.uint32(24).bool(message.isLiquidation);
        }
        if (message.cumulativeFunding !== "") {
            writer.uint32(34).string(message.cumulativeFunding);
        }
        if (message.executionType !== 0) {
            writer.uint32(40).int32(message.executionType);
        }
        for (const v of message.trades) {
            DerivativeTradeLog.encode(v, writer.uint32(50).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEventBatchDerivativeExecution();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.marketId = reader.string();
                    continue;
                case 2:
                    if (tag !== 16) {
                        break;
                    }
                    message.isBuy = reader.bool();
                    continue;
                case 3:
                    if (tag !== 24) {
                        break;
                    }
                    message.isLiquidation = reader.bool();
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.cumulativeFunding = reader.string();
                    continue;
                case 5:
                    if (tag !== 40) {
                        break;
                    }
                    message.executionType = reader.int32();
                    continue;
                case 6:
                    if (tag !== 50) {
                        break;
                    }
                    message.trades.push(DerivativeTradeLog.decode(reader, reader.uint32()));
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            marketId: isSet(object.marketId) ? String(object.marketId) : "",
            isBuy: isSet(object.isBuy) ? Boolean(object.isBuy) : false,
            isLiquidation: isSet(object.isLiquidation) ? Boolean(object.isLiquidation) : false,
            cumulativeFunding: isSet(object.cumulativeFunding) ? String(object.cumulativeFunding) : "",
            executionType: isSet(object.executionType) ? executionTypeFromJSON(object.executionType) : 0,
            trades: Array.isArray(object === null || object === void 0 ? void 0 : object.trades) ? object.trades.map((e) => DerivativeTradeLog.fromJSON(e)) : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.marketId !== undefined && (obj.marketId = message.marketId);
        message.isBuy !== undefined && (obj.isBuy = message.isBuy);
        message.isLiquidation !== undefined && (obj.isLiquidation = message.isLiquidation);
        message.cumulativeFunding !== undefined && (obj.cumulativeFunding = message.cumulativeFunding);
        message.executionType !== undefined && (obj.executionType = executionTypeToJSON(message.executionType));
        if (message.trades) {
            obj.trades = message.trades.map((e) => e ? DerivativeTradeLog.toJSON(e) : undefined);
        }
        else {
            obj.trades = [];
        }
        return obj;
    },
    create(base) {
        return EventBatchDerivativeExecution.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f;
        const message = createBaseEventBatchDerivativeExecution();
        message.marketId = (_a = object.marketId) !== null && _a !== void 0 ? _a : "";
        message.isBuy = (_b = object.isBuy) !== null && _b !== void 0 ? _b : false;
        message.isLiquidation = (_c = object.isLiquidation) !== null && _c !== void 0 ? _c : false;
        message.cumulativeFunding = (_d = object.cumulativeFunding) !== null && _d !== void 0 ? _d : "";
        message.executionType = (_e = object.executionType) !== null && _e !== void 0 ? _e : 0;
        message.trades = ((_f = object.trades) === null || _f === void 0 ? void 0 : _f.map((e) => DerivativeTradeLog.fromPartial(e))) || [];
        return message;
    },
};
function createBaseEventLostFundsFromLiquidation() {
    return {
        marketId: "",
        subaccountId: new Uint8Array(),
        lostFundsFromAvailableDuringPayout: "",
        lostFundsFromOrderCancels: "",
    };
}
export const EventLostFundsFromLiquidation = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.marketId !== "") {
            writer.uint32(10).string(message.marketId);
        }
        if (message.subaccountId.length !== 0) {
            writer.uint32(18).bytes(message.subaccountId);
        }
        if (message.lostFundsFromAvailableDuringPayout !== "") {
            writer.uint32(26).string(message.lostFundsFromAvailableDuringPayout);
        }
        if (message.lostFundsFromOrderCancels !== "") {
            writer.uint32(34).string(message.lostFundsFromOrderCancels);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEventLostFundsFromLiquidation();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.marketId = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.subaccountId = reader.bytes();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.lostFundsFromAvailableDuringPayout = reader.string();
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.lostFundsFromOrderCancels = reader.string();
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            marketId: isSet(object.marketId) ? String(object.marketId) : "",
            subaccountId: isSet(object.subaccountId) ? bytesFromBase64(object.subaccountId) : new Uint8Array(),
            lostFundsFromAvailableDuringPayout: isSet(object.lostFundsFromAvailableDuringPayout)
                ? String(object.lostFundsFromAvailableDuringPayout)
                : "",
            lostFundsFromOrderCancels: isSet(object.lostFundsFromOrderCancels)
                ? String(object.lostFundsFromOrderCancels)
                : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.marketId !== undefined && (obj.marketId = message.marketId);
        message.subaccountId !== undefined &&
            (obj.subaccountId = base64FromBytes(message.subaccountId !== undefined ? message.subaccountId : new Uint8Array()));
        message.lostFundsFromAvailableDuringPayout !== undefined &&
            (obj.lostFundsFromAvailableDuringPayout = message.lostFundsFromAvailableDuringPayout);
        message.lostFundsFromOrderCancels !== undefined &&
            (obj.lostFundsFromOrderCancels = message.lostFundsFromOrderCancels);
        return obj;
    },
    create(base) {
        return EventLostFundsFromLiquidation.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaseEventLostFundsFromLiquidation();
        message.marketId = (_a = object.marketId) !== null && _a !== void 0 ? _a : "";
        message.subaccountId = (_b = object.subaccountId) !== null && _b !== void 0 ? _b : new Uint8Array();
        message.lostFundsFromAvailableDuringPayout = (_c = object.lostFundsFromAvailableDuringPayout) !== null && _c !== void 0 ? _c : "";
        message.lostFundsFromOrderCancels = (_d = object.lostFundsFromOrderCancels) !== null && _d !== void 0 ? _d : "";
        return message;
    },
};
function createBaseEventBatchDerivativePosition() {
    return { marketId: "", positions: [] };
}
export const EventBatchDerivativePosition = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.marketId !== "") {
            writer.uint32(10).string(message.marketId);
        }
        for (const v of message.positions) {
            SubaccountPosition.encode(v, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEventBatchDerivativePosition();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.marketId = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.positions.push(SubaccountPosition.decode(reader, reader.uint32()));
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            marketId: isSet(object.marketId) ? String(object.marketId) : "",
            positions: Array.isArray(object === null || object === void 0 ? void 0 : object.positions)
                ? object.positions.map((e) => SubaccountPosition.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.marketId !== undefined && (obj.marketId = message.marketId);
        if (message.positions) {
            obj.positions = message.positions.map((e) => e ? SubaccountPosition.toJSON(e) : undefined);
        }
        else {
            obj.positions = [];
        }
        return obj;
    },
    create(base) {
        return EventBatchDerivativePosition.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseEventBatchDerivativePosition();
        message.marketId = (_a = object.marketId) !== null && _a !== void 0 ? _a : "";
        message.positions = ((_b = object.positions) === null || _b === void 0 ? void 0 : _b.map((e) => SubaccountPosition.fromPartial(e))) || [];
        return message;
    },
};
function createBaseEventDerivativeMarketPaused() {
    return { marketId: "", settlePrice: "", totalMissingFunds: "", missingFundsRate: "" };
}
export const EventDerivativeMarketPaused = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.marketId !== "") {
            writer.uint32(10).string(message.marketId);
        }
        if (message.settlePrice !== "") {
            writer.uint32(18).string(message.settlePrice);
        }
        if (message.totalMissingFunds !== "") {
            writer.uint32(26).string(message.totalMissingFunds);
        }
        if (message.missingFundsRate !== "") {
            writer.uint32(34).string(message.missingFundsRate);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEventDerivativeMarketPaused();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.marketId = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.settlePrice = reader.string();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.totalMissingFunds = reader.string();
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.missingFundsRate = reader.string();
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            marketId: isSet(object.marketId) ? String(object.marketId) : "",
            settlePrice: isSet(object.settlePrice) ? String(object.settlePrice) : "",
            totalMissingFunds: isSet(object.totalMissingFunds) ? String(object.totalMissingFunds) : "",
            missingFundsRate: isSet(object.missingFundsRate) ? String(object.missingFundsRate) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.marketId !== undefined && (obj.marketId = message.marketId);
        message.settlePrice !== undefined && (obj.settlePrice = message.settlePrice);
        message.totalMissingFunds !== undefined && (obj.totalMissingFunds = message.totalMissingFunds);
        message.missingFundsRate !== undefined && (obj.missingFundsRate = message.missingFundsRate);
        return obj;
    },
    create(base) {
        return EventDerivativeMarketPaused.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaseEventDerivativeMarketPaused();
        message.marketId = (_a = object.marketId) !== null && _a !== void 0 ? _a : "";
        message.settlePrice = (_b = object.settlePrice) !== null && _b !== void 0 ? _b : "";
        message.totalMissingFunds = (_c = object.totalMissingFunds) !== null && _c !== void 0 ? _c : "";
        message.missingFundsRate = (_d = object.missingFundsRate) !== null && _d !== void 0 ? _d : "";
        return message;
    },
};
function createBaseEventMarketBeyondBankruptcy() {
    return { marketId: "", settlePrice: "", missingMarketFunds: "" };
}
export const EventMarketBeyondBankruptcy = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.marketId !== "") {
            writer.uint32(10).string(message.marketId);
        }
        if (message.settlePrice !== "") {
            writer.uint32(18).string(message.settlePrice);
        }
        if (message.missingMarketFunds !== "") {
            writer.uint32(26).string(message.missingMarketFunds);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEventMarketBeyondBankruptcy();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.marketId = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.settlePrice = reader.string();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.missingMarketFunds = reader.string();
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            marketId: isSet(object.marketId) ? String(object.marketId) : "",
            settlePrice: isSet(object.settlePrice) ? String(object.settlePrice) : "",
            missingMarketFunds: isSet(object.missingMarketFunds) ? String(object.missingMarketFunds) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.marketId !== undefined && (obj.marketId = message.marketId);
        message.settlePrice !== undefined && (obj.settlePrice = message.settlePrice);
        message.missingMarketFunds !== undefined && (obj.missingMarketFunds = message.missingMarketFunds);
        return obj;
    },
    create(base) {
        return EventMarketBeyondBankruptcy.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseEventMarketBeyondBankruptcy();
        message.marketId = (_a = object.marketId) !== null && _a !== void 0 ? _a : "";
        message.settlePrice = (_b = object.settlePrice) !== null && _b !== void 0 ? _b : "";
        message.missingMarketFunds = (_c = object.missingMarketFunds) !== null && _c !== void 0 ? _c : "";
        return message;
    },
};
function createBaseEventAllPositionsHaircut() {
    return { marketId: "", settlePrice: "", missingFundsRate: "" };
}
export const EventAllPositionsHaircut = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.marketId !== "") {
            writer.uint32(10).string(message.marketId);
        }
        if (message.settlePrice !== "") {
            writer.uint32(18).string(message.settlePrice);
        }
        if (message.missingFundsRate !== "") {
            writer.uint32(26).string(message.missingFundsRate);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEventAllPositionsHaircut();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.marketId = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.settlePrice = reader.string();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.missingFundsRate = reader.string();
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            marketId: isSet(object.marketId) ? String(object.marketId) : "",
            settlePrice: isSet(object.settlePrice) ? String(object.settlePrice) : "",
            missingFundsRate: isSet(object.missingFundsRate) ? String(object.missingFundsRate) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.marketId !== undefined && (obj.marketId = message.marketId);
        message.settlePrice !== undefined && (obj.settlePrice = message.settlePrice);
        message.missingFundsRate !== undefined && (obj.missingFundsRate = message.missingFundsRate);
        return obj;
    },
    create(base) {
        return EventAllPositionsHaircut.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseEventAllPositionsHaircut();
        message.marketId = (_a = object.marketId) !== null && _a !== void 0 ? _a : "";
        message.settlePrice = (_b = object.settlePrice) !== null && _b !== void 0 ? _b : "";
        message.missingFundsRate = (_c = object.missingFundsRate) !== null && _c !== void 0 ? _c : "";
        return message;
    },
};
function createBaseEventBinaryOptionsMarketUpdate() {
    return { market: undefined };
}
export const EventBinaryOptionsMarketUpdate = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.market !== undefined) {
            BinaryOptionsMarket.encode(message.market, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEventBinaryOptionsMarketUpdate();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.market = BinaryOptionsMarket.decode(reader, reader.uint32());
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return { market: isSet(object.market) ? BinaryOptionsMarket.fromJSON(object.market) : undefined };
    },
    toJSON(message) {
        const obj = {};
        message.market !== undefined &&
            (obj.market = message.market ? BinaryOptionsMarket.toJSON(message.market) : undefined);
        return obj;
    },
    create(base) {
        return EventBinaryOptionsMarketUpdate.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        const message = createBaseEventBinaryOptionsMarketUpdate();
        message.market = (object.market !== undefined && object.market !== null)
            ? BinaryOptionsMarket.fromPartial(object.market)
            : undefined;
        return message;
    },
};
function createBaseEventNewSpotOrders() {
    return { marketId: "", buyOrders: [], sellOrders: [] };
}
export const EventNewSpotOrders = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.marketId !== "") {
            writer.uint32(10).string(message.marketId);
        }
        for (const v of message.buyOrders) {
            SpotLimitOrder.encode(v, writer.uint32(18).fork()).ldelim();
        }
        for (const v of message.sellOrders) {
            SpotLimitOrder.encode(v, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEventNewSpotOrders();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.marketId = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.buyOrders.push(SpotLimitOrder.decode(reader, reader.uint32()));
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.sellOrders.push(SpotLimitOrder.decode(reader, reader.uint32()));
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            marketId: isSet(object.marketId) ? String(object.marketId) : "",
            buyOrders: Array.isArray(object === null || object === void 0 ? void 0 : object.buyOrders) ? object.buyOrders.map((e) => SpotLimitOrder.fromJSON(e)) : [],
            sellOrders: Array.isArray(object === null || object === void 0 ? void 0 : object.sellOrders)
                ? object.sellOrders.map((e) => SpotLimitOrder.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.marketId !== undefined && (obj.marketId = message.marketId);
        if (message.buyOrders) {
            obj.buyOrders = message.buyOrders.map((e) => e ? SpotLimitOrder.toJSON(e) : undefined);
        }
        else {
            obj.buyOrders = [];
        }
        if (message.sellOrders) {
            obj.sellOrders = message.sellOrders.map((e) => e ? SpotLimitOrder.toJSON(e) : undefined);
        }
        else {
            obj.sellOrders = [];
        }
        return obj;
    },
    create(base) {
        return EventNewSpotOrders.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseEventNewSpotOrders();
        message.marketId = (_a = object.marketId) !== null && _a !== void 0 ? _a : "";
        message.buyOrders = ((_b = object.buyOrders) === null || _b === void 0 ? void 0 : _b.map((e) => SpotLimitOrder.fromPartial(e))) || [];
        message.sellOrders = ((_c = object.sellOrders) === null || _c === void 0 ? void 0 : _c.map((e) => SpotLimitOrder.fromPartial(e))) || [];
        return message;
    },
};
function createBaseEventNewDerivativeOrders() {
    return { marketId: "", buyOrders: [], sellOrders: [] };
}
export const EventNewDerivativeOrders = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.marketId !== "") {
            writer.uint32(10).string(message.marketId);
        }
        for (const v of message.buyOrders) {
            DerivativeLimitOrder.encode(v, writer.uint32(18).fork()).ldelim();
        }
        for (const v of message.sellOrders) {
            DerivativeLimitOrder.encode(v, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEventNewDerivativeOrders();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.marketId = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.buyOrders.push(DerivativeLimitOrder.decode(reader, reader.uint32()));
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.sellOrders.push(DerivativeLimitOrder.decode(reader, reader.uint32()));
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            marketId: isSet(object.marketId) ? String(object.marketId) : "",
            buyOrders: Array.isArray(object === null || object === void 0 ? void 0 : object.buyOrders)
                ? object.buyOrders.map((e) => DerivativeLimitOrder.fromJSON(e))
                : [],
            sellOrders: Array.isArray(object === null || object === void 0 ? void 0 : object.sellOrders)
                ? object.sellOrders.map((e) => DerivativeLimitOrder.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.marketId !== undefined && (obj.marketId = message.marketId);
        if (message.buyOrders) {
            obj.buyOrders = message.buyOrders.map((e) => e ? DerivativeLimitOrder.toJSON(e) : undefined);
        }
        else {
            obj.buyOrders = [];
        }
        if (message.sellOrders) {
            obj.sellOrders = message.sellOrders.map((e) => e ? DerivativeLimitOrder.toJSON(e) : undefined);
        }
        else {
            obj.sellOrders = [];
        }
        return obj;
    },
    create(base) {
        return EventNewDerivativeOrders.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseEventNewDerivativeOrders();
        message.marketId = (_a = object.marketId) !== null && _a !== void 0 ? _a : "";
        message.buyOrders = ((_b = object.buyOrders) === null || _b === void 0 ? void 0 : _b.map((e) => DerivativeLimitOrder.fromPartial(e))) || [];
        message.sellOrders = ((_c = object.sellOrders) === null || _c === void 0 ? void 0 : _c.map((e) => DerivativeLimitOrder.fromPartial(e))) || [];
        return message;
    },
};
function createBaseEventCancelSpotOrder() {
    return { marketId: "", order: undefined };
}
export const EventCancelSpotOrder = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.marketId !== "") {
            writer.uint32(10).string(message.marketId);
        }
        if (message.order !== undefined) {
            SpotLimitOrder.encode(message.order, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEventCancelSpotOrder();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.marketId = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.order = SpotLimitOrder.decode(reader, reader.uint32());
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            marketId: isSet(object.marketId) ? String(object.marketId) : "",
            order: isSet(object.order) ? SpotLimitOrder.fromJSON(object.order) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.marketId !== undefined && (obj.marketId = message.marketId);
        message.order !== undefined && (obj.order = message.order ? SpotLimitOrder.toJSON(message.order) : undefined);
        return obj;
    },
    create(base) {
        return EventCancelSpotOrder.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseEventCancelSpotOrder();
        message.marketId = (_a = object.marketId) !== null && _a !== void 0 ? _a : "";
        message.order = (object.order !== undefined && object.order !== null)
            ? SpotLimitOrder.fromPartial(object.order)
            : undefined;
        return message;
    },
};
function createBaseEventSpotMarketUpdate() {
    return { market: undefined };
}
export const EventSpotMarketUpdate = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.market !== undefined) {
            SpotMarket.encode(message.market, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEventSpotMarketUpdate();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.market = SpotMarket.decode(reader, reader.uint32());
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return { market: isSet(object.market) ? SpotMarket.fromJSON(object.market) : undefined };
    },
    toJSON(message) {
        const obj = {};
        message.market !== undefined && (obj.market = message.market ? SpotMarket.toJSON(message.market) : undefined);
        return obj;
    },
    create(base) {
        return EventSpotMarketUpdate.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        const message = createBaseEventSpotMarketUpdate();
        message.market = (object.market !== undefined && object.market !== null)
            ? SpotMarket.fromPartial(object.market)
            : undefined;
        return message;
    },
};
function createBaseEventPerpetualMarketUpdate() {
    return { market: undefined, perpetualMarketInfo: undefined, funding: undefined };
}
export const EventPerpetualMarketUpdate = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.market !== undefined) {
            DerivativeMarket.encode(message.market, writer.uint32(10).fork()).ldelim();
        }
        if (message.perpetualMarketInfo !== undefined) {
            PerpetualMarketInfo.encode(message.perpetualMarketInfo, writer.uint32(18).fork()).ldelim();
        }
        if (message.funding !== undefined) {
            PerpetualMarketFunding.encode(message.funding, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEventPerpetualMarketUpdate();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.market = DerivativeMarket.decode(reader, reader.uint32());
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.perpetualMarketInfo = PerpetualMarketInfo.decode(reader, reader.uint32());
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.funding = PerpetualMarketFunding.decode(reader, reader.uint32());
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            market: isSet(object.market) ? DerivativeMarket.fromJSON(object.market) : undefined,
            perpetualMarketInfo: isSet(object.perpetualMarketInfo)
                ? PerpetualMarketInfo.fromJSON(object.perpetualMarketInfo)
                : undefined,
            funding: isSet(object.funding) ? PerpetualMarketFunding.fromJSON(object.funding) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.market !== undefined && (obj.market = message.market ? DerivativeMarket.toJSON(message.market) : undefined);
        message.perpetualMarketInfo !== undefined && (obj.perpetualMarketInfo = message.perpetualMarketInfo
            ? PerpetualMarketInfo.toJSON(message.perpetualMarketInfo)
            : undefined);
        message.funding !== undefined &&
            (obj.funding = message.funding ? PerpetualMarketFunding.toJSON(message.funding) : undefined);
        return obj;
    },
    create(base) {
        return EventPerpetualMarketUpdate.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        const message = createBaseEventPerpetualMarketUpdate();
        message.market = (object.market !== undefined && object.market !== null)
            ? DerivativeMarket.fromPartial(object.market)
            : undefined;
        message.perpetualMarketInfo = (object.perpetualMarketInfo !== undefined && object.perpetualMarketInfo !== null)
            ? PerpetualMarketInfo.fromPartial(object.perpetualMarketInfo)
            : undefined;
        message.funding = (object.funding !== undefined && object.funding !== null)
            ? PerpetualMarketFunding.fromPartial(object.funding)
            : undefined;
        return message;
    },
};
function createBaseEventExpiryFuturesMarketUpdate() {
    return { market: undefined, expiryFuturesMarketInfo: undefined };
}
export const EventExpiryFuturesMarketUpdate = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.market !== undefined) {
            DerivativeMarket.encode(message.market, writer.uint32(10).fork()).ldelim();
        }
        if (message.expiryFuturesMarketInfo !== undefined) {
            ExpiryFuturesMarketInfo.encode(message.expiryFuturesMarketInfo, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEventExpiryFuturesMarketUpdate();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.market = DerivativeMarket.decode(reader, reader.uint32());
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.expiryFuturesMarketInfo = ExpiryFuturesMarketInfo.decode(reader, reader.uint32());
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            market: isSet(object.market) ? DerivativeMarket.fromJSON(object.market) : undefined,
            expiryFuturesMarketInfo: isSet(object.expiryFuturesMarketInfo)
                ? ExpiryFuturesMarketInfo.fromJSON(object.expiryFuturesMarketInfo)
                : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.market !== undefined && (obj.market = message.market ? DerivativeMarket.toJSON(message.market) : undefined);
        message.expiryFuturesMarketInfo !== undefined && (obj.expiryFuturesMarketInfo = message.expiryFuturesMarketInfo
            ? ExpiryFuturesMarketInfo.toJSON(message.expiryFuturesMarketInfo)
            : undefined);
        return obj;
    },
    create(base) {
        return EventExpiryFuturesMarketUpdate.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        const message = createBaseEventExpiryFuturesMarketUpdate();
        message.market = (object.market !== undefined && object.market !== null)
            ? DerivativeMarket.fromPartial(object.market)
            : undefined;
        message.expiryFuturesMarketInfo =
            (object.expiryFuturesMarketInfo !== undefined && object.expiryFuturesMarketInfo !== null)
                ? ExpiryFuturesMarketInfo.fromPartial(object.expiryFuturesMarketInfo)
                : undefined;
        return message;
    },
};
function createBaseEventPerpetualMarketFundingUpdate() {
    return { marketId: "", funding: undefined, isHourlyFunding: false, fundingRate: "", markPrice: "" };
}
export const EventPerpetualMarketFundingUpdate = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.marketId !== "") {
            writer.uint32(10).string(message.marketId);
        }
        if (message.funding !== undefined) {
            PerpetualMarketFunding.encode(message.funding, writer.uint32(18).fork()).ldelim();
        }
        if (message.isHourlyFunding === true) {
            writer.uint32(24).bool(message.isHourlyFunding);
        }
        if (message.fundingRate !== "") {
            writer.uint32(34).string(message.fundingRate);
        }
        if (message.markPrice !== "") {
            writer.uint32(42).string(message.markPrice);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEventPerpetualMarketFundingUpdate();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.marketId = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.funding = PerpetualMarketFunding.decode(reader, reader.uint32());
                    continue;
                case 3:
                    if (tag !== 24) {
                        break;
                    }
                    message.isHourlyFunding = reader.bool();
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.fundingRate = reader.string();
                    continue;
                case 5:
                    if (tag !== 42) {
                        break;
                    }
                    message.markPrice = reader.string();
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            marketId: isSet(object.marketId) ? String(object.marketId) : "",
            funding: isSet(object.funding) ? PerpetualMarketFunding.fromJSON(object.funding) : undefined,
            isHourlyFunding: isSet(object.isHourlyFunding) ? Boolean(object.isHourlyFunding) : false,
            fundingRate: isSet(object.fundingRate) ? String(object.fundingRate) : "",
            markPrice: isSet(object.markPrice) ? String(object.markPrice) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.marketId !== undefined && (obj.marketId = message.marketId);
        message.funding !== undefined &&
            (obj.funding = message.funding ? PerpetualMarketFunding.toJSON(message.funding) : undefined);
        message.isHourlyFunding !== undefined && (obj.isHourlyFunding = message.isHourlyFunding);
        message.fundingRate !== undefined && (obj.fundingRate = message.fundingRate);
        message.markPrice !== undefined && (obj.markPrice = message.markPrice);
        return obj;
    },
    create(base) {
        return EventPerpetualMarketFundingUpdate.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaseEventPerpetualMarketFundingUpdate();
        message.marketId = (_a = object.marketId) !== null && _a !== void 0 ? _a : "";
        message.funding = (object.funding !== undefined && object.funding !== null)
            ? PerpetualMarketFunding.fromPartial(object.funding)
            : undefined;
        message.isHourlyFunding = (_b = object.isHourlyFunding) !== null && _b !== void 0 ? _b : false;
        message.fundingRate = (_c = object.fundingRate) !== null && _c !== void 0 ? _c : "";
        message.markPrice = (_d = object.markPrice) !== null && _d !== void 0 ? _d : "";
        return message;
    },
};
function createBaseEventSubaccountDeposit() {
    return { srcAddress: "", subaccountId: new Uint8Array(), amount: undefined };
}
export const EventSubaccountDeposit = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.srcAddress !== "") {
            writer.uint32(10).string(message.srcAddress);
        }
        if (message.subaccountId.length !== 0) {
            writer.uint32(18).bytes(message.subaccountId);
        }
        if (message.amount !== undefined) {
            Coin.encode(message.amount, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEventSubaccountDeposit();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.srcAddress = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.subaccountId = reader.bytes();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.amount = Coin.decode(reader, reader.uint32());
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            srcAddress: isSet(object.srcAddress) ? String(object.srcAddress) : "",
            subaccountId: isSet(object.subaccountId) ? bytesFromBase64(object.subaccountId) : new Uint8Array(),
            amount: isSet(object.amount) ? Coin.fromJSON(object.amount) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.srcAddress !== undefined && (obj.srcAddress = message.srcAddress);
        message.subaccountId !== undefined &&
            (obj.subaccountId = base64FromBytes(message.subaccountId !== undefined ? message.subaccountId : new Uint8Array()));
        message.amount !== undefined && (obj.amount = message.amount ? Coin.toJSON(message.amount) : undefined);
        return obj;
    },
    create(base) {
        return EventSubaccountDeposit.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseEventSubaccountDeposit();
        message.srcAddress = (_a = object.srcAddress) !== null && _a !== void 0 ? _a : "";
        message.subaccountId = (_b = object.subaccountId) !== null && _b !== void 0 ? _b : new Uint8Array();
        message.amount = (object.amount !== undefined && object.amount !== null)
            ? Coin.fromPartial(object.amount)
            : undefined;
        return message;
    },
};
function createBaseEventSubaccountWithdraw() {
    return { subaccountId: new Uint8Array(), dstAddress: "", amount: undefined };
}
export const EventSubaccountWithdraw = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.subaccountId.length !== 0) {
            writer.uint32(10).bytes(message.subaccountId);
        }
        if (message.dstAddress !== "") {
            writer.uint32(18).string(message.dstAddress);
        }
        if (message.amount !== undefined) {
            Coin.encode(message.amount, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEventSubaccountWithdraw();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.subaccountId = reader.bytes();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.dstAddress = reader.string();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.amount = Coin.decode(reader, reader.uint32());
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            subaccountId: isSet(object.subaccountId) ? bytesFromBase64(object.subaccountId) : new Uint8Array(),
            dstAddress: isSet(object.dstAddress) ? String(object.dstAddress) : "",
            amount: isSet(object.amount) ? Coin.fromJSON(object.amount) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.subaccountId !== undefined &&
            (obj.subaccountId = base64FromBytes(message.subaccountId !== undefined ? message.subaccountId : new Uint8Array()));
        message.dstAddress !== undefined && (obj.dstAddress = message.dstAddress);
        message.amount !== undefined && (obj.amount = message.amount ? Coin.toJSON(message.amount) : undefined);
        return obj;
    },
    create(base) {
        return EventSubaccountWithdraw.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseEventSubaccountWithdraw();
        message.subaccountId = (_a = object.subaccountId) !== null && _a !== void 0 ? _a : new Uint8Array();
        message.dstAddress = (_b = object.dstAddress) !== null && _b !== void 0 ? _b : "";
        message.amount = (object.amount !== undefined && object.amount !== null)
            ? Coin.fromPartial(object.amount)
            : undefined;
        return message;
    },
};
function createBaseEventSubaccountBalanceTransfer() {
    return { srcSubaccountId: "", dstSubaccountId: "", amount: undefined };
}
export const EventSubaccountBalanceTransfer = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.srcSubaccountId !== "") {
            writer.uint32(10).string(message.srcSubaccountId);
        }
        if (message.dstSubaccountId !== "") {
            writer.uint32(18).string(message.dstSubaccountId);
        }
        if (message.amount !== undefined) {
            Coin.encode(message.amount, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEventSubaccountBalanceTransfer();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.srcSubaccountId = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.dstSubaccountId = reader.string();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.amount = Coin.decode(reader, reader.uint32());
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            srcSubaccountId: isSet(object.srcSubaccountId) ? String(object.srcSubaccountId) : "",
            dstSubaccountId: isSet(object.dstSubaccountId) ? String(object.dstSubaccountId) : "",
            amount: isSet(object.amount) ? Coin.fromJSON(object.amount) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.srcSubaccountId !== undefined && (obj.srcSubaccountId = message.srcSubaccountId);
        message.dstSubaccountId !== undefined && (obj.dstSubaccountId = message.dstSubaccountId);
        message.amount !== undefined && (obj.amount = message.amount ? Coin.toJSON(message.amount) : undefined);
        return obj;
    },
    create(base) {
        return EventSubaccountBalanceTransfer.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseEventSubaccountBalanceTransfer();
        message.srcSubaccountId = (_a = object.srcSubaccountId) !== null && _a !== void 0 ? _a : "";
        message.dstSubaccountId = (_b = object.dstSubaccountId) !== null && _b !== void 0 ? _b : "";
        message.amount = (object.amount !== undefined && object.amount !== null)
            ? Coin.fromPartial(object.amount)
            : undefined;
        return message;
    },
};
function createBaseEventBatchDepositUpdate() {
    return { depositUpdates: [] };
}
export const EventBatchDepositUpdate = {
    encode(message, writer = _m0.Writer.create()) {
        for (const v of message.depositUpdates) {
            DepositUpdate.encode(v, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEventBatchDepositUpdate();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.depositUpdates.push(DepositUpdate.decode(reader, reader.uint32()));
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            depositUpdates: Array.isArray(object === null || object === void 0 ? void 0 : object.depositUpdates)
                ? object.depositUpdates.map((e) => DepositUpdate.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.depositUpdates) {
            obj.depositUpdates = message.depositUpdates.map((e) => e ? DepositUpdate.toJSON(e) : undefined);
        }
        else {
            obj.depositUpdates = [];
        }
        return obj;
    },
    create(base) {
        return EventBatchDepositUpdate.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseEventBatchDepositUpdate();
        message.depositUpdates = ((_a = object.depositUpdates) === null || _a === void 0 ? void 0 : _a.map((e) => DepositUpdate.fromPartial(e))) || [];
        return message;
    },
};
function createBaseDerivativeMarketOrderCancel() {
    return { marketOrder: undefined, cancelQuantity: "" };
}
export const DerivativeMarketOrderCancel = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.marketOrder !== undefined) {
            DerivativeMarketOrder.encode(message.marketOrder, writer.uint32(10).fork()).ldelim();
        }
        if (message.cancelQuantity !== "") {
            writer.uint32(18).string(message.cancelQuantity);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseDerivativeMarketOrderCancel();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.marketOrder = DerivativeMarketOrder.decode(reader, reader.uint32());
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.cancelQuantity = reader.string();
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            marketOrder: isSet(object.marketOrder) ? DerivativeMarketOrder.fromJSON(object.marketOrder) : undefined,
            cancelQuantity: isSet(object.cancelQuantity) ? String(object.cancelQuantity) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.marketOrder !== undefined &&
            (obj.marketOrder = message.marketOrder ? DerivativeMarketOrder.toJSON(message.marketOrder) : undefined);
        message.cancelQuantity !== undefined && (obj.cancelQuantity = message.cancelQuantity);
        return obj;
    },
    create(base) {
        return DerivativeMarketOrderCancel.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseDerivativeMarketOrderCancel();
        message.marketOrder = (object.marketOrder !== undefined && object.marketOrder !== null)
            ? DerivativeMarketOrder.fromPartial(object.marketOrder)
            : undefined;
        message.cancelQuantity = (_a = object.cancelQuantity) !== null && _a !== void 0 ? _a : "";
        return message;
    },
};
function createBaseEventCancelDerivativeOrder() {
    return { marketId: "", isLimitCancel: false, limitOrder: undefined, marketOrderCancel: undefined };
}
export const EventCancelDerivativeOrder = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.marketId !== "") {
            writer.uint32(10).string(message.marketId);
        }
        if (message.isLimitCancel === true) {
            writer.uint32(16).bool(message.isLimitCancel);
        }
        if (message.limitOrder !== undefined) {
            DerivativeLimitOrder.encode(message.limitOrder, writer.uint32(26).fork()).ldelim();
        }
        if (message.marketOrderCancel !== undefined) {
            DerivativeMarketOrderCancel.encode(message.marketOrderCancel, writer.uint32(34).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEventCancelDerivativeOrder();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.marketId = reader.string();
                    continue;
                case 2:
                    if (tag !== 16) {
                        break;
                    }
                    message.isLimitCancel = reader.bool();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.limitOrder = DerivativeLimitOrder.decode(reader, reader.uint32());
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.marketOrderCancel = DerivativeMarketOrderCancel.decode(reader, reader.uint32());
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            marketId: isSet(object.marketId) ? String(object.marketId) : "",
            isLimitCancel: isSet(object.isLimitCancel) ? Boolean(object.isLimitCancel) : false,
            limitOrder: isSet(object.limitOrder) ? DerivativeLimitOrder.fromJSON(object.limitOrder) : undefined,
            marketOrderCancel: isSet(object.marketOrderCancel)
                ? DerivativeMarketOrderCancel.fromJSON(object.marketOrderCancel)
                : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.marketId !== undefined && (obj.marketId = message.marketId);
        message.isLimitCancel !== undefined && (obj.isLimitCancel = message.isLimitCancel);
        message.limitOrder !== undefined &&
            (obj.limitOrder = message.limitOrder ? DerivativeLimitOrder.toJSON(message.limitOrder) : undefined);
        message.marketOrderCancel !== undefined && (obj.marketOrderCancel = message.marketOrderCancel
            ? DerivativeMarketOrderCancel.toJSON(message.marketOrderCancel)
            : undefined);
        return obj;
    },
    create(base) {
        return EventCancelDerivativeOrder.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseEventCancelDerivativeOrder();
        message.marketId = (_a = object.marketId) !== null && _a !== void 0 ? _a : "";
        message.isLimitCancel = (_b = object.isLimitCancel) !== null && _b !== void 0 ? _b : false;
        message.limitOrder = (object.limitOrder !== undefined && object.limitOrder !== null)
            ? DerivativeLimitOrder.fromPartial(object.limitOrder)
            : undefined;
        message.marketOrderCancel = (object.marketOrderCancel !== undefined && object.marketOrderCancel !== null)
            ? DerivativeMarketOrderCancel.fromPartial(object.marketOrderCancel)
            : undefined;
        return message;
    },
};
function createBaseEventFeeDiscountSchedule() {
    return { schedule: undefined };
}
export const EventFeeDiscountSchedule = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.schedule !== undefined) {
            FeeDiscountSchedule.encode(message.schedule, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEventFeeDiscountSchedule();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.schedule = FeeDiscountSchedule.decode(reader, reader.uint32());
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return { schedule: isSet(object.schedule) ? FeeDiscountSchedule.fromJSON(object.schedule) : undefined };
    },
    toJSON(message) {
        const obj = {};
        message.schedule !== undefined &&
            (obj.schedule = message.schedule ? FeeDiscountSchedule.toJSON(message.schedule) : undefined);
        return obj;
    },
    create(base) {
        return EventFeeDiscountSchedule.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        const message = createBaseEventFeeDiscountSchedule();
        message.schedule = (object.schedule !== undefined && object.schedule !== null)
            ? FeeDiscountSchedule.fromPartial(object.schedule)
            : undefined;
        return message;
    },
};
function createBaseEventTradingRewardCampaignUpdate() {
    return { campaignInfo: undefined, campaignRewardPools: [] };
}
export const EventTradingRewardCampaignUpdate = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.campaignInfo !== undefined) {
            TradingRewardCampaignInfo.encode(message.campaignInfo, writer.uint32(10).fork()).ldelim();
        }
        for (const v of message.campaignRewardPools) {
            CampaignRewardPool.encode(v, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEventTradingRewardCampaignUpdate();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.campaignInfo = TradingRewardCampaignInfo.decode(reader, reader.uint32());
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.campaignRewardPools.push(CampaignRewardPool.decode(reader, reader.uint32()));
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            campaignInfo: isSet(object.campaignInfo) ? TradingRewardCampaignInfo.fromJSON(object.campaignInfo) : undefined,
            campaignRewardPools: Array.isArray(object === null || object === void 0 ? void 0 : object.campaignRewardPools)
                ? object.campaignRewardPools.map((e) => CampaignRewardPool.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.campaignInfo !== undefined &&
            (obj.campaignInfo = message.campaignInfo ? TradingRewardCampaignInfo.toJSON(message.campaignInfo) : undefined);
        if (message.campaignRewardPools) {
            obj.campaignRewardPools = message.campaignRewardPools.map((e) => e ? CampaignRewardPool.toJSON(e) : undefined);
        }
        else {
            obj.campaignRewardPools = [];
        }
        return obj;
    },
    create(base) {
        return EventTradingRewardCampaignUpdate.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseEventTradingRewardCampaignUpdate();
        message.campaignInfo = (object.campaignInfo !== undefined && object.campaignInfo !== null)
            ? TradingRewardCampaignInfo.fromPartial(object.campaignInfo)
            : undefined;
        message.campaignRewardPools = ((_a = object.campaignRewardPools) === null || _a === void 0 ? void 0 : _a.map((e) => CampaignRewardPool.fromPartial(e))) || [];
        return message;
    },
};
function createBaseEventTradingRewardDistribution() {
    return { accountRewards: [] };
}
export const EventTradingRewardDistribution = {
    encode(message, writer = _m0.Writer.create()) {
        for (const v of message.accountRewards) {
            AccountRewards.encode(v, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEventTradingRewardDistribution();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.accountRewards.push(AccountRewards.decode(reader, reader.uint32()));
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            accountRewards: Array.isArray(object === null || object === void 0 ? void 0 : object.accountRewards)
                ? object.accountRewards.map((e) => AccountRewards.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.accountRewards) {
            obj.accountRewards = message.accountRewards.map((e) => e ? AccountRewards.toJSON(e) : undefined);
        }
        else {
            obj.accountRewards = [];
        }
        return obj;
    },
    create(base) {
        return EventTradingRewardDistribution.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseEventTradingRewardDistribution();
        message.accountRewards = ((_a = object.accountRewards) === null || _a === void 0 ? void 0 : _a.map((e) => AccountRewards.fromPartial(e))) || [];
        return message;
    },
};
function createBaseEventNewConditionalDerivativeOrder() {
    return { marketId: "", order: undefined, hash: new Uint8Array(), isMarket: false };
}
export const EventNewConditionalDerivativeOrder = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.marketId !== "") {
            writer.uint32(10).string(message.marketId);
        }
        if (message.order !== undefined) {
            DerivativeOrder.encode(message.order, writer.uint32(18).fork()).ldelim();
        }
        if (message.hash.length !== 0) {
            writer.uint32(26).bytes(message.hash);
        }
        if (message.isMarket === true) {
            writer.uint32(32).bool(message.isMarket);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEventNewConditionalDerivativeOrder();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.marketId = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.order = DerivativeOrder.decode(reader, reader.uint32());
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.hash = reader.bytes();
                    continue;
                case 4:
                    if (tag !== 32) {
                        break;
                    }
                    message.isMarket = reader.bool();
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            marketId: isSet(object.marketId) ? String(object.marketId) : "",
            order: isSet(object.order) ? DerivativeOrder.fromJSON(object.order) : undefined,
            hash: isSet(object.hash) ? bytesFromBase64(object.hash) : new Uint8Array(),
            isMarket: isSet(object.isMarket) ? Boolean(object.isMarket) : false,
        };
    },
    toJSON(message) {
        const obj = {};
        message.marketId !== undefined && (obj.marketId = message.marketId);
        message.order !== undefined && (obj.order = message.order ? DerivativeOrder.toJSON(message.order) : undefined);
        message.hash !== undefined &&
            (obj.hash = base64FromBytes(message.hash !== undefined ? message.hash : new Uint8Array()));
        message.isMarket !== undefined && (obj.isMarket = message.isMarket);
        return obj;
    },
    create(base) {
        return EventNewConditionalDerivativeOrder.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseEventNewConditionalDerivativeOrder();
        message.marketId = (_a = object.marketId) !== null && _a !== void 0 ? _a : "";
        message.order = (object.order !== undefined && object.order !== null)
            ? DerivativeOrder.fromPartial(object.order)
            : undefined;
        message.hash = (_b = object.hash) !== null && _b !== void 0 ? _b : new Uint8Array();
        message.isMarket = (_c = object.isMarket) !== null && _c !== void 0 ? _c : false;
        return message;
    },
};
function createBaseEventCancelConditionalDerivativeOrder() {
    return { marketId: "", isLimitCancel: false, limitOrder: undefined, marketOrder: undefined };
}
export const EventCancelConditionalDerivativeOrder = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.marketId !== "") {
            writer.uint32(10).string(message.marketId);
        }
        if (message.isLimitCancel === true) {
            writer.uint32(16).bool(message.isLimitCancel);
        }
        if (message.limitOrder !== undefined) {
            DerivativeLimitOrder.encode(message.limitOrder, writer.uint32(26).fork()).ldelim();
        }
        if (message.marketOrder !== undefined) {
            DerivativeMarketOrder.encode(message.marketOrder, writer.uint32(34).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEventCancelConditionalDerivativeOrder();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.marketId = reader.string();
                    continue;
                case 2:
                    if (tag !== 16) {
                        break;
                    }
                    message.isLimitCancel = reader.bool();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.limitOrder = DerivativeLimitOrder.decode(reader, reader.uint32());
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.marketOrder = DerivativeMarketOrder.decode(reader, reader.uint32());
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            marketId: isSet(object.marketId) ? String(object.marketId) : "",
            isLimitCancel: isSet(object.isLimitCancel) ? Boolean(object.isLimitCancel) : false,
            limitOrder: isSet(object.limitOrder) ? DerivativeLimitOrder.fromJSON(object.limitOrder) : undefined,
            marketOrder: isSet(object.marketOrder) ? DerivativeMarketOrder.fromJSON(object.marketOrder) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.marketId !== undefined && (obj.marketId = message.marketId);
        message.isLimitCancel !== undefined && (obj.isLimitCancel = message.isLimitCancel);
        message.limitOrder !== undefined &&
            (obj.limitOrder = message.limitOrder ? DerivativeLimitOrder.toJSON(message.limitOrder) : undefined);
        message.marketOrder !== undefined &&
            (obj.marketOrder = message.marketOrder ? DerivativeMarketOrder.toJSON(message.marketOrder) : undefined);
        return obj;
    },
    create(base) {
        return EventCancelConditionalDerivativeOrder.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseEventCancelConditionalDerivativeOrder();
        message.marketId = (_a = object.marketId) !== null && _a !== void 0 ? _a : "";
        message.isLimitCancel = (_b = object.isLimitCancel) !== null && _b !== void 0 ? _b : false;
        message.limitOrder = (object.limitOrder !== undefined && object.limitOrder !== null)
            ? DerivativeLimitOrder.fromPartial(object.limitOrder)
            : undefined;
        message.marketOrder = (object.marketOrder !== undefined && object.marketOrder !== null)
            ? DerivativeMarketOrder.fromPartial(object.marketOrder)
            : undefined;
        return message;
    },
};
function createBaseEventConditionalDerivativeOrderTrigger() {
    return {
        marketId: new Uint8Array(),
        isLimitTrigger: false,
        triggeredOrderHash: new Uint8Array(),
        placedOrderHash: new Uint8Array(),
    };
}
export const EventConditionalDerivativeOrderTrigger = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.marketId.length !== 0) {
            writer.uint32(10).bytes(message.marketId);
        }
        if (message.isLimitTrigger === true) {
            writer.uint32(16).bool(message.isLimitTrigger);
        }
        if (message.triggeredOrderHash.length !== 0) {
            writer.uint32(26).bytes(message.triggeredOrderHash);
        }
        if (message.placedOrderHash.length !== 0) {
            writer.uint32(34).bytes(message.placedOrderHash);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEventConditionalDerivativeOrderTrigger();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.marketId = reader.bytes();
                    continue;
                case 2:
                    if (tag !== 16) {
                        break;
                    }
                    message.isLimitTrigger = reader.bool();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.triggeredOrderHash = reader.bytes();
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.placedOrderHash = reader.bytes();
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            marketId: isSet(object.marketId) ? bytesFromBase64(object.marketId) : new Uint8Array(),
            isLimitTrigger: isSet(object.isLimitTrigger) ? Boolean(object.isLimitTrigger) : false,
            triggeredOrderHash: isSet(object.triggeredOrderHash)
                ? bytesFromBase64(object.triggeredOrderHash)
                : new Uint8Array(),
            placedOrderHash: isSet(object.placedOrderHash) ? bytesFromBase64(object.placedOrderHash) : new Uint8Array(),
        };
    },
    toJSON(message) {
        const obj = {};
        message.marketId !== undefined &&
            (obj.marketId = base64FromBytes(message.marketId !== undefined ? message.marketId : new Uint8Array()));
        message.isLimitTrigger !== undefined && (obj.isLimitTrigger = message.isLimitTrigger);
        message.triggeredOrderHash !== undefined &&
            (obj.triggeredOrderHash = base64FromBytes(message.triggeredOrderHash !== undefined ? message.triggeredOrderHash : new Uint8Array()));
        message.placedOrderHash !== undefined &&
            (obj.placedOrderHash = base64FromBytes(message.placedOrderHash !== undefined ? message.placedOrderHash : new Uint8Array()));
        return obj;
    },
    create(base) {
        return EventConditionalDerivativeOrderTrigger.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaseEventConditionalDerivativeOrderTrigger();
        message.marketId = (_a = object.marketId) !== null && _a !== void 0 ? _a : new Uint8Array();
        message.isLimitTrigger = (_b = object.isLimitTrigger) !== null && _b !== void 0 ? _b : false;
        message.triggeredOrderHash = (_c = object.triggeredOrderHash) !== null && _c !== void 0 ? _c : new Uint8Array();
        message.placedOrderHash = (_d = object.placedOrderHash) !== null && _d !== void 0 ? _d : new Uint8Array();
        return message;
    },
};
function createBaseEventOrderFail() {
    return { account: new Uint8Array(), hashes: [], flags: [] };
}
export const EventOrderFail = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.account.length !== 0) {
            writer.uint32(10).bytes(message.account);
        }
        for (const v of message.hashes) {
            writer.uint32(18).bytes(v);
        }
        writer.uint32(26).fork();
        for (const v of message.flags) {
            writer.uint32(v);
        }
        writer.ldelim();
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEventOrderFail();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.account = reader.bytes();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.hashes.push(reader.bytes());
                    continue;
                case 3:
                    if (tag === 24) {
                        message.flags.push(reader.uint32());
                        continue;
                    }
                    if (tag === 26) {
                        const end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2) {
                            message.flags.push(reader.uint32());
                        }
                        continue;
                    }
                    break;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            account: isSet(object.account) ? bytesFromBase64(object.account) : new Uint8Array(),
            hashes: Array.isArray(object === null || object === void 0 ? void 0 : object.hashes) ? object.hashes.map((e) => bytesFromBase64(e)) : [],
            flags: Array.isArray(object === null || object === void 0 ? void 0 : object.flags) ? object.flags.map((e) => Number(e)) : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.account !== undefined &&
            (obj.account = base64FromBytes(message.account !== undefined ? message.account : new Uint8Array()));
        if (message.hashes) {
            obj.hashes = message.hashes.map((e) => base64FromBytes(e !== undefined ? e : new Uint8Array()));
        }
        else {
            obj.hashes = [];
        }
        if (message.flags) {
            obj.flags = message.flags.map((e) => Math.round(e));
        }
        else {
            obj.flags = [];
        }
        return obj;
    },
    create(base) {
        return EventOrderFail.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseEventOrderFail();
        message.account = (_a = object.account) !== null && _a !== void 0 ? _a : new Uint8Array();
        message.hashes = ((_b = object.hashes) === null || _b === void 0 ? void 0 : _b.map((e) => e)) || [];
        message.flags = ((_c = object.flags) === null || _c === void 0 ? void 0 : _c.map((e) => e)) || [];
        return message;
    },
};
function createBaseEventAtomicMarketOrderFeeMultipliersUpdated() {
    return { marketFeeMultipliers: [] };
}
export const EventAtomicMarketOrderFeeMultipliersUpdated = {
    encode(message, writer = _m0.Writer.create()) {
        for (const v of message.marketFeeMultipliers) {
            MarketFeeMultiplier.encode(v, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEventAtomicMarketOrderFeeMultipliersUpdated();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.marketFeeMultipliers.push(MarketFeeMultiplier.decode(reader, reader.uint32()));
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            marketFeeMultipliers: Array.isArray(object === null || object === void 0 ? void 0 : object.marketFeeMultipliers)
                ? object.marketFeeMultipliers.map((e) => MarketFeeMultiplier.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.marketFeeMultipliers) {
            obj.marketFeeMultipliers = message.marketFeeMultipliers.map((e) => e ? MarketFeeMultiplier.toJSON(e) : undefined);
        }
        else {
            obj.marketFeeMultipliers = [];
        }
        return obj;
    },
    create(base) {
        return EventAtomicMarketOrderFeeMultipliersUpdated.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseEventAtomicMarketOrderFeeMultipliersUpdated();
        message.marketFeeMultipliers = ((_a = object.marketFeeMultipliers) === null || _a === void 0 ? void 0 : _a.map((e) => MarketFeeMultiplier.fromPartial(e))) || [];
        return message;
    },
};
function createBaseEventOrderbookUpdate() {
    return { spotUpdates: [], derivativeUpdates: [] };
}
export const EventOrderbookUpdate = {
    encode(message, writer = _m0.Writer.create()) {
        for (const v of message.spotUpdates) {
            OrderbookUpdate.encode(v, writer.uint32(10).fork()).ldelim();
        }
        for (const v of message.derivativeUpdates) {
            OrderbookUpdate.encode(v, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEventOrderbookUpdate();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.spotUpdates.push(OrderbookUpdate.decode(reader, reader.uint32()));
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.derivativeUpdates.push(OrderbookUpdate.decode(reader, reader.uint32()));
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            spotUpdates: Array.isArray(object === null || object === void 0 ? void 0 : object.spotUpdates)
                ? object.spotUpdates.map((e) => OrderbookUpdate.fromJSON(e))
                : [],
            derivativeUpdates: Array.isArray(object === null || object === void 0 ? void 0 : object.derivativeUpdates)
                ? object.derivativeUpdates.map((e) => OrderbookUpdate.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.spotUpdates) {
            obj.spotUpdates = message.spotUpdates.map((e) => e ? OrderbookUpdate.toJSON(e) : undefined);
        }
        else {
            obj.spotUpdates = [];
        }
        if (message.derivativeUpdates) {
            obj.derivativeUpdates = message.derivativeUpdates.map((e) => e ? OrderbookUpdate.toJSON(e) : undefined);
        }
        else {
            obj.derivativeUpdates = [];
        }
        return obj;
    },
    create(base) {
        return EventOrderbookUpdate.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseEventOrderbookUpdate();
        message.spotUpdates = ((_a = object.spotUpdates) === null || _a === void 0 ? void 0 : _a.map((e) => OrderbookUpdate.fromPartial(e))) || [];
        message.derivativeUpdates = ((_b = object.derivativeUpdates) === null || _b === void 0 ? void 0 : _b.map((e) => OrderbookUpdate.fromPartial(e))) || [];
        return message;
    },
};
function createBaseOrderbookUpdate() {
    return { seq: "0", orderbook: undefined };
}
export const OrderbookUpdate = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.seq !== "0") {
            writer.uint32(8).uint64(message.seq);
        }
        if (message.orderbook !== undefined) {
            Orderbook.encode(message.orderbook, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseOrderbookUpdate();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 8) {
                        break;
                    }
                    message.seq = longToString(reader.uint64());
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.orderbook = Orderbook.decode(reader, reader.uint32());
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            seq: isSet(object.seq) ? String(object.seq) : "0",
            orderbook: isSet(object.orderbook) ? Orderbook.fromJSON(object.orderbook) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.seq !== undefined && (obj.seq = message.seq);
        message.orderbook !== undefined &&
            (obj.orderbook = message.orderbook ? Orderbook.toJSON(message.orderbook) : undefined);
        return obj;
    },
    create(base) {
        return OrderbookUpdate.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseOrderbookUpdate();
        message.seq = (_a = object.seq) !== null && _a !== void 0 ? _a : "0";
        message.orderbook = (object.orderbook !== undefined && object.orderbook !== null)
            ? Orderbook.fromPartial(object.orderbook)
            : undefined;
        return message;
    },
};
function createBaseOrderbook() {
    return { marketId: new Uint8Array(), buyLevels: [], sellLevels: [] };
}
export const Orderbook = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.marketId.length !== 0) {
            writer.uint32(10).bytes(message.marketId);
        }
        for (const v of message.buyLevels) {
            Level.encode(v, writer.uint32(18).fork()).ldelim();
        }
        for (const v of message.sellLevels) {
            Level.encode(v, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseOrderbook();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.marketId = reader.bytes();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.buyLevels.push(Level.decode(reader, reader.uint32()));
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.sellLevels.push(Level.decode(reader, reader.uint32()));
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            marketId: isSet(object.marketId) ? bytesFromBase64(object.marketId) : new Uint8Array(),
            buyLevels: Array.isArray(object === null || object === void 0 ? void 0 : object.buyLevels) ? object.buyLevels.map((e) => Level.fromJSON(e)) : [],
            sellLevels: Array.isArray(object === null || object === void 0 ? void 0 : object.sellLevels) ? object.sellLevels.map((e) => Level.fromJSON(e)) : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.marketId !== undefined &&
            (obj.marketId = base64FromBytes(message.marketId !== undefined ? message.marketId : new Uint8Array()));
        if (message.buyLevels) {
            obj.buyLevels = message.buyLevels.map((e) => e ? Level.toJSON(e) : undefined);
        }
        else {
            obj.buyLevels = [];
        }
        if (message.sellLevels) {
            obj.sellLevels = message.sellLevels.map((e) => e ? Level.toJSON(e) : undefined);
        }
        else {
            obj.sellLevels = [];
        }
        return obj;
    },
    create(base) {
        return Orderbook.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseOrderbook();
        message.marketId = (_a = object.marketId) !== null && _a !== void 0 ? _a : new Uint8Array();
        message.buyLevels = ((_b = object.buyLevels) === null || _b === void 0 ? void 0 : _b.map((e) => Level.fromPartial(e))) || [];
        message.sellLevels = ((_c = object.sellLevels) === null || _c === void 0 ? void 0 : _c.map((e) => Level.fromPartial(e))) || [];
        return message;
    },
};
var tsProtoGlobalThis = (() => {
    if (typeof globalThis !== "undefined") {
        return globalThis;
    }
    if (typeof self !== "undefined") {
        return self;
    }
    if (typeof window !== "undefined") {
        return window;
    }
    if (typeof global !== "undefined") {
        return global;
    }
    throw "Unable to locate global object";
})();
function bytesFromBase64(b64) {
    if (tsProtoGlobalThis.Buffer) {
        return Uint8Array.from(tsProtoGlobalThis.Buffer.from(b64, "base64"));
    }
    else {
        const bin = tsProtoGlobalThis.atob(b64);
        const arr = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; ++i) {
            arr[i] = bin.charCodeAt(i);
        }
        return arr;
    }
}
function base64FromBytes(arr) {
    if (tsProtoGlobalThis.Buffer) {
        return tsProtoGlobalThis.Buffer.from(arr).toString("base64");
    }
    else {
        const bin = [];
        arr.forEach((byte) => {
            bin.push(String.fromCharCode(byte));
        });
        return tsProtoGlobalThis.btoa(bin.join(""));
    }
}
function longToString(long) {
    return long.toString();
}
if (_m0.util.Long !== Long) {
    _m0.util.Long = Long;
    _m0.configure();
}
function isSet(value) {
    return value !== null && value !== undefined;
}
