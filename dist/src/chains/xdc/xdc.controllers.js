"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XDCCOntroller = void 0;
const evm_controllers_1 = require("../ethereum/evm.controllers");
const xdc_validators_1 = require("./xdc.validators");
class XDCCOntroller extends evm_controllers_1.EVMController {
    static allowances(ethereumish, req) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, xdc_validators_1.validateXdcAllowancesRequest)(req);
            return evm_controllers_1.EVMController.allowancesWithoutValidation(ethereumish, req);
        });
    }
    static approve(ethereumish, req) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, xdc_validators_1.validateXdcApproveRequest)(req);
            return yield evm_controllers_1.EVMController.approveWithoutValidation(ethereumish, req);
        });
    }
}
exports.XDCCOntroller = XDCCOntroller;
//# sourceMappingURL=xdc.controllers.js.map