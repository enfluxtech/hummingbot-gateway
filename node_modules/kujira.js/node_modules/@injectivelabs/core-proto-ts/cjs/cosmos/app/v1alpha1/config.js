"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GolangBinding = exports.ModuleConfig = exports.Config = void 0;
/* eslint-disable */
const minimal_1 = __importDefault(require("protobufjs/minimal"));
const any_1 = require("../../../google/protobuf/any");
function createBaseConfig() {
    return { modules: [], golangBindings: [] };
}
exports.Config = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.modules) {
            exports.ModuleConfig.encode(v, writer.uint32(10).fork()).ldelim();
        }
        for (const v of message.golangBindings) {
            exports.GolangBinding.encode(v, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseConfig();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.modules.push(exports.ModuleConfig.decode(reader, reader.uint32()));
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.golangBindings.push(exports.GolangBinding.decode(reader, reader.uint32()));
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
            modules: Array.isArray(object === null || object === void 0 ? void 0 : object.modules) ? object.modules.map((e) => exports.ModuleConfig.fromJSON(e)) : [],
            golangBindings: Array.isArray(object === null || object === void 0 ? void 0 : object.golangBindings)
                ? object.golangBindings.map((e) => exports.GolangBinding.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.modules) {
            obj.modules = message.modules.map((e) => e ? exports.ModuleConfig.toJSON(e) : undefined);
        }
        else {
            obj.modules = [];
        }
        if (message.golangBindings) {
            obj.golangBindings = message.golangBindings.map((e) => e ? exports.GolangBinding.toJSON(e) : undefined);
        }
        else {
            obj.golangBindings = [];
        }
        return obj;
    },
    create(base) {
        return exports.Config.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseConfig();
        message.modules = ((_a = object.modules) === null || _a === void 0 ? void 0 : _a.map((e) => exports.ModuleConfig.fromPartial(e))) || [];
        message.golangBindings = ((_b = object.golangBindings) === null || _b === void 0 ? void 0 : _b.map((e) => exports.GolangBinding.fromPartial(e))) || [];
        return message;
    },
};
function createBaseModuleConfig() {
    return { name: "", config: undefined, golangBindings: [] };
}
exports.ModuleConfig = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.name !== "") {
            writer.uint32(10).string(message.name);
        }
        if (message.config !== undefined) {
            any_1.Any.encode(message.config, writer.uint32(18).fork()).ldelim();
        }
        for (const v of message.golangBindings) {
            exports.GolangBinding.encode(v, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseModuleConfig();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.name = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.config = any_1.Any.decode(reader, reader.uint32());
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.golangBindings.push(exports.GolangBinding.decode(reader, reader.uint32()));
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
            name: isSet(object.name) ? String(object.name) : "",
            config: isSet(object.config) ? any_1.Any.fromJSON(object.config) : undefined,
            golangBindings: Array.isArray(object === null || object === void 0 ? void 0 : object.golangBindings)
                ? object.golangBindings.map((e) => exports.GolangBinding.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.name !== undefined && (obj.name = message.name);
        message.config !== undefined && (obj.config = message.config ? any_1.Any.toJSON(message.config) : undefined);
        if (message.golangBindings) {
            obj.golangBindings = message.golangBindings.map((e) => e ? exports.GolangBinding.toJSON(e) : undefined);
        }
        else {
            obj.golangBindings = [];
        }
        return obj;
    },
    create(base) {
        return exports.ModuleConfig.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseModuleConfig();
        message.name = (_a = object.name) !== null && _a !== void 0 ? _a : "";
        message.config = (object.config !== undefined && object.config !== null)
            ? any_1.Any.fromPartial(object.config)
            : undefined;
        message.golangBindings = ((_b = object.golangBindings) === null || _b === void 0 ? void 0 : _b.map((e) => exports.GolangBinding.fromPartial(e))) || [];
        return message;
    },
};
function createBaseGolangBinding() {
    return { interfaceType: "", implementation: "" };
}
exports.GolangBinding = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.interfaceType !== "") {
            writer.uint32(10).string(message.interfaceType);
        }
        if (message.implementation !== "") {
            writer.uint32(18).string(message.implementation);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGolangBinding();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.interfaceType = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.implementation = reader.string();
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
            interfaceType: isSet(object.interfaceType) ? String(object.interfaceType) : "",
            implementation: isSet(object.implementation) ? String(object.implementation) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.interfaceType !== undefined && (obj.interfaceType = message.interfaceType);
        message.implementation !== undefined && (obj.implementation = message.implementation);
        return obj;
    },
    create(base) {
        return exports.GolangBinding.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseGolangBinding();
        message.interfaceType = (_a = object.interfaceType) !== null && _a !== void 0 ? _a : "";
        message.implementation = (_b = object.implementation) !== null && _b !== void 0 ? _b : "";
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
