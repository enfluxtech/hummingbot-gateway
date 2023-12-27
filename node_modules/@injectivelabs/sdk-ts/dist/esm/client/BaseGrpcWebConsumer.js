import { grpc } from '@injectivelabs/grpc-web';
import { isBrowser } from '../utils/helpers';
import { getGrpcTransport } from '../utils/grpc';
import { TendermintAbciTypes } from '@injectivelabs/core-proto-ts';
if (!isBrowser()) {
    grpc.setDefaultTransport(getGrpcTransport());
}
/**
 * @hidden
 */
export default class BaseGrpcWebConsumer extends TendermintAbciTypes.GrpcWebImpl {
    module = '';
    constructor(endpoint) {
        super(endpoint, { transport: getGrpcTransport() });
    }
}
export const getGrpcWebImpl = (endpoint) => new BaseGrpcWebConsumer(endpoint);
//# sourceMappingURL=BaseGrpcWebConsumer.js.map