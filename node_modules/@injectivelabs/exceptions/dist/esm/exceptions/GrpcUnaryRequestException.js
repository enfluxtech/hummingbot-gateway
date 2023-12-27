import { ConcreteException } from '../exception';
import { ErrorType } from '../types';
export class GrpcUnaryRequestException extends ConcreteException {
    errorClass = 'GrpcUnaryRequestException';
    constructor(error, context) {
        super(error, context);
        this.type = ErrorType.GrpcUnaryRequest;
    }
}
//# sourceMappingURL=GrpcUnaryRequestException.js.map