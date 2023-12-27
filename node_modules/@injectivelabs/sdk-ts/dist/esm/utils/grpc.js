import { NodeHttpTransport } from '@injectivelabs/grpc-web-node-http-transport';
import { ReactNativeTransport } from '@injectivelabs/grpc-web-react-native-transport';
import { isNode, isReactNative } from './helpers';
export const getGrpcTransport = () => {
    if (isReactNative()) {
        return ReactNativeTransport({ withCredentials: true });
    }
    if (isNode()) {
        return NodeHttpTransport();
    }
    return undefined;
};
//# sourceMappingURL=grpc.js.map