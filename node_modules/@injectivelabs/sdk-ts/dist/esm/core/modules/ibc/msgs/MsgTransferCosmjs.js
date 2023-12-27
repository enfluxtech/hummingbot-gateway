import { MsgTransfer as BaseMsgTransferCosmjs } from 'cosmjs-types/ibc/applications/transfer/v1/tx';
/**
 * @category Messages
 */
export default class MsgTransferCosmjs {
    params;
    constructor(params) {
        this.params = params;
    }
    static fromJSON(params) {
        return new MsgTransferCosmjs(params);
    }
    toProto() {
        throw new Error('Method not implemented.');
    }
    toData() {
        throw new Error('Method not implemented.');
    }
    toAmino() {
        const { params } = this;
        const transferMsg = {
            typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
            value: BaseMsgTransferCosmjs.fromPartial({
                sourcePort: params.port,
                sourceChannel: params.channelId,
                sender: params.sender,
                receiver: params.receiver,
                token: params.amount,
                timeoutHeight: params.height,
                timeoutTimestamp: params.timeout,
            }),
        };
        return transferMsg;
    }
    toWeb3() {
        throw new Error('Method not implemented.');
    }
    toDirectSign() {
        throw new Error('Method not implemented.');
    }
}
//# sourceMappingURL=MsgTransferCosmjs.js.map