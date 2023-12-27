/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { fundingModeFromJSON, fundingModeToJSON } from "./proposal";
function createBaseParams() {
    return { isExecutionEnabled: false, maxBeginBlockTotalGas: "0", maxContractGasLimit: "0", minGasPrice: "0" };
}
export const Params = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.isExecutionEnabled === true) {
            writer.uint32(8).bool(message.isExecutionEnabled);
        }
        if (message.maxBeginBlockTotalGas !== "0") {
            writer.uint32(16).uint64(message.maxBeginBlockTotalGas);
        }
        if (message.maxContractGasLimit !== "0") {
            writer.uint32(24).uint64(message.maxContractGasLimit);
        }
        if (message.minGasPrice !== "0") {
            writer.uint32(32).uint64(message.minGasPrice);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseParams();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 8) {
                        break;
                    }
                    message.isExecutionEnabled = reader.bool();
                    continue;
                case 2:
                    if (tag !== 16) {
                        break;
                    }
                    message.maxBeginBlockTotalGas = longToString(reader.uint64());
                    continue;
                case 3:
                    if (tag !== 24) {
                        break;
                    }
                    message.maxContractGasLimit = longToString(reader.uint64());
                    continue;
                case 4:
                    if (tag !== 32) {
                        break;
                    }
                    message.minGasPrice = longToString(reader.uint64());
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
            isExecutionEnabled: isSet(object.isExecutionEnabled) ? Boolean(object.isExecutionEnabled) : false,
            maxBeginBlockTotalGas: isSet(object.maxBeginBlockTotalGas) ? String(object.maxBeginBlockTotalGas) : "0",
            maxContractGasLimit: isSet(object.maxContractGasLimit) ? String(object.maxContractGasLimit) : "0",
            minGasPrice: isSet(object.minGasPrice) ? String(object.minGasPrice) : "0",
        };
    },
    toJSON(message) {
        const obj = {};
        message.isExecutionEnabled !== undefined && (obj.isExecutionEnabled = message.isExecutionEnabled);
        message.maxBeginBlockTotalGas !== undefined && (obj.maxBeginBlockTotalGas = message.maxBeginBlockTotalGas);
        message.maxContractGasLimit !== undefined && (obj.maxContractGasLimit = message.maxContractGasLimit);
        message.minGasPrice !== undefined && (obj.minGasPrice = message.minGasPrice);
        return obj;
    },
    create(base) {
        return Params.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaseParams();
        message.isExecutionEnabled = (_a = object.isExecutionEnabled) !== null && _a !== void 0 ? _a : false;
        message.maxBeginBlockTotalGas = (_b = object.maxBeginBlockTotalGas) !== null && _b !== void 0 ? _b : "0";
        message.maxContractGasLimit = (_c = object.maxContractGasLimit) !== null && _c !== void 0 ? _c : "0";
        message.minGasPrice = (_d = object.minGasPrice) !== null && _d !== void 0 ? _d : "0";
        return message;
    },
};
function createBaseRegisteredContract() {
    return {
        gasLimit: "0",
        gasPrice: "0",
        isExecutable: false,
        codeId: "0",
        adminAddress: "",
        granterAddress: "",
        fundMode: 0,
    };
}
export const RegisteredContract = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.gasLimit !== "0") {
            writer.uint32(8).uint64(message.gasLimit);
        }
        if (message.gasPrice !== "0") {
            writer.uint32(16).uint64(message.gasPrice);
        }
        if (message.isExecutable === true) {
            writer.uint32(24).bool(message.isExecutable);
        }
        if (message.codeId !== "0") {
            writer.uint32(32).uint64(message.codeId);
        }
        if (message.adminAddress !== "") {
            writer.uint32(42).string(message.adminAddress);
        }
        if (message.granterAddress !== "") {
            writer.uint32(50).string(message.granterAddress);
        }
        if (message.fundMode !== 0) {
            writer.uint32(56).int32(message.fundMode);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseRegisteredContract();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 8) {
                        break;
                    }
                    message.gasLimit = longToString(reader.uint64());
                    continue;
                case 2:
                    if (tag !== 16) {
                        break;
                    }
                    message.gasPrice = longToString(reader.uint64());
                    continue;
                case 3:
                    if (tag !== 24) {
                        break;
                    }
                    message.isExecutable = reader.bool();
                    continue;
                case 4:
                    if (tag !== 32) {
                        break;
                    }
                    message.codeId = longToString(reader.uint64());
                    continue;
                case 5:
                    if (tag !== 42) {
                        break;
                    }
                    message.adminAddress = reader.string();
                    continue;
                case 6:
                    if (tag !== 50) {
                        break;
                    }
                    message.granterAddress = reader.string();
                    continue;
                case 7:
                    if (tag !== 56) {
                        break;
                    }
                    message.fundMode = reader.int32();
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
            gasLimit: isSet(object.gasLimit) ? String(object.gasLimit) : "0",
            gasPrice: isSet(object.gasPrice) ? String(object.gasPrice) : "0",
            isExecutable: isSet(object.isExecutable) ? Boolean(object.isExecutable) : false,
            codeId: isSet(object.codeId) ? String(object.codeId) : "0",
            adminAddress: isSet(object.adminAddress) ? String(object.adminAddress) : "",
            granterAddress: isSet(object.granterAddress) ? String(object.granterAddress) : "",
            fundMode: isSet(object.fundMode) ? fundingModeFromJSON(object.fundMode) : 0,
        };
    },
    toJSON(message) {
        const obj = {};
        message.gasLimit !== undefined && (obj.gasLimit = message.gasLimit);
        message.gasPrice !== undefined && (obj.gasPrice = message.gasPrice);
        message.isExecutable !== undefined && (obj.isExecutable = message.isExecutable);
        message.codeId !== undefined && (obj.codeId = message.codeId);
        message.adminAddress !== undefined && (obj.adminAddress = message.adminAddress);
        message.granterAddress !== undefined && (obj.granterAddress = message.granterAddress);
        message.fundMode !== undefined && (obj.fundMode = fundingModeToJSON(message.fundMode));
        return obj;
    },
    create(base) {
        return RegisteredContract.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f, _g;
        const message = createBaseRegisteredContract();
        message.gasLimit = (_a = object.gasLimit) !== null && _a !== void 0 ? _a : "0";
        message.gasPrice = (_b = object.gasPrice) !== null && _b !== void 0 ? _b : "0";
        message.isExecutable = (_c = object.isExecutable) !== null && _c !== void 0 ? _c : false;
        message.codeId = (_d = object.codeId) !== null && _d !== void 0 ? _d : "0";
        message.adminAddress = (_e = object.adminAddress) !== null && _e !== void 0 ? _e : "";
        message.granterAddress = (_f = object.granterAddress) !== null && _f !== void 0 ? _f : "";
        message.fundMode = (_g = object.fundMode) !== null && _g !== void 0 ? _g : 0;
        return message;
    },
};
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
