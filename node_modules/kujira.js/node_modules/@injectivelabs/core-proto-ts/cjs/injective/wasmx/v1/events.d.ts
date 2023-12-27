import _m0 from "protobufjs/minimal";
export interface EventContractExecution {
    contractAddress: string;
    response: Uint8Array;
    error: string;
}
export declare const EventContractExecution: {
    encode(message: EventContractExecution, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): EventContractExecution;
    fromJSON(object: any): EventContractExecution;
    toJSON(message: EventContractExecution): unknown;
    create(base?: DeepPartial<EventContractExecution>): EventContractExecution;
    fromPartial(object: DeepPartial<EventContractExecution>): EventContractExecution;
};
type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
