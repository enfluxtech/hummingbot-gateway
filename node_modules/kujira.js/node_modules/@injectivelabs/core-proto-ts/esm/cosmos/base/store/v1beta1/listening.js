/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { RequestBeginBlock, RequestDeliverTx, RequestEndBlock, ResponseBeginBlock, ResponseCommit, ResponseDeliverTx, ResponseEndBlock, } from "../../../../tendermint/abci/types";
function createBaseStoreKVPair() {
    return { storeKey: "", delete: false, key: new Uint8Array(), value: new Uint8Array() };
}
export const StoreKVPair = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.storeKey !== "") {
            writer.uint32(10).string(message.storeKey);
        }
        if (message.delete === true) {
            writer.uint32(16).bool(message.delete);
        }
        if (message.key.length !== 0) {
            writer.uint32(26).bytes(message.key);
        }
        if (message.value.length !== 0) {
            writer.uint32(34).bytes(message.value);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseStoreKVPair();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.storeKey = reader.string();
                    continue;
                case 2:
                    if (tag !== 16) {
                        break;
                    }
                    message.delete = reader.bool();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.key = reader.bytes();
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.value = reader.bytes();
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
            storeKey: isSet(object.storeKey) ? String(object.storeKey) : "",
            delete: isSet(object.delete) ? Boolean(object.delete) : false,
            key: isSet(object.key) ? bytesFromBase64(object.key) : new Uint8Array(),
            value: isSet(object.value) ? bytesFromBase64(object.value) : new Uint8Array(),
        };
    },
    toJSON(message) {
        const obj = {};
        message.storeKey !== undefined && (obj.storeKey = message.storeKey);
        message.delete !== undefined && (obj.delete = message.delete);
        message.key !== undefined &&
            (obj.key = base64FromBytes(message.key !== undefined ? message.key : new Uint8Array()));
        message.value !== undefined &&
            (obj.value = base64FromBytes(message.value !== undefined ? message.value : new Uint8Array()));
        return obj;
    },
    create(base) {
        return StoreKVPair.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaseStoreKVPair();
        message.storeKey = (_a = object.storeKey) !== null && _a !== void 0 ? _a : "";
        message.delete = (_b = object.delete) !== null && _b !== void 0 ? _b : false;
        message.key = (_c = object.key) !== null && _c !== void 0 ? _c : new Uint8Array();
        message.value = (_d = object.value) !== null && _d !== void 0 ? _d : new Uint8Array();
        return message;
    },
};
function createBaseBlockMetadata() {
    return {
        requestBeginBlock: undefined,
        responseBeginBlock: undefined,
        deliverTxs: [],
        requestEndBlock: undefined,
        responseEndBlock: undefined,
        responseCommit: undefined,
    };
}
export const BlockMetadata = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.requestBeginBlock !== undefined) {
            RequestBeginBlock.encode(message.requestBeginBlock, writer.uint32(10).fork()).ldelim();
        }
        if (message.responseBeginBlock !== undefined) {
            ResponseBeginBlock.encode(message.responseBeginBlock, writer.uint32(18).fork()).ldelim();
        }
        for (const v of message.deliverTxs) {
            BlockMetadata_DeliverTx.encode(v, writer.uint32(26).fork()).ldelim();
        }
        if (message.requestEndBlock !== undefined) {
            RequestEndBlock.encode(message.requestEndBlock, writer.uint32(34).fork()).ldelim();
        }
        if (message.responseEndBlock !== undefined) {
            ResponseEndBlock.encode(message.responseEndBlock, writer.uint32(42).fork()).ldelim();
        }
        if (message.responseCommit !== undefined) {
            ResponseCommit.encode(message.responseCommit, writer.uint32(50).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseBlockMetadata();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.requestBeginBlock = RequestBeginBlock.decode(reader, reader.uint32());
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.responseBeginBlock = ResponseBeginBlock.decode(reader, reader.uint32());
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.deliverTxs.push(BlockMetadata_DeliverTx.decode(reader, reader.uint32()));
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.requestEndBlock = RequestEndBlock.decode(reader, reader.uint32());
                    continue;
                case 5:
                    if (tag !== 42) {
                        break;
                    }
                    message.responseEndBlock = ResponseEndBlock.decode(reader, reader.uint32());
                    continue;
                case 6:
                    if (tag !== 50) {
                        break;
                    }
                    message.responseCommit = ResponseCommit.decode(reader, reader.uint32());
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
            requestBeginBlock: isSet(object.requestBeginBlock)
                ? RequestBeginBlock.fromJSON(object.requestBeginBlock)
                : undefined,
            responseBeginBlock: isSet(object.responseBeginBlock)
                ? ResponseBeginBlock.fromJSON(object.responseBeginBlock)
                : undefined,
            deliverTxs: Array.isArray(object === null || object === void 0 ? void 0 : object.deliverTxs)
                ? object.deliverTxs.map((e) => BlockMetadata_DeliverTx.fromJSON(e))
                : [],
            requestEndBlock: isSet(object.requestEndBlock) ? RequestEndBlock.fromJSON(object.requestEndBlock) : undefined,
            responseEndBlock: isSet(object.responseEndBlock) ? ResponseEndBlock.fromJSON(object.responseEndBlock) : undefined,
            responseCommit: isSet(object.responseCommit) ? ResponseCommit.fromJSON(object.responseCommit) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.requestBeginBlock !== undefined && (obj.requestBeginBlock = message.requestBeginBlock
            ? RequestBeginBlock.toJSON(message.requestBeginBlock)
            : undefined);
        message.responseBeginBlock !== undefined && (obj.responseBeginBlock = message.responseBeginBlock
            ? ResponseBeginBlock.toJSON(message.responseBeginBlock)
            : undefined);
        if (message.deliverTxs) {
            obj.deliverTxs = message.deliverTxs.map((e) => e ? BlockMetadata_DeliverTx.toJSON(e) : undefined);
        }
        else {
            obj.deliverTxs = [];
        }
        message.requestEndBlock !== undefined &&
            (obj.requestEndBlock = message.requestEndBlock ? RequestEndBlock.toJSON(message.requestEndBlock) : undefined);
        message.responseEndBlock !== undefined &&
            (obj.responseEndBlock = message.responseEndBlock ? ResponseEndBlock.toJSON(message.responseEndBlock) : undefined);
        message.responseCommit !== undefined &&
            (obj.responseCommit = message.responseCommit ? ResponseCommit.toJSON(message.responseCommit) : undefined);
        return obj;
    },
    create(base) {
        return BlockMetadata.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseBlockMetadata();
        message.requestBeginBlock = (object.requestBeginBlock !== undefined && object.requestBeginBlock !== null)
            ? RequestBeginBlock.fromPartial(object.requestBeginBlock)
            : undefined;
        message.responseBeginBlock = (object.responseBeginBlock !== undefined && object.responseBeginBlock !== null)
            ? ResponseBeginBlock.fromPartial(object.responseBeginBlock)
            : undefined;
        message.deliverTxs = ((_a = object.deliverTxs) === null || _a === void 0 ? void 0 : _a.map((e) => BlockMetadata_DeliverTx.fromPartial(e))) || [];
        message.requestEndBlock = (object.requestEndBlock !== undefined && object.requestEndBlock !== null)
            ? RequestEndBlock.fromPartial(object.requestEndBlock)
            : undefined;
        message.responseEndBlock = (object.responseEndBlock !== undefined && object.responseEndBlock !== null)
            ? ResponseEndBlock.fromPartial(object.responseEndBlock)
            : undefined;
        message.responseCommit = (object.responseCommit !== undefined && object.responseCommit !== null)
            ? ResponseCommit.fromPartial(object.responseCommit)
            : undefined;
        return message;
    },
};
function createBaseBlockMetadata_DeliverTx() {
    return { request: undefined, response: undefined };
}
export const BlockMetadata_DeliverTx = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.request !== undefined) {
            RequestDeliverTx.encode(message.request, writer.uint32(10).fork()).ldelim();
        }
        if (message.response !== undefined) {
            ResponseDeliverTx.encode(message.response, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseBlockMetadata_DeliverTx();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.request = RequestDeliverTx.decode(reader, reader.uint32());
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.response = ResponseDeliverTx.decode(reader, reader.uint32());
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
            request: isSet(object.request) ? RequestDeliverTx.fromJSON(object.request) : undefined,
            response: isSet(object.response) ? ResponseDeliverTx.fromJSON(object.response) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.request !== undefined &&
            (obj.request = message.request ? RequestDeliverTx.toJSON(message.request) : undefined);
        message.response !== undefined &&
            (obj.response = message.response ? ResponseDeliverTx.toJSON(message.response) : undefined);
        return obj;
    },
    create(base) {
        return BlockMetadata_DeliverTx.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        const message = createBaseBlockMetadata_DeliverTx();
        message.request = (object.request !== undefined && object.request !== null)
            ? RequestDeliverTx.fromPartial(object.request)
            : undefined;
        message.response = (object.response !== undefined && object.response !== null)
            ? ResponseDeliverTx.fromPartial(object.response)
            : undefined;
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
function isSet(value) {
    return value !== null && value !== undefined;
}
