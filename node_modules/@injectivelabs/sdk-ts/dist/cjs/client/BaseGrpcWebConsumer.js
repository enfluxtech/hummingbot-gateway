"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGrpcWebImpl = void 0;
const grpc_web_1 = require("@injectivelabs/grpc-web");
const helpers_1 = require("../utils/helpers");
const grpc_1 = require("../utils/grpc");
const core_proto_ts_1 = require("@injectivelabs/core-proto-ts");
if (!(0, helpers_1.isBrowser)()) {
    grpc_web_1.grpc.setDefaultTransport((0, grpc_1.getGrpcTransport)());
}
/**
 * @hidden
 */
class BaseGrpcWebConsumer extends core_proto_ts_1.TendermintAbciTypes.GrpcWebImpl {
    constructor(endpoint) {
        super(endpoint, { transport: (0, grpc_1.getGrpcTransport)() });
        this.module = '';
    }
}
exports.default = BaseGrpcWebConsumer;
const getGrpcWebImpl = (endpoint) => new BaseGrpcWebConsumer(endpoint);
exports.getGrpcWebImpl = getGrpcWebImpl;
//# sourceMappingURL=BaseGrpcWebConsumer.js.map