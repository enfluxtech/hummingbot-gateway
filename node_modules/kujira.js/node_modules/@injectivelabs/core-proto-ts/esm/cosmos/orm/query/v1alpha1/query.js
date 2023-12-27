/* eslint-disable */
import { grpc } from "@injectivelabs/grpc-web";
import { BrowserHeaders } from "browser-headers";
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Any } from "../../../../google/protobuf/any";
import { Duration } from "../../../../google/protobuf/duration";
import { Timestamp } from "../../../../google/protobuf/timestamp";
import { PageRequest, PageResponse } from "../../../base/query/v1beta1/pagination";
function createBaseGetRequest() {
    return { messageName: "", index: "", values: [] };
}
export const GetRequest = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.messageName !== "") {
            writer.uint32(10).string(message.messageName);
        }
        if (message.index !== "") {
            writer.uint32(18).string(message.index);
        }
        for (const v of message.values) {
            IndexValue.encode(v, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGetRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.messageName = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.index = reader.string();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.values.push(IndexValue.decode(reader, reader.uint32()));
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
            messageName: isSet(object.messageName) ? String(object.messageName) : "",
            index: isSet(object.index) ? String(object.index) : "",
            values: Array.isArray(object === null || object === void 0 ? void 0 : object.values) ? object.values.map((e) => IndexValue.fromJSON(e)) : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.messageName !== undefined && (obj.messageName = message.messageName);
        message.index !== undefined && (obj.index = message.index);
        if (message.values) {
            obj.values = message.values.map((e) => e ? IndexValue.toJSON(e) : undefined);
        }
        else {
            obj.values = [];
        }
        return obj;
    },
    create(base) {
        return GetRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseGetRequest();
        message.messageName = (_a = object.messageName) !== null && _a !== void 0 ? _a : "";
        message.index = (_b = object.index) !== null && _b !== void 0 ? _b : "";
        message.values = ((_c = object.values) === null || _c === void 0 ? void 0 : _c.map((e) => IndexValue.fromPartial(e))) || [];
        return message;
    },
};
function createBaseGetResponse() {
    return { result: undefined };
}
export const GetResponse = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.result !== undefined) {
            Any.encode(message.result, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGetResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.result = Any.decode(reader, reader.uint32());
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
        return { result: isSet(object.result) ? Any.fromJSON(object.result) : undefined };
    },
    toJSON(message) {
        const obj = {};
        message.result !== undefined && (obj.result = message.result ? Any.toJSON(message.result) : undefined);
        return obj;
    },
    create(base) {
        return GetResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        const message = createBaseGetResponse();
        message.result = (object.result !== undefined && object.result !== null)
            ? Any.fromPartial(object.result)
            : undefined;
        return message;
    },
};
function createBaseListRequest() {
    return { messageName: "", index: "", prefix: undefined, range: undefined, pagination: undefined };
}
export const ListRequest = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.messageName !== "") {
            writer.uint32(10).string(message.messageName);
        }
        if (message.index !== "") {
            writer.uint32(18).string(message.index);
        }
        if (message.prefix !== undefined) {
            ListRequest_Prefix.encode(message.prefix, writer.uint32(26).fork()).ldelim();
        }
        if (message.range !== undefined) {
            ListRequest_Range.encode(message.range, writer.uint32(34).fork()).ldelim();
        }
        if (message.pagination !== undefined) {
            PageRequest.encode(message.pagination, writer.uint32(42).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseListRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.messageName = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.index = reader.string();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.prefix = ListRequest_Prefix.decode(reader, reader.uint32());
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.range = ListRequest_Range.decode(reader, reader.uint32());
                    continue;
                case 5:
                    if (tag !== 42) {
                        break;
                    }
                    message.pagination = PageRequest.decode(reader, reader.uint32());
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
            messageName: isSet(object.messageName) ? String(object.messageName) : "",
            index: isSet(object.index) ? String(object.index) : "",
            prefix: isSet(object.prefix) ? ListRequest_Prefix.fromJSON(object.prefix) : undefined,
            range: isSet(object.range) ? ListRequest_Range.fromJSON(object.range) : undefined,
            pagination: isSet(object.pagination) ? PageRequest.fromJSON(object.pagination) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.messageName !== undefined && (obj.messageName = message.messageName);
        message.index !== undefined && (obj.index = message.index);
        message.prefix !== undefined &&
            (obj.prefix = message.prefix ? ListRequest_Prefix.toJSON(message.prefix) : undefined);
        message.range !== undefined && (obj.range = message.range ? ListRequest_Range.toJSON(message.range) : undefined);
        message.pagination !== undefined &&
            (obj.pagination = message.pagination ? PageRequest.toJSON(message.pagination) : undefined);
        return obj;
    },
    create(base) {
        return ListRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseListRequest();
        message.messageName = (_a = object.messageName) !== null && _a !== void 0 ? _a : "";
        message.index = (_b = object.index) !== null && _b !== void 0 ? _b : "";
        message.prefix = (object.prefix !== undefined && object.prefix !== null)
            ? ListRequest_Prefix.fromPartial(object.prefix)
            : undefined;
        message.range = (object.range !== undefined && object.range !== null)
            ? ListRequest_Range.fromPartial(object.range)
            : undefined;
        message.pagination = (object.pagination !== undefined && object.pagination !== null)
            ? PageRequest.fromPartial(object.pagination)
            : undefined;
        return message;
    },
};
function createBaseListRequest_Prefix() {
    return { values: [] };
}
export const ListRequest_Prefix = {
    encode(message, writer = _m0.Writer.create()) {
        for (const v of message.values) {
            IndexValue.encode(v, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseListRequest_Prefix();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.values.push(IndexValue.decode(reader, reader.uint32()));
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
        return { values: Array.isArray(object === null || object === void 0 ? void 0 : object.values) ? object.values.map((e) => IndexValue.fromJSON(e)) : [] };
    },
    toJSON(message) {
        const obj = {};
        if (message.values) {
            obj.values = message.values.map((e) => e ? IndexValue.toJSON(e) : undefined);
        }
        else {
            obj.values = [];
        }
        return obj;
    },
    create(base) {
        return ListRequest_Prefix.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseListRequest_Prefix();
        message.values = ((_a = object.values) === null || _a === void 0 ? void 0 : _a.map((e) => IndexValue.fromPartial(e))) || [];
        return message;
    },
};
function createBaseListRequest_Range() {
    return { start: [], end: [] };
}
export const ListRequest_Range = {
    encode(message, writer = _m0.Writer.create()) {
        for (const v of message.start) {
            IndexValue.encode(v, writer.uint32(10).fork()).ldelim();
        }
        for (const v of message.end) {
            IndexValue.encode(v, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseListRequest_Range();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.start.push(IndexValue.decode(reader, reader.uint32()));
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.end.push(IndexValue.decode(reader, reader.uint32()));
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
            start: Array.isArray(object === null || object === void 0 ? void 0 : object.start) ? object.start.map((e) => IndexValue.fromJSON(e)) : [],
            end: Array.isArray(object === null || object === void 0 ? void 0 : object.end) ? object.end.map((e) => IndexValue.fromJSON(e)) : [],
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.start) {
            obj.start = message.start.map((e) => e ? IndexValue.toJSON(e) : undefined);
        }
        else {
            obj.start = [];
        }
        if (message.end) {
            obj.end = message.end.map((e) => e ? IndexValue.toJSON(e) : undefined);
        }
        else {
            obj.end = [];
        }
        return obj;
    },
    create(base) {
        return ListRequest_Range.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseListRequest_Range();
        message.start = ((_a = object.start) === null || _a === void 0 ? void 0 : _a.map((e) => IndexValue.fromPartial(e))) || [];
        message.end = ((_b = object.end) === null || _b === void 0 ? void 0 : _b.map((e) => IndexValue.fromPartial(e))) || [];
        return message;
    },
};
function createBaseListResponse() {
    return { results: [], pagination: undefined };
}
export const ListResponse = {
    encode(message, writer = _m0.Writer.create()) {
        for (const v of message.results) {
            Any.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (message.pagination !== undefined) {
            PageResponse.encode(message.pagination, writer.uint32(42).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseListResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.results.push(Any.decode(reader, reader.uint32()));
                    continue;
                case 5:
                    if (tag !== 42) {
                        break;
                    }
                    message.pagination = PageResponse.decode(reader, reader.uint32());
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
            results: Array.isArray(object === null || object === void 0 ? void 0 : object.results) ? object.results.map((e) => Any.fromJSON(e)) : [],
            pagination: isSet(object.pagination) ? PageResponse.fromJSON(object.pagination) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.results) {
            obj.results = message.results.map((e) => e ? Any.toJSON(e) : undefined);
        }
        else {
            obj.results = [];
        }
        message.pagination !== undefined &&
            (obj.pagination = message.pagination ? PageResponse.toJSON(message.pagination) : undefined);
        return obj;
    },
    create(base) {
        return ListResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseListResponse();
        message.results = ((_a = object.results) === null || _a === void 0 ? void 0 : _a.map((e) => Any.fromPartial(e))) || [];
        message.pagination = (object.pagination !== undefined && object.pagination !== null)
            ? PageResponse.fromPartial(object.pagination)
            : undefined;
        return message;
    },
};
function createBaseIndexValue() {
    return {
        uint: undefined,
        int: undefined,
        str: undefined,
        bytes: undefined,
        enum: undefined,
        bool: undefined,
        timestamp: undefined,
        duration: undefined,
    };
}
export const IndexValue = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.uint !== undefined) {
            writer.uint32(8).uint64(message.uint);
        }
        if (message.int !== undefined) {
            writer.uint32(16).int64(message.int);
        }
        if (message.str !== undefined) {
            writer.uint32(26).string(message.str);
        }
        if (message.bytes !== undefined) {
            writer.uint32(34).bytes(message.bytes);
        }
        if (message.enum !== undefined) {
            writer.uint32(42).string(message.enum);
        }
        if (message.bool !== undefined) {
            writer.uint32(48).bool(message.bool);
        }
        if (message.timestamp !== undefined) {
            Timestamp.encode(toTimestamp(message.timestamp), writer.uint32(58).fork()).ldelim();
        }
        if (message.duration !== undefined) {
            Duration.encode(message.duration, writer.uint32(66).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseIndexValue();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 8) {
                        break;
                    }
                    message.uint = longToString(reader.uint64());
                    continue;
                case 2:
                    if (tag !== 16) {
                        break;
                    }
                    message.int = longToString(reader.int64());
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.str = reader.string();
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.bytes = reader.bytes();
                    continue;
                case 5:
                    if (tag !== 42) {
                        break;
                    }
                    message.enum = reader.string();
                    continue;
                case 6:
                    if (tag !== 48) {
                        break;
                    }
                    message.bool = reader.bool();
                    continue;
                case 7:
                    if (tag !== 58) {
                        break;
                    }
                    message.timestamp = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
                    continue;
                case 8:
                    if (tag !== 66) {
                        break;
                    }
                    message.duration = Duration.decode(reader, reader.uint32());
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
            uint: isSet(object.uint) ? String(object.uint) : undefined,
            int: isSet(object.int) ? String(object.int) : undefined,
            str: isSet(object.str) ? String(object.str) : undefined,
            bytes: isSet(object.bytes) ? bytesFromBase64(object.bytes) : undefined,
            enum: isSet(object.enum) ? String(object.enum) : undefined,
            bool: isSet(object.bool) ? Boolean(object.bool) : undefined,
            timestamp: isSet(object.timestamp) ? fromJsonTimestamp(object.timestamp) : undefined,
            duration: isSet(object.duration) ? Duration.fromJSON(object.duration) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.uint !== undefined && (obj.uint = message.uint);
        message.int !== undefined && (obj.int = message.int);
        message.str !== undefined && (obj.str = message.str);
        message.bytes !== undefined &&
            (obj.bytes = message.bytes !== undefined ? base64FromBytes(message.bytes) : undefined);
        message.enum !== undefined && (obj.enum = message.enum);
        message.bool !== undefined && (obj.bool = message.bool);
        message.timestamp !== undefined && (obj.timestamp = message.timestamp.toISOString());
        message.duration !== undefined && (obj.duration = message.duration ? Duration.toJSON(message.duration) : undefined);
        return obj;
    },
    create(base) {
        return IndexValue.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f, _g;
        const message = createBaseIndexValue();
        message.uint = (_a = object.uint) !== null && _a !== void 0 ? _a : undefined;
        message.int = (_b = object.int) !== null && _b !== void 0 ? _b : undefined;
        message.str = (_c = object.str) !== null && _c !== void 0 ? _c : undefined;
        message.bytes = (_d = object.bytes) !== null && _d !== void 0 ? _d : undefined;
        message.enum = (_e = object.enum) !== null && _e !== void 0 ? _e : undefined;
        message.bool = (_f = object.bool) !== null && _f !== void 0 ? _f : undefined;
        message.timestamp = (_g = object.timestamp) !== null && _g !== void 0 ? _g : undefined;
        message.duration = (object.duration !== undefined && object.duration !== null)
            ? Duration.fromPartial(object.duration)
            : undefined;
        return message;
    },
};
export class QueryClientImpl {
    constructor(rpc) {
        this.rpc = rpc;
        this.Get = this.Get.bind(this);
        this.List = this.List.bind(this);
    }
    Get(request, metadata) {
        return this.rpc.unary(QueryGetDesc, GetRequest.fromPartial(request), metadata);
    }
    List(request, metadata) {
        return this.rpc.unary(QueryListDesc, ListRequest.fromPartial(request), metadata);
    }
}
export const QueryDesc = { serviceName: "cosmos.orm.query.v1alpha1.Query" };
export const QueryGetDesc = {
    methodName: "Get",
    service: QueryDesc,
    requestStream: false,
    responseStream: false,
    requestType: {
        serializeBinary() {
            return GetRequest.encode(this).finish();
        },
    },
    responseType: {
        deserializeBinary(data) {
            const value = GetResponse.decode(data);
            return Object.assign(Object.assign({}, value), { toObject() {
                    return value;
                } });
        },
    },
};
export const QueryListDesc = {
    methodName: "List",
    service: QueryDesc,
    requestStream: false,
    responseStream: false,
    requestType: {
        serializeBinary() {
            return ListRequest.encode(this).finish();
        },
    },
    responseType: {
        deserializeBinary(data) {
            const value = ListResponse.decode(data);
            return Object.assign(Object.assign({}, value), { toObject() {
                    return value;
                } });
        },
    },
};
export class GrpcWebImpl {
    constructor(host, options) {
        this.host = host;
        this.options = options;
    }
    unary(methodDesc, _request, metadata) {
        var _a;
        const request = Object.assign(Object.assign({}, _request), methodDesc.requestType);
        const maybeCombinedMetadata = metadata && this.options.metadata
            ? new BrowserHeaders(Object.assign(Object.assign({}, (_a = this.options) === null || _a === void 0 ? void 0 : _a.metadata.headersMap), metadata === null || metadata === void 0 ? void 0 : metadata.headersMap))
            : metadata || this.options.metadata;
        return new Promise((resolve, reject) => {
            grpc.unary(methodDesc, {
                request,
                host: this.host,
                metadata: maybeCombinedMetadata,
                transport: this.options.transport,
                debug: this.options.debug,
                onEnd: function (response) {
                    if (response.status === grpc.Code.OK) {
                        resolve(response.message.toObject());
                    }
                    else {
                        const err = new GrpcWebError(response.statusMessage, response.status, response.trailers);
                        reject(err);
                    }
                },
            });
        });
    }
}
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
function toTimestamp(date) {
    const seconds = Math.trunc(date.getTime() / 1000).toString();
    const nanos = (date.getTime() % 1000) * 1000000;
    return { seconds, nanos };
}
function fromTimestamp(t) {
    let millis = (Number(t.seconds) || 0) * 1000;
    millis += (t.nanos || 0) / 1000000;
    return new Date(millis);
}
function fromJsonTimestamp(o) {
    if (o instanceof Date) {
        return o;
    }
    else if (typeof o === "string") {
        return new Date(o);
    }
    else {
        return fromTimestamp(Timestamp.fromJSON(o));
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
export class GrpcWebError extends tsProtoGlobalThis.Error {
    constructor(message, code, metadata) {
        super(message);
        this.code = code;
        this.metadata = metadata;
    }
}
