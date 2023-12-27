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
exports.verifyXRPLIsAvailable = void 0;
const error_handler_1 = require("../../services/error-handler");
const xrpl_1 = require("./xrpl");
const verifyXRPLIsAvailable = (req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req || !req.body || !req.body.network) {
        throw new error_handler_1.HttpException(404, 'No XRPL network informed.');
    }
    const xrpl = yield xrpl_1.XRPL.getInstance(req.body.network);
    if (!xrpl.ready) {
        yield xrpl.init();
    }
    if (!xrpl.isConnected()) {
        yield xrpl.client.connect();
    }
    return next();
});
exports.verifyXRPLIsAvailable = verifyXRPLIsAvailable;
//# sourceMappingURL=xrpl-middlewares.js.map