/* eslint-disable */
import _m0 from "protobufjs/minimal";
function createBaseModule() {
    return { bech32Prefix: "", moduleAccountPermissions: [], authority: "" };
}
export const Module = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.bech32Prefix !== "") {
            writer.uint32(10).string(message.bech32Prefix);
        }
        for (const v of message.moduleAccountPermissions) {
            ModuleAccountPermission.encode(v, writer.uint32(18).fork()).ldelim();
        }
        if (message.authority !== "") {
            writer.uint32(26).string(message.authority);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseModule();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.bech32Prefix = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.moduleAccountPermissions.push(ModuleAccountPermission.decode(reader, reader.uint32()));
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.authority = reader.string();
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
            bech32Prefix: isSet(object.bech32Prefix) ? String(object.bech32Prefix) : "",
            moduleAccountPermissions: Array.isArray(object === null || object === void 0 ? void 0 : object.moduleAccountPermissions)
                ? object.moduleAccountPermissions.map((e) => ModuleAccountPermission.fromJSON(e))
                : [],
            authority: isSet(object.authority) ? String(object.authority) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.bech32Prefix !== undefined && (obj.bech32Prefix = message.bech32Prefix);
        if (message.moduleAccountPermissions) {
            obj.moduleAccountPermissions = message.moduleAccountPermissions.map((e) => e ? ModuleAccountPermission.toJSON(e) : undefined);
        }
        else {
            obj.moduleAccountPermissions = [];
        }
        message.authority !== undefined && (obj.authority = message.authority);
        return obj;
    },
    create(base) {
        return Module.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseModule();
        message.bech32Prefix = (_a = object.bech32Prefix) !== null && _a !== void 0 ? _a : "";
        message.moduleAccountPermissions =
            ((_b = object.moduleAccountPermissions) === null || _b === void 0 ? void 0 : _b.map((e) => ModuleAccountPermission.fromPartial(e))) || [];
        message.authority = (_c = object.authority) !== null && _c !== void 0 ? _c : "";
        return message;
    },
};
function createBaseModuleAccountPermission() {
    return { account: "", permissions: [] };
}
export const ModuleAccountPermission = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.account !== "") {
            writer.uint32(10).string(message.account);
        }
        for (const v of message.permissions) {
            writer.uint32(18).string(v);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseModuleAccountPermission();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.account = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.permissions.push(reader.string());
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
            account: isSet(object.account) ? String(object.account) : "",
            permissions: Array.isArray(object === null || object === void 0 ? void 0 : object.permissions) ? object.permissions.map((e) => String(e)) : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.account !== undefined && (obj.account = message.account);
        if (message.permissions) {
            obj.permissions = message.permissions.map((e) => e);
        }
        else {
            obj.permissions = [];
        }
        return obj;
    },
    create(base) {
        return ModuleAccountPermission.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseModuleAccountPermission();
        message.account = (_a = object.account) !== null && _a !== void 0 ? _a : "";
        message.permissions = ((_b = object.permissions) === null || _b === void 0 ? void 0 : _b.map((e) => e)) || [];
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
