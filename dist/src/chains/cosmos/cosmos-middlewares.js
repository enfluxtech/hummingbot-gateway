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
exports.verifyCosmosIsAvailable = void 0;
const cosmos_1 = require("./cosmos");
const cosmos_config_1 = require("./cosmos.config");
const verifyCosmosIsAvailable = (_req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const cosmos = cosmos_1.Cosmos.getInstance(cosmos_config_1.CosmosConfig.config.network.name);
    if (!cosmos.ready()) {
        yield cosmos.init();
    }
    return next();
});
exports.verifyCosmosIsAvailable = verifyCosmosIsAvailable;
//# sourceMappingURL=cosmos-middlewares.js.map