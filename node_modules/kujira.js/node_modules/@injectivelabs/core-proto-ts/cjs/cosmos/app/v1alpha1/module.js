"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrateFromInfo = exports.PackageReference = exports.ModuleDescriptor = void 0;
/* eslint-disable */
const minimal_1 = __importDefault(require("protobufjs/minimal"));
function createBaseModuleDescriptor() {
    return { goImport: "", usePackage: [], canMigrateFrom: [] };
}
exports.ModuleDescriptor = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.goImport !== "") {
            writer.uint32(10).string(message.goImport);
        }
        for (const v of message.usePackage) {
            exports.PackageReference.encode(v, writer.uint32(18).fork()).ldelim();
        }
        for (const v of message.canMigrateFrom) {
            exports.MigrateFromInfo.encode(v, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseModuleDescriptor();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.goImport = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.usePackage.push(exports.PackageReference.decode(reader, reader.uint32()));
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.canMigrateFrom.push(exports.MigrateFromInfo.decode(reader, reader.uint32()));
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
            goImport: isSet(object.goImport) ? String(object.goImport) : "",
            usePackage: Array.isArray(object === null || object === void 0 ? void 0 : object.usePackage)
                ? object.usePackage.map((e) => exports.PackageReference.fromJSON(e))
                : [],
            canMigrateFrom: Array.isArray(object === null || object === void 0 ? void 0 : object.canMigrateFrom)
                ? object.canMigrateFrom.map((e) => exports.MigrateFromInfo.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.goImport !== undefined && (obj.goImport = message.goImport);
        if (message.usePackage) {
            obj.usePackage = message.usePackage.map((e) => e ? exports.PackageReference.toJSON(e) : undefined);
        }
        else {
            obj.usePackage = [];
        }
        if (message.canMigrateFrom) {
            obj.canMigrateFrom = message.canMigrateFrom.map((e) => e ? exports.MigrateFromInfo.toJSON(e) : undefined);
        }
        else {
            obj.canMigrateFrom = [];
        }
        return obj;
    },
    create(base) {
        return exports.ModuleDescriptor.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseModuleDescriptor();
        message.goImport = (_a = object.goImport) !== null && _a !== void 0 ? _a : "";
        message.usePackage = ((_b = object.usePackage) === null || _b === void 0 ? void 0 : _b.map((e) => exports.PackageReference.fromPartial(e))) || [];
        message.canMigrateFrom = ((_c = object.canMigrateFrom) === null || _c === void 0 ? void 0 : _c.map((e) => exports.MigrateFromInfo.fromPartial(e))) || [];
        return message;
    },
};
function createBasePackageReference() {
    return { name: "", revision: 0 };
}
exports.PackageReference = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.name !== "") {
            writer.uint32(10).string(message.name);
        }
        if (message.revision !== 0) {
            writer.uint32(16).uint32(message.revision);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasePackageReference();
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
                    if (tag !== 16) {
                        break;
                    }
                    message.revision = reader.uint32();
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
            revision: isSet(object.revision) ? Number(object.revision) : 0,
        };
    },
    toJSON(message) {
        const obj = {};
        message.name !== undefined && (obj.name = message.name);
        message.revision !== undefined && (obj.revision = Math.round(message.revision));
        return obj;
    },
    create(base) {
        return exports.PackageReference.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBasePackageReference();
        message.name = (_a = object.name) !== null && _a !== void 0 ? _a : "";
        message.revision = (_b = object.revision) !== null && _b !== void 0 ? _b : 0;
        return message;
    },
};
function createBaseMigrateFromInfo() {
    return { module: "" };
}
exports.MigrateFromInfo = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.module !== "") {
            writer.uint32(10).string(message.module);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMigrateFromInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.module = reader.string();
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
        return { module: isSet(object.module) ? String(object.module) : "" };
    },
    toJSON(message) {
        const obj = {};
        message.module !== undefined && (obj.module = message.module);
        return obj;
    },
    create(base) {
        return exports.MigrateFromInfo.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseMigrateFromInfo();
        message.module = (_a = object.module) !== null && _a !== void 0 ? _a : "";
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
