"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceAttestation = exports.MetadataStatistics = exports.PriceRecord = exports.PriceRecords = exports.LastPriceTimestamps = exports.SymbolPriceTimestamp = exports.BandIBCParams = exports.BandOracleRequest = exports.PythPriceState = exports.PriceState = exports.CoinbasePriceState = exports.PriceFeedPrice = exports.PriceFeedInfo = exports.ProviderPriceState = exports.ProviderState = exports.ProviderInfo = exports.PriceFeedState = exports.BandPriceState = exports.ChainlinkPriceState = exports.OracleInfo = exports.Params = exports.oracleTypeToJSON = exports.oracleTypeFromJSON = exports.OracleType = void 0;
/* eslint-disable */
const long_1 = __importDefault(require("long"));
const minimal_1 = __importDefault(require("protobufjs/minimal"));
const coin_1 = require("../../../cosmos/base/v1beta1/coin");
var OracleType;
(function (OracleType) {
    OracleType[OracleType["Unspecified"] = 0] = "Unspecified";
    OracleType[OracleType["Band"] = 1] = "Band";
    OracleType[OracleType["PriceFeed"] = 2] = "PriceFeed";
    OracleType[OracleType["Coinbase"] = 3] = "Coinbase";
    OracleType[OracleType["Chainlink"] = 4] = "Chainlink";
    OracleType[OracleType["Razor"] = 5] = "Razor";
    OracleType[OracleType["Dia"] = 6] = "Dia";
    OracleType[OracleType["API3"] = 7] = "API3";
    OracleType[OracleType["Uma"] = 8] = "Uma";
    OracleType[OracleType["Pyth"] = 9] = "Pyth";
    OracleType[OracleType["BandIBC"] = 10] = "BandIBC";
    OracleType[OracleType["Provider"] = 11] = "Provider";
    OracleType[OracleType["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(OracleType = exports.OracleType || (exports.OracleType = {}));
function oracleTypeFromJSON(object) {
    switch (object) {
        case 0:
        case "Unspecified":
            return OracleType.Unspecified;
        case 1:
        case "Band":
            return OracleType.Band;
        case 2:
        case "PriceFeed":
            return OracleType.PriceFeed;
        case 3:
        case "Coinbase":
            return OracleType.Coinbase;
        case 4:
        case "Chainlink":
            return OracleType.Chainlink;
        case 5:
        case "Razor":
            return OracleType.Razor;
        case 6:
        case "Dia":
            return OracleType.Dia;
        case 7:
        case "API3":
            return OracleType.API3;
        case 8:
        case "Uma":
            return OracleType.Uma;
        case 9:
        case "Pyth":
            return OracleType.Pyth;
        case 10:
        case "BandIBC":
            return OracleType.BandIBC;
        case 11:
        case "Provider":
            return OracleType.Provider;
        case -1:
        case "UNRECOGNIZED":
        default:
            return OracleType.UNRECOGNIZED;
    }
}
exports.oracleTypeFromJSON = oracleTypeFromJSON;
function oracleTypeToJSON(object) {
    switch (object) {
        case OracleType.Unspecified:
            return "Unspecified";
        case OracleType.Band:
            return "Band";
        case OracleType.PriceFeed:
            return "PriceFeed";
        case OracleType.Coinbase:
            return "Coinbase";
        case OracleType.Chainlink:
            return "Chainlink";
        case OracleType.Razor:
            return "Razor";
        case OracleType.Dia:
            return "Dia";
        case OracleType.API3:
            return "API3";
        case OracleType.Uma:
            return "Uma";
        case OracleType.Pyth:
            return "Pyth";
        case OracleType.BandIBC:
            return "BandIBC";
        case OracleType.Provider:
            return "Provider";
        case OracleType.UNRECOGNIZED:
        default:
            return "UNRECOGNIZED";
    }
}
exports.oracleTypeToJSON = oracleTypeToJSON;
function createBaseParams() {
    return { pythContract: "" };
}
exports.Params = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.pythContract !== "") {
            writer.uint32(10).string(message.pythContract);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseParams();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.pythContract = reader.string();
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
        return { pythContract: isSet(object.pythContract) ? String(object.pythContract) : "" };
    },
    toJSON(message) {
        const obj = {};
        message.pythContract !== undefined && (obj.pythContract = message.pythContract);
        return obj;
    },
    create(base) {
        return exports.Params.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseParams();
        message.pythContract = (_a = object.pythContract) !== null && _a !== void 0 ? _a : "";
        return message;
    },
};
function createBaseOracleInfo() {
    return { symbol: "", oracleType: 0, scaleFactor: 0 };
}
exports.OracleInfo = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.symbol !== "") {
            writer.uint32(10).string(message.symbol);
        }
        if (message.oracleType !== 0) {
            writer.uint32(16).int32(message.oracleType);
        }
        if (message.scaleFactor !== 0) {
            writer.uint32(24).uint32(message.scaleFactor);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseOracleInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.symbol = reader.string();
                    continue;
                case 2:
                    if (tag !== 16) {
                        break;
                    }
                    message.oracleType = reader.int32();
                    continue;
                case 3:
                    if (tag !== 24) {
                        break;
                    }
                    message.scaleFactor = reader.uint32();
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
            symbol: isSet(object.symbol) ? String(object.symbol) : "",
            oracleType: isSet(object.oracleType) ? oracleTypeFromJSON(object.oracleType) : 0,
            scaleFactor: isSet(object.scaleFactor) ? Number(object.scaleFactor) : 0,
        };
    },
    toJSON(message) {
        const obj = {};
        message.symbol !== undefined && (obj.symbol = message.symbol);
        message.oracleType !== undefined && (obj.oracleType = oracleTypeToJSON(message.oracleType));
        message.scaleFactor !== undefined && (obj.scaleFactor = Math.round(message.scaleFactor));
        return obj;
    },
    create(base) {
        return exports.OracleInfo.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseOracleInfo();
        message.symbol = (_a = object.symbol) !== null && _a !== void 0 ? _a : "";
        message.oracleType = (_b = object.oracleType) !== null && _b !== void 0 ? _b : 0;
        message.scaleFactor = (_c = object.scaleFactor) !== null && _c !== void 0 ? _c : 0;
        return message;
    },
};
function createBaseChainlinkPriceState() {
    return { feedId: "", answer: "", timestamp: "0", priceState: undefined };
}
exports.ChainlinkPriceState = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.feedId !== "") {
            writer.uint32(10).string(message.feedId);
        }
        if (message.answer !== "") {
            writer.uint32(18).string(message.answer);
        }
        if (message.timestamp !== "0") {
            writer.uint32(24).uint64(message.timestamp);
        }
        if (message.priceState !== undefined) {
            exports.PriceState.encode(message.priceState, writer.uint32(34).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseChainlinkPriceState();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.feedId = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.answer = reader.string();
                    continue;
                case 3:
                    if (tag !== 24) {
                        break;
                    }
                    message.timestamp = longToString(reader.uint64());
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.priceState = exports.PriceState.decode(reader, reader.uint32());
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
            feedId: isSet(object.feedId) ? String(object.feedId) : "",
            answer: isSet(object.answer) ? String(object.answer) : "",
            timestamp: isSet(object.timestamp) ? String(object.timestamp) : "0",
            priceState: isSet(object.priceState) ? exports.PriceState.fromJSON(object.priceState) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.feedId !== undefined && (obj.feedId = message.feedId);
        message.answer !== undefined && (obj.answer = message.answer);
        message.timestamp !== undefined && (obj.timestamp = message.timestamp);
        message.priceState !== undefined &&
            (obj.priceState = message.priceState ? exports.PriceState.toJSON(message.priceState) : undefined);
        return obj;
    },
    create(base) {
        return exports.ChainlinkPriceState.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseChainlinkPriceState();
        message.feedId = (_a = object.feedId) !== null && _a !== void 0 ? _a : "";
        message.answer = (_b = object.answer) !== null && _b !== void 0 ? _b : "";
        message.timestamp = (_c = object.timestamp) !== null && _c !== void 0 ? _c : "0";
        message.priceState = (object.priceState !== undefined && object.priceState !== null)
            ? exports.PriceState.fromPartial(object.priceState)
            : undefined;
        return message;
    },
};
function createBaseBandPriceState() {
    return { symbol: "", rate: "", resolveTime: "0", requestID: "0", priceState: undefined };
}
exports.BandPriceState = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.symbol !== "") {
            writer.uint32(10).string(message.symbol);
        }
        if (message.rate !== "") {
            writer.uint32(18).string(message.rate);
        }
        if (message.resolveTime !== "0") {
            writer.uint32(24).uint64(message.resolveTime);
        }
        if (message.requestID !== "0") {
            writer.uint32(32).uint64(message.requestID);
        }
        if (message.priceState !== undefined) {
            exports.PriceState.encode(message.priceState, writer.uint32(42).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseBandPriceState();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.symbol = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.rate = reader.string();
                    continue;
                case 3:
                    if (tag !== 24) {
                        break;
                    }
                    message.resolveTime = longToString(reader.uint64());
                    continue;
                case 4:
                    if (tag !== 32) {
                        break;
                    }
                    message.requestID = longToString(reader.uint64());
                    continue;
                case 5:
                    if (tag !== 42) {
                        break;
                    }
                    message.priceState = exports.PriceState.decode(reader, reader.uint32());
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
            symbol: isSet(object.symbol) ? String(object.symbol) : "",
            rate: isSet(object.rate) ? String(object.rate) : "",
            resolveTime: isSet(object.resolveTime) ? String(object.resolveTime) : "0",
            requestID: isSet(object.requestID) ? String(object.requestID) : "0",
            priceState: isSet(object.priceState) ? exports.PriceState.fromJSON(object.priceState) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.symbol !== undefined && (obj.symbol = message.symbol);
        message.rate !== undefined && (obj.rate = message.rate);
        message.resolveTime !== undefined && (obj.resolveTime = message.resolveTime);
        message.requestID !== undefined && (obj.requestID = message.requestID);
        message.priceState !== undefined &&
            (obj.priceState = message.priceState ? exports.PriceState.toJSON(message.priceState) : undefined);
        return obj;
    },
    create(base) {
        return exports.BandPriceState.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaseBandPriceState();
        message.symbol = (_a = object.symbol) !== null && _a !== void 0 ? _a : "";
        message.rate = (_b = object.rate) !== null && _b !== void 0 ? _b : "";
        message.resolveTime = (_c = object.resolveTime) !== null && _c !== void 0 ? _c : "0";
        message.requestID = (_d = object.requestID) !== null && _d !== void 0 ? _d : "0";
        message.priceState = (object.priceState !== undefined && object.priceState !== null)
            ? exports.PriceState.fromPartial(object.priceState)
            : undefined;
        return message;
    },
};
function createBasePriceFeedState() {
    return { base: "", quote: "", priceState: undefined, relayers: [] };
}
exports.PriceFeedState = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.base !== "") {
            writer.uint32(10).string(message.base);
        }
        if (message.quote !== "") {
            writer.uint32(18).string(message.quote);
        }
        if (message.priceState !== undefined) {
            exports.PriceState.encode(message.priceState, writer.uint32(26).fork()).ldelim();
        }
        for (const v of message.relayers) {
            writer.uint32(34).string(v);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasePriceFeedState();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.base = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.quote = reader.string();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.priceState = exports.PriceState.decode(reader, reader.uint32());
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.relayers.push(reader.string());
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
            base: isSet(object.base) ? String(object.base) : "",
            quote: isSet(object.quote) ? String(object.quote) : "",
            priceState: isSet(object.priceState) ? exports.PriceState.fromJSON(object.priceState) : undefined,
            relayers: Array.isArray(object === null || object === void 0 ? void 0 : object.relayers) ? object.relayers.map((e) => String(e)) : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.base !== undefined && (obj.base = message.base);
        message.quote !== undefined && (obj.quote = message.quote);
        message.priceState !== undefined &&
            (obj.priceState = message.priceState ? exports.PriceState.toJSON(message.priceState) : undefined);
        if (message.relayers) {
            obj.relayers = message.relayers.map((e) => e);
        }
        else {
            obj.relayers = [];
        }
        return obj;
    },
    create(base) {
        return exports.PriceFeedState.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBasePriceFeedState();
        message.base = (_a = object.base) !== null && _a !== void 0 ? _a : "";
        message.quote = (_b = object.quote) !== null && _b !== void 0 ? _b : "";
        message.priceState = (object.priceState !== undefined && object.priceState !== null)
            ? exports.PriceState.fromPartial(object.priceState)
            : undefined;
        message.relayers = ((_c = object.relayers) === null || _c === void 0 ? void 0 : _c.map((e) => e)) || [];
        return message;
    },
};
function createBaseProviderInfo() {
    return { provider: "", relayers: [] };
}
exports.ProviderInfo = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.provider !== "") {
            writer.uint32(10).string(message.provider);
        }
        for (const v of message.relayers) {
            writer.uint32(18).string(v);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseProviderInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.provider = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.relayers.push(reader.string());
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
            provider: isSet(object.provider) ? String(object.provider) : "",
            relayers: Array.isArray(object === null || object === void 0 ? void 0 : object.relayers) ? object.relayers.map((e) => String(e)) : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.provider !== undefined && (obj.provider = message.provider);
        if (message.relayers) {
            obj.relayers = message.relayers.map((e) => e);
        }
        else {
            obj.relayers = [];
        }
        return obj;
    },
    create(base) {
        return exports.ProviderInfo.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseProviderInfo();
        message.provider = (_a = object.provider) !== null && _a !== void 0 ? _a : "";
        message.relayers = ((_b = object.relayers) === null || _b === void 0 ? void 0 : _b.map((e) => e)) || [];
        return message;
    },
};
function createBaseProviderState() {
    return { providerInfo: undefined, providerPriceStates: [] };
}
exports.ProviderState = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.providerInfo !== undefined) {
            exports.ProviderInfo.encode(message.providerInfo, writer.uint32(10).fork()).ldelim();
        }
        for (const v of message.providerPriceStates) {
            exports.ProviderPriceState.encode(v, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseProviderState();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.providerInfo = exports.ProviderInfo.decode(reader, reader.uint32());
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.providerPriceStates.push(exports.ProviderPriceState.decode(reader, reader.uint32()));
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
            providerInfo: isSet(object.providerInfo) ? exports.ProviderInfo.fromJSON(object.providerInfo) : undefined,
            providerPriceStates: Array.isArray(object === null || object === void 0 ? void 0 : object.providerPriceStates)
                ? object.providerPriceStates.map((e) => exports.ProviderPriceState.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.providerInfo !== undefined &&
            (obj.providerInfo = message.providerInfo ? exports.ProviderInfo.toJSON(message.providerInfo) : undefined);
        if (message.providerPriceStates) {
            obj.providerPriceStates = message.providerPriceStates.map((e) => e ? exports.ProviderPriceState.toJSON(e) : undefined);
        }
        else {
            obj.providerPriceStates = [];
        }
        return obj;
    },
    create(base) {
        return exports.ProviderState.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseProviderState();
        message.providerInfo = (object.providerInfo !== undefined && object.providerInfo !== null)
            ? exports.ProviderInfo.fromPartial(object.providerInfo)
            : undefined;
        message.providerPriceStates = ((_a = object.providerPriceStates) === null || _a === void 0 ? void 0 : _a.map((e) => exports.ProviderPriceState.fromPartial(e))) || [];
        return message;
    },
};
function createBaseProviderPriceState() {
    return { symbol: "", state: undefined };
}
exports.ProviderPriceState = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.symbol !== "") {
            writer.uint32(10).string(message.symbol);
        }
        if (message.state !== undefined) {
            exports.PriceState.encode(message.state, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseProviderPriceState();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.symbol = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.state = exports.PriceState.decode(reader, reader.uint32());
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
            symbol: isSet(object.symbol) ? String(object.symbol) : "",
            state: isSet(object.state) ? exports.PriceState.fromJSON(object.state) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.symbol !== undefined && (obj.symbol = message.symbol);
        message.state !== undefined && (obj.state = message.state ? exports.PriceState.toJSON(message.state) : undefined);
        return obj;
    },
    create(base) {
        return exports.ProviderPriceState.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseProviderPriceState();
        message.symbol = (_a = object.symbol) !== null && _a !== void 0 ? _a : "";
        message.state = (object.state !== undefined && object.state !== null)
            ? exports.PriceState.fromPartial(object.state)
            : undefined;
        return message;
    },
};
function createBasePriceFeedInfo() {
    return { base: "", quote: "" };
}
exports.PriceFeedInfo = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.base !== "") {
            writer.uint32(10).string(message.base);
        }
        if (message.quote !== "") {
            writer.uint32(18).string(message.quote);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasePriceFeedInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.base = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.quote = reader.string();
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
            base: isSet(object.base) ? String(object.base) : "",
            quote: isSet(object.quote) ? String(object.quote) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.base !== undefined && (obj.base = message.base);
        message.quote !== undefined && (obj.quote = message.quote);
        return obj;
    },
    create(base) {
        return exports.PriceFeedInfo.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBasePriceFeedInfo();
        message.base = (_a = object.base) !== null && _a !== void 0 ? _a : "";
        message.quote = (_b = object.quote) !== null && _b !== void 0 ? _b : "";
        return message;
    },
};
function createBasePriceFeedPrice() {
    return { price: "" };
}
exports.PriceFeedPrice = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.price !== "") {
            writer.uint32(10).string(message.price);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasePriceFeedPrice();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.price = reader.string();
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
        return { price: isSet(object.price) ? String(object.price) : "" };
    },
    toJSON(message) {
        const obj = {};
        message.price !== undefined && (obj.price = message.price);
        return obj;
    },
    create(base) {
        return exports.PriceFeedPrice.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBasePriceFeedPrice();
        message.price = (_a = object.price) !== null && _a !== void 0 ? _a : "";
        return message;
    },
};
function createBaseCoinbasePriceState() {
    return { kind: "", timestamp: "0", key: "", value: "0", priceState: undefined };
}
exports.CoinbasePriceState = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.kind !== "") {
            writer.uint32(10).string(message.kind);
        }
        if (message.timestamp !== "0") {
            writer.uint32(16).uint64(message.timestamp);
        }
        if (message.key !== "") {
            writer.uint32(26).string(message.key);
        }
        if (message.value !== "0") {
            writer.uint32(32).uint64(message.value);
        }
        if (message.priceState !== undefined) {
            exports.PriceState.encode(message.priceState, writer.uint32(42).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseCoinbasePriceState();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.kind = reader.string();
                    continue;
                case 2:
                    if (tag !== 16) {
                        break;
                    }
                    message.timestamp = longToString(reader.uint64());
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.key = reader.string();
                    continue;
                case 4:
                    if (tag !== 32) {
                        break;
                    }
                    message.value = longToString(reader.uint64());
                    continue;
                case 5:
                    if (tag !== 42) {
                        break;
                    }
                    message.priceState = exports.PriceState.decode(reader, reader.uint32());
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
            kind: isSet(object.kind) ? String(object.kind) : "",
            timestamp: isSet(object.timestamp) ? String(object.timestamp) : "0",
            key: isSet(object.key) ? String(object.key) : "",
            value: isSet(object.value) ? String(object.value) : "0",
            priceState: isSet(object.priceState) ? exports.PriceState.fromJSON(object.priceState) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.kind !== undefined && (obj.kind = message.kind);
        message.timestamp !== undefined && (obj.timestamp = message.timestamp);
        message.key !== undefined && (obj.key = message.key);
        message.value !== undefined && (obj.value = message.value);
        message.priceState !== undefined &&
            (obj.priceState = message.priceState ? exports.PriceState.toJSON(message.priceState) : undefined);
        return obj;
    },
    create(base) {
        return exports.CoinbasePriceState.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaseCoinbasePriceState();
        message.kind = (_a = object.kind) !== null && _a !== void 0 ? _a : "";
        message.timestamp = (_b = object.timestamp) !== null && _b !== void 0 ? _b : "0";
        message.key = (_c = object.key) !== null && _c !== void 0 ? _c : "";
        message.value = (_d = object.value) !== null && _d !== void 0 ? _d : "0";
        message.priceState = (object.priceState !== undefined && object.priceState !== null)
            ? exports.PriceState.fromPartial(object.priceState)
            : undefined;
        return message;
    },
};
function createBasePriceState() {
    return { price: "", cumulativePrice: "", timestamp: "0" };
}
exports.PriceState = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.price !== "") {
            writer.uint32(10).string(message.price);
        }
        if (message.cumulativePrice !== "") {
            writer.uint32(18).string(message.cumulativePrice);
        }
        if (message.timestamp !== "0") {
            writer.uint32(24).int64(message.timestamp);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasePriceState();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.price = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.cumulativePrice = reader.string();
                    continue;
                case 3:
                    if (tag !== 24) {
                        break;
                    }
                    message.timestamp = longToString(reader.int64());
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
            price: isSet(object.price) ? String(object.price) : "",
            cumulativePrice: isSet(object.cumulativePrice) ? String(object.cumulativePrice) : "",
            timestamp: isSet(object.timestamp) ? String(object.timestamp) : "0",
        };
    },
    toJSON(message) {
        const obj = {};
        message.price !== undefined && (obj.price = message.price);
        message.cumulativePrice !== undefined && (obj.cumulativePrice = message.cumulativePrice);
        message.timestamp !== undefined && (obj.timestamp = message.timestamp);
        return obj;
    },
    create(base) {
        return exports.PriceState.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBasePriceState();
        message.price = (_a = object.price) !== null && _a !== void 0 ? _a : "";
        message.cumulativePrice = (_b = object.cumulativePrice) !== null && _b !== void 0 ? _b : "";
        message.timestamp = (_c = object.timestamp) !== null && _c !== void 0 ? _c : "0";
        return message;
    },
};
function createBasePythPriceState() {
    return { priceId: "", emaPrice: "", emaConf: "", conf: "", publishTime: "0", priceState: undefined };
}
exports.PythPriceState = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.priceId !== "") {
            writer.uint32(10).string(message.priceId);
        }
        if (message.emaPrice !== "") {
            writer.uint32(18).string(message.emaPrice);
        }
        if (message.emaConf !== "") {
            writer.uint32(26).string(message.emaConf);
        }
        if (message.conf !== "") {
            writer.uint32(34).string(message.conf);
        }
        if (message.publishTime !== "0") {
            writer.uint32(40).uint64(message.publishTime);
        }
        if (message.priceState !== undefined) {
            exports.PriceState.encode(message.priceState, writer.uint32(50).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasePythPriceState();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.priceId = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.emaPrice = reader.string();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.emaConf = reader.string();
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.conf = reader.string();
                    continue;
                case 5:
                    if (tag !== 40) {
                        break;
                    }
                    message.publishTime = longToString(reader.uint64());
                    continue;
                case 6:
                    if (tag !== 50) {
                        break;
                    }
                    message.priceState = exports.PriceState.decode(reader, reader.uint32());
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
            priceId: isSet(object.priceId) ? String(object.priceId) : "",
            emaPrice: isSet(object.emaPrice) ? String(object.emaPrice) : "",
            emaConf: isSet(object.emaConf) ? String(object.emaConf) : "",
            conf: isSet(object.conf) ? String(object.conf) : "",
            publishTime: isSet(object.publishTime) ? String(object.publishTime) : "0",
            priceState: isSet(object.priceState) ? exports.PriceState.fromJSON(object.priceState) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.priceId !== undefined && (obj.priceId = message.priceId);
        message.emaPrice !== undefined && (obj.emaPrice = message.emaPrice);
        message.emaConf !== undefined && (obj.emaConf = message.emaConf);
        message.conf !== undefined && (obj.conf = message.conf);
        message.publishTime !== undefined && (obj.publishTime = message.publishTime);
        message.priceState !== undefined &&
            (obj.priceState = message.priceState ? exports.PriceState.toJSON(message.priceState) : undefined);
        return obj;
    },
    create(base) {
        return exports.PythPriceState.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e;
        const message = createBasePythPriceState();
        message.priceId = (_a = object.priceId) !== null && _a !== void 0 ? _a : "";
        message.emaPrice = (_b = object.emaPrice) !== null && _b !== void 0 ? _b : "";
        message.emaConf = (_c = object.emaConf) !== null && _c !== void 0 ? _c : "";
        message.conf = (_d = object.conf) !== null && _d !== void 0 ? _d : "";
        message.publishTime = (_e = object.publishTime) !== null && _e !== void 0 ? _e : "0";
        message.priceState = (object.priceState !== undefined && object.priceState !== null)
            ? exports.PriceState.fromPartial(object.priceState)
            : undefined;
        return message;
    },
};
function createBaseBandOracleRequest() {
    return {
        requestId: "0",
        oracleScriptId: "0",
        symbols: [],
        askCount: "0",
        minCount: "0",
        feeLimit: [],
        prepareGas: "0",
        executeGas: "0",
        minSourceCount: "0",
    };
}
exports.BandOracleRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.requestId !== "0") {
            writer.uint32(8).uint64(message.requestId);
        }
        if (message.oracleScriptId !== "0") {
            writer.uint32(16).int64(message.oracleScriptId);
        }
        for (const v of message.symbols) {
            writer.uint32(26).string(v);
        }
        if (message.askCount !== "0") {
            writer.uint32(32).uint64(message.askCount);
        }
        if (message.minCount !== "0") {
            writer.uint32(40).uint64(message.minCount);
        }
        for (const v of message.feeLimit) {
            coin_1.Coin.encode(v, writer.uint32(50).fork()).ldelim();
        }
        if (message.prepareGas !== "0") {
            writer.uint32(56).uint64(message.prepareGas);
        }
        if (message.executeGas !== "0") {
            writer.uint32(64).uint64(message.executeGas);
        }
        if (message.minSourceCount !== "0") {
            writer.uint32(72).uint64(message.minSourceCount);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseBandOracleRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 8) {
                        break;
                    }
                    message.requestId = longToString(reader.uint64());
                    continue;
                case 2:
                    if (tag !== 16) {
                        break;
                    }
                    message.oracleScriptId = longToString(reader.int64());
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.symbols.push(reader.string());
                    continue;
                case 4:
                    if (tag !== 32) {
                        break;
                    }
                    message.askCount = longToString(reader.uint64());
                    continue;
                case 5:
                    if (tag !== 40) {
                        break;
                    }
                    message.minCount = longToString(reader.uint64());
                    continue;
                case 6:
                    if (tag !== 50) {
                        break;
                    }
                    message.feeLimit.push(coin_1.Coin.decode(reader, reader.uint32()));
                    continue;
                case 7:
                    if (tag !== 56) {
                        break;
                    }
                    message.prepareGas = longToString(reader.uint64());
                    continue;
                case 8:
                    if (tag !== 64) {
                        break;
                    }
                    message.executeGas = longToString(reader.uint64());
                    continue;
                case 9:
                    if (tag !== 72) {
                        break;
                    }
                    message.minSourceCount = longToString(reader.uint64());
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
            requestId: isSet(object.requestId) ? String(object.requestId) : "0",
            oracleScriptId: isSet(object.oracleScriptId) ? String(object.oracleScriptId) : "0",
            symbols: Array.isArray(object === null || object === void 0 ? void 0 : object.symbols) ? object.symbols.map((e) => String(e)) : [],
            askCount: isSet(object.askCount) ? String(object.askCount) : "0",
            minCount: isSet(object.minCount) ? String(object.minCount) : "0",
            feeLimit: Array.isArray(object === null || object === void 0 ? void 0 : object.feeLimit) ? object.feeLimit.map((e) => coin_1.Coin.fromJSON(e)) : [],
            prepareGas: isSet(object.prepareGas) ? String(object.prepareGas) : "0",
            executeGas: isSet(object.executeGas) ? String(object.executeGas) : "0",
            minSourceCount: isSet(object.minSourceCount) ? String(object.minSourceCount) : "0",
        };
    },
    toJSON(message) {
        const obj = {};
        message.requestId !== undefined && (obj.requestId = message.requestId);
        message.oracleScriptId !== undefined && (obj.oracleScriptId = message.oracleScriptId);
        if (message.symbols) {
            obj.symbols = message.symbols.map((e) => e);
        }
        else {
            obj.symbols = [];
        }
        message.askCount !== undefined && (obj.askCount = message.askCount);
        message.minCount !== undefined && (obj.minCount = message.minCount);
        if (message.feeLimit) {
            obj.feeLimit = message.feeLimit.map((e) => e ? coin_1.Coin.toJSON(e) : undefined);
        }
        else {
            obj.feeLimit = [];
        }
        message.prepareGas !== undefined && (obj.prepareGas = message.prepareGas);
        message.executeGas !== undefined && (obj.executeGas = message.executeGas);
        message.minSourceCount !== undefined && (obj.minSourceCount = message.minSourceCount);
        return obj;
    },
    create(base) {
        return exports.BandOracleRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const message = createBaseBandOracleRequest();
        message.requestId = (_a = object.requestId) !== null && _a !== void 0 ? _a : "0";
        message.oracleScriptId = (_b = object.oracleScriptId) !== null && _b !== void 0 ? _b : "0";
        message.symbols = ((_c = object.symbols) === null || _c === void 0 ? void 0 : _c.map((e) => e)) || [];
        message.askCount = (_d = object.askCount) !== null && _d !== void 0 ? _d : "0";
        message.minCount = (_e = object.minCount) !== null && _e !== void 0 ? _e : "0";
        message.feeLimit = ((_f = object.feeLimit) === null || _f === void 0 ? void 0 : _f.map((e) => coin_1.Coin.fromPartial(e))) || [];
        message.prepareGas = (_g = object.prepareGas) !== null && _g !== void 0 ? _g : "0";
        message.executeGas = (_h = object.executeGas) !== null && _h !== void 0 ? _h : "0";
        message.minSourceCount = (_j = object.minSourceCount) !== null && _j !== void 0 ? _j : "0";
        return message;
    },
};
function createBaseBandIBCParams() {
    return {
        bandIbcEnabled: false,
        ibcRequestInterval: "0",
        ibcSourceChannel: "",
        ibcVersion: "",
        ibcPortId: "",
        legacyOracleIds: [],
    };
}
exports.BandIBCParams = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.bandIbcEnabled === true) {
            writer.uint32(8).bool(message.bandIbcEnabled);
        }
        if (message.ibcRequestInterval !== "0") {
            writer.uint32(16).int64(message.ibcRequestInterval);
        }
        if (message.ibcSourceChannel !== "") {
            writer.uint32(26).string(message.ibcSourceChannel);
        }
        if (message.ibcVersion !== "") {
            writer.uint32(34).string(message.ibcVersion);
        }
        if (message.ibcPortId !== "") {
            writer.uint32(42).string(message.ibcPortId);
        }
        writer.uint32(50).fork();
        for (const v of message.legacyOracleIds) {
            writer.int64(v);
        }
        writer.ldelim();
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseBandIBCParams();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 8) {
                        break;
                    }
                    message.bandIbcEnabled = reader.bool();
                    continue;
                case 2:
                    if (tag !== 16) {
                        break;
                    }
                    message.ibcRequestInterval = longToString(reader.int64());
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.ibcSourceChannel = reader.string();
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.ibcVersion = reader.string();
                    continue;
                case 5:
                    if (tag !== 42) {
                        break;
                    }
                    message.ibcPortId = reader.string();
                    continue;
                case 6:
                    if (tag === 48) {
                        message.legacyOracleIds.push(longToString(reader.int64()));
                        continue;
                    }
                    if (tag === 50) {
                        const end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2) {
                            message.legacyOracleIds.push(longToString(reader.int64()));
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
            bandIbcEnabled: isSet(object.bandIbcEnabled) ? Boolean(object.bandIbcEnabled) : false,
            ibcRequestInterval: isSet(object.ibcRequestInterval) ? String(object.ibcRequestInterval) : "0",
            ibcSourceChannel: isSet(object.ibcSourceChannel) ? String(object.ibcSourceChannel) : "",
            ibcVersion: isSet(object.ibcVersion) ? String(object.ibcVersion) : "",
            ibcPortId: isSet(object.ibcPortId) ? String(object.ibcPortId) : "",
            legacyOracleIds: Array.isArray(object === null || object === void 0 ? void 0 : object.legacyOracleIds) ? object.legacyOracleIds.map((e) => String(e)) : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.bandIbcEnabled !== undefined && (obj.bandIbcEnabled = message.bandIbcEnabled);
        message.ibcRequestInterval !== undefined && (obj.ibcRequestInterval = message.ibcRequestInterval);
        message.ibcSourceChannel !== undefined && (obj.ibcSourceChannel = message.ibcSourceChannel);
        message.ibcVersion !== undefined && (obj.ibcVersion = message.ibcVersion);
        message.ibcPortId !== undefined && (obj.ibcPortId = message.ibcPortId);
        if (message.legacyOracleIds) {
            obj.legacyOracleIds = message.legacyOracleIds.map((e) => e);
        }
        else {
            obj.legacyOracleIds = [];
        }
        return obj;
    },
    create(base) {
        return exports.BandIBCParams.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f;
        const message = createBaseBandIBCParams();
        message.bandIbcEnabled = (_a = object.bandIbcEnabled) !== null && _a !== void 0 ? _a : false;
        message.ibcRequestInterval = (_b = object.ibcRequestInterval) !== null && _b !== void 0 ? _b : "0";
        message.ibcSourceChannel = (_c = object.ibcSourceChannel) !== null && _c !== void 0 ? _c : "";
        message.ibcVersion = (_d = object.ibcVersion) !== null && _d !== void 0 ? _d : "";
        message.ibcPortId = (_e = object.ibcPortId) !== null && _e !== void 0 ? _e : "";
        message.legacyOracleIds = ((_f = object.legacyOracleIds) === null || _f === void 0 ? void 0 : _f.map((e) => e)) || [];
        return message;
    },
};
function createBaseSymbolPriceTimestamp() {
    return { oracle: 0, symbolId: "", timestamp: "0" };
}
exports.SymbolPriceTimestamp = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.oracle !== 0) {
            writer.uint32(8).int32(message.oracle);
        }
        if (message.symbolId !== "") {
            writer.uint32(18).string(message.symbolId);
        }
        if (message.timestamp !== "0") {
            writer.uint32(24).int64(message.timestamp);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseSymbolPriceTimestamp();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 8) {
                        break;
                    }
                    message.oracle = reader.int32();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.symbolId = reader.string();
                    continue;
                case 3:
                    if (tag !== 24) {
                        break;
                    }
                    message.timestamp = longToString(reader.int64());
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
            oracle: isSet(object.oracle) ? oracleTypeFromJSON(object.oracle) : 0,
            symbolId: isSet(object.symbolId) ? String(object.symbolId) : "",
            timestamp: isSet(object.timestamp) ? String(object.timestamp) : "0",
        };
    },
    toJSON(message) {
        const obj = {};
        message.oracle !== undefined && (obj.oracle = oracleTypeToJSON(message.oracle));
        message.symbolId !== undefined && (obj.symbolId = message.symbolId);
        message.timestamp !== undefined && (obj.timestamp = message.timestamp);
        return obj;
    },
    create(base) {
        return exports.SymbolPriceTimestamp.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseSymbolPriceTimestamp();
        message.oracle = (_a = object.oracle) !== null && _a !== void 0 ? _a : 0;
        message.symbolId = (_b = object.symbolId) !== null && _b !== void 0 ? _b : "";
        message.timestamp = (_c = object.timestamp) !== null && _c !== void 0 ? _c : "0";
        return message;
    },
};
function createBaseLastPriceTimestamps() {
    return { lastPriceTimestamps: [] };
}
exports.LastPriceTimestamps = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.lastPriceTimestamps) {
            exports.SymbolPriceTimestamp.encode(v, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseLastPriceTimestamps();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.lastPriceTimestamps.push(exports.SymbolPriceTimestamp.decode(reader, reader.uint32()));
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
            lastPriceTimestamps: Array.isArray(object === null || object === void 0 ? void 0 : object.lastPriceTimestamps)
                ? object.lastPriceTimestamps.map((e) => exports.SymbolPriceTimestamp.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.lastPriceTimestamps) {
            obj.lastPriceTimestamps = message.lastPriceTimestamps.map((e) => e ? exports.SymbolPriceTimestamp.toJSON(e) : undefined);
        }
        else {
            obj.lastPriceTimestamps = [];
        }
        return obj;
    },
    create(base) {
        return exports.LastPriceTimestamps.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseLastPriceTimestamps();
        message.lastPriceTimestamps = ((_a = object.lastPriceTimestamps) === null || _a === void 0 ? void 0 : _a.map((e) => exports.SymbolPriceTimestamp.fromPartial(e))) || [];
        return message;
    },
};
function createBasePriceRecords() {
    return { oracle: 0, symbolId: "", latestPriceRecords: [] };
}
exports.PriceRecords = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.oracle !== 0) {
            writer.uint32(8).int32(message.oracle);
        }
        if (message.symbolId !== "") {
            writer.uint32(18).string(message.symbolId);
        }
        for (const v of message.latestPriceRecords) {
            exports.PriceRecord.encode(v, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasePriceRecords();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 8) {
                        break;
                    }
                    message.oracle = reader.int32();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.symbolId = reader.string();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.latestPriceRecords.push(exports.PriceRecord.decode(reader, reader.uint32()));
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
            oracle: isSet(object.oracle) ? oracleTypeFromJSON(object.oracle) : 0,
            symbolId: isSet(object.symbolId) ? String(object.symbolId) : "",
            latestPriceRecords: Array.isArray(object === null || object === void 0 ? void 0 : object.latestPriceRecords)
                ? object.latestPriceRecords.map((e) => exports.PriceRecord.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.oracle !== undefined && (obj.oracle = oracleTypeToJSON(message.oracle));
        message.symbolId !== undefined && (obj.symbolId = message.symbolId);
        if (message.latestPriceRecords) {
            obj.latestPriceRecords = message.latestPriceRecords.map((e) => e ? exports.PriceRecord.toJSON(e) : undefined);
        }
        else {
            obj.latestPriceRecords = [];
        }
        return obj;
    },
    create(base) {
        return exports.PriceRecords.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBasePriceRecords();
        message.oracle = (_a = object.oracle) !== null && _a !== void 0 ? _a : 0;
        message.symbolId = (_b = object.symbolId) !== null && _b !== void 0 ? _b : "";
        message.latestPriceRecords = ((_c = object.latestPriceRecords) === null || _c === void 0 ? void 0 : _c.map((e) => exports.PriceRecord.fromPartial(e))) || [];
        return message;
    },
};
function createBasePriceRecord() {
    return { timestamp: "0", price: "" };
}
exports.PriceRecord = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.timestamp !== "0") {
            writer.uint32(8).int64(message.timestamp);
        }
        if (message.price !== "") {
            writer.uint32(18).string(message.price);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasePriceRecord();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 8) {
                        break;
                    }
                    message.timestamp = longToString(reader.int64());
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.price = reader.string();
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
            timestamp: isSet(object.timestamp) ? String(object.timestamp) : "0",
            price: isSet(object.price) ? String(object.price) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.timestamp !== undefined && (obj.timestamp = message.timestamp);
        message.price !== undefined && (obj.price = message.price);
        return obj;
    },
    create(base) {
        return exports.PriceRecord.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBasePriceRecord();
        message.timestamp = (_a = object.timestamp) !== null && _a !== void 0 ? _a : "0";
        message.price = (_b = object.price) !== null && _b !== void 0 ? _b : "";
        return message;
    },
};
function createBaseMetadataStatistics() {
    return {
        groupCount: 0,
        recordsSampleSize: 0,
        mean: "",
        twap: "",
        firstTimestamp: "0",
        lastTimestamp: "0",
        minPrice: "",
        maxPrice: "",
        medianPrice: "",
    };
}
exports.MetadataStatistics = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.groupCount !== 0) {
            writer.uint32(8).uint32(message.groupCount);
        }
        if (message.recordsSampleSize !== 0) {
            writer.uint32(16).uint32(message.recordsSampleSize);
        }
        if (message.mean !== "") {
            writer.uint32(26).string(message.mean);
        }
        if (message.twap !== "") {
            writer.uint32(34).string(message.twap);
        }
        if (message.firstTimestamp !== "0") {
            writer.uint32(40).int64(message.firstTimestamp);
        }
        if (message.lastTimestamp !== "0") {
            writer.uint32(48).int64(message.lastTimestamp);
        }
        if (message.minPrice !== "") {
            writer.uint32(58).string(message.minPrice);
        }
        if (message.maxPrice !== "") {
            writer.uint32(66).string(message.maxPrice);
        }
        if (message.medianPrice !== "") {
            writer.uint32(74).string(message.medianPrice);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMetadataStatistics();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 8) {
                        break;
                    }
                    message.groupCount = reader.uint32();
                    continue;
                case 2:
                    if (tag !== 16) {
                        break;
                    }
                    message.recordsSampleSize = reader.uint32();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.mean = reader.string();
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.twap = reader.string();
                    continue;
                case 5:
                    if (tag !== 40) {
                        break;
                    }
                    message.firstTimestamp = longToString(reader.int64());
                    continue;
                case 6:
                    if (tag !== 48) {
                        break;
                    }
                    message.lastTimestamp = longToString(reader.int64());
                    continue;
                case 7:
                    if (tag !== 58) {
                        break;
                    }
                    message.minPrice = reader.string();
                    continue;
                case 8:
                    if (tag !== 66) {
                        break;
                    }
                    message.maxPrice = reader.string();
                    continue;
                case 9:
                    if (tag !== 74) {
                        break;
                    }
                    message.medianPrice = reader.string();
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
            groupCount: isSet(object.groupCount) ? Number(object.groupCount) : 0,
            recordsSampleSize: isSet(object.recordsSampleSize) ? Number(object.recordsSampleSize) : 0,
            mean: isSet(object.mean) ? String(object.mean) : "",
            twap: isSet(object.twap) ? String(object.twap) : "",
            firstTimestamp: isSet(object.firstTimestamp) ? String(object.firstTimestamp) : "0",
            lastTimestamp: isSet(object.lastTimestamp) ? String(object.lastTimestamp) : "0",
            minPrice: isSet(object.minPrice) ? String(object.minPrice) : "",
            maxPrice: isSet(object.maxPrice) ? String(object.maxPrice) : "",
            medianPrice: isSet(object.medianPrice) ? String(object.medianPrice) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.groupCount !== undefined && (obj.groupCount = Math.round(message.groupCount));
        message.recordsSampleSize !== undefined && (obj.recordsSampleSize = Math.round(message.recordsSampleSize));
        message.mean !== undefined && (obj.mean = message.mean);
        message.twap !== undefined && (obj.twap = message.twap);
        message.firstTimestamp !== undefined && (obj.firstTimestamp = message.firstTimestamp);
        message.lastTimestamp !== undefined && (obj.lastTimestamp = message.lastTimestamp);
        message.minPrice !== undefined && (obj.minPrice = message.minPrice);
        message.maxPrice !== undefined && (obj.maxPrice = message.maxPrice);
        message.medianPrice !== undefined && (obj.medianPrice = message.medianPrice);
        return obj;
    },
    create(base) {
        return exports.MetadataStatistics.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const message = createBaseMetadataStatistics();
        message.groupCount = (_a = object.groupCount) !== null && _a !== void 0 ? _a : 0;
        message.recordsSampleSize = (_b = object.recordsSampleSize) !== null && _b !== void 0 ? _b : 0;
        message.mean = (_c = object.mean) !== null && _c !== void 0 ? _c : "";
        message.twap = (_d = object.twap) !== null && _d !== void 0 ? _d : "";
        message.firstTimestamp = (_e = object.firstTimestamp) !== null && _e !== void 0 ? _e : "0";
        message.lastTimestamp = (_f = object.lastTimestamp) !== null && _f !== void 0 ? _f : "0";
        message.minPrice = (_g = object.minPrice) !== null && _g !== void 0 ? _g : "";
        message.maxPrice = (_h = object.maxPrice) !== null && _h !== void 0 ? _h : "";
        message.medianPrice = (_j = object.medianPrice) !== null && _j !== void 0 ? _j : "";
        return message;
    },
};
function createBasePriceAttestation() {
    return { priceId: "", price: "0", conf: "0", expo: 0, emaPrice: "0", emaConf: "0", emaExpo: 0, publishTime: "0" };
}
exports.PriceAttestation = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.priceId !== "") {
            writer.uint32(10).string(message.priceId);
        }
        if (message.price !== "0") {
            writer.uint32(16).int64(message.price);
        }
        if (message.conf !== "0") {
            writer.uint32(24).uint64(message.conf);
        }
        if (message.expo !== 0) {
            writer.uint32(32).int32(message.expo);
        }
        if (message.emaPrice !== "0") {
            writer.uint32(40).int64(message.emaPrice);
        }
        if (message.emaConf !== "0") {
            writer.uint32(48).uint64(message.emaConf);
        }
        if (message.emaExpo !== 0) {
            writer.uint32(56).int32(message.emaExpo);
        }
        if (message.publishTime !== "0") {
            writer.uint32(64).int64(message.publishTime);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasePriceAttestation();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.priceId = reader.string();
                    continue;
                case 2:
                    if (tag !== 16) {
                        break;
                    }
                    message.price = longToString(reader.int64());
                    continue;
                case 3:
                    if (tag !== 24) {
                        break;
                    }
                    message.conf = longToString(reader.uint64());
                    continue;
                case 4:
                    if (tag !== 32) {
                        break;
                    }
                    message.expo = reader.int32();
                    continue;
                case 5:
                    if (tag !== 40) {
                        break;
                    }
                    message.emaPrice = longToString(reader.int64());
                    continue;
                case 6:
                    if (tag !== 48) {
                        break;
                    }
                    message.emaConf = longToString(reader.uint64());
                    continue;
                case 7:
                    if (tag !== 56) {
                        break;
                    }
                    message.emaExpo = reader.int32();
                    continue;
                case 8:
                    if (tag !== 64) {
                        break;
                    }
                    message.publishTime = longToString(reader.int64());
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
            priceId: isSet(object.priceId) ? String(object.priceId) : "",
            price: isSet(object.price) ? String(object.price) : "0",
            conf: isSet(object.conf) ? String(object.conf) : "0",
            expo: isSet(object.expo) ? Number(object.expo) : 0,
            emaPrice: isSet(object.emaPrice) ? String(object.emaPrice) : "0",
            emaConf: isSet(object.emaConf) ? String(object.emaConf) : "0",
            emaExpo: isSet(object.emaExpo) ? Number(object.emaExpo) : 0,
            publishTime: isSet(object.publishTime) ? String(object.publishTime) : "0",
        };
    },
    toJSON(message) {
        const obj = {};
        message.priceId !== undefined && (obj.priceId = message.priceId);
        message.price !== undefined && (obj.price = message.price);
        message.conf !== undefined && (obj.conf = message.conf);
        message.expo !== undefined && (obj.expo = Math.round(message.expo));
        message.emaPrice !== undefined && (obj.emaPrice = message.emaPrice);
        message.emaConf !== undefined && (obj.emaConf = message.emaConf);
        message.emaExpo !== undefined && (obj.emaExpo = Math.round(message.emaExpo));
        message.publishTime !== undefined && (obj.publishTime = message.publishTime);
        return obj;
    },
    create(base) {
        return exports.PriceAttestation.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const message = createBasePriceAttestation();
        message.priceId = (_a = object.priceId) !== null && _a !== void 0 ? _a : "";
        message.price = (_b = object.price) !== null && _b !== void 0 ? _b : "0";
        message.conf = (_c = object.conf) !== null && _c !== void 0 ? _c : "0";
        message.expo = (_d = object.expo) !== null && _d !== void 0 ? _d : 0;
        message.emaPrice = (_e = object.emaPrice) !== null && _e !== void 0 ? _e : "0";
        message.emaConf = (_f = object.emaConf) !== null && _f !== void 0 ? _f : "0";
        message.emaExpo = (_g = object.emaExpo) !== null && _g !== void 0 ? _g : 0;
        message.publishTime = (_h = object.publishTime) !== null && _h !== void 0 ? _h : "0";
        return message;
    },
};
function longToString(long) {
    return long.toString();
}
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
function isSet(value) {
    return value !== null && value !== undefined;
}
