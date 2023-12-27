"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGrpcIndexerWebImpl = void 0;
const grpc_web_1 = require("@injectivelabs/grpc-web");
const helpers_1 = require("../utils/helpers");
const grpc_1 = require("../utils/grpc");
const indexer_proto_ts_1 = require("@injectivelabs/indexer-proto-ts");
if (!(0, helpers_1.isBrowser)()) {
    grpc_web_1.grpc.setDefaultTransport((0, grpc_1.getGrpcTransport)());
}
/**
 * @hidden
 */
class BaseIndexerGrpcWebConsumer extends indexer_proto_ts_1.InjectiveAccountRpc.GrpcWebImpl {
    constructor(endpoint) {
        super(endpoint, { transport: (0, grpc_1.getGrpcTransport)() });
        this.module = '';
    }
}
exports.default = BaseIndexerGrpcWebConsumer;
const getGrpcIndexerWebImpl = (endpoint) => new BaseIndexerGrpcWebConsumer(endpoint);
exports.getGrpcIndexerWebImpl = getGrpcIndexerWebImpl;
//# sourceMappingURL=BaseIndexerGrpcWebConsumer.js.map