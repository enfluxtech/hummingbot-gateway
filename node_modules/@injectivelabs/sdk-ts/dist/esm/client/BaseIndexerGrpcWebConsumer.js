import { grpc } from '@injectivelabs/grpc-web';
import { isBrowser } from '../utils/helpers';
import { getGrpcTransport } from '../utils/grpc';
import { InjectiveAccountRpc } from '@injectivelabs/indexer-proto-ts';
if (!isBrowser()) {
    grpc.setDefaultTransport(getGrpcTransport());
}
/**
 * @hidden
 */
export default class BaseIndexerGrpcWebConsumer extends InjectiveAccountRpc.GrpcWebImpl {
    module = '';
    constructor(endpoint) {
        super(endpoint, { transport: getGrpcTransport() });
    }
}
export const getGrpcIndexerWebImpl = (endpoint) => new BaseIndexerGrpcWebConsumer(endpoint);
//# sourceMappingURL=BaseIndexerGrpcWebConsumer.js.map