"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chain = exports.TokenStandard = exports.PoolType = void 0;
;
;
var PoolType;
(function (PoolType) {
    PoolType["VOLATILE"] = "VOLATILE";
    PoolType["STABLE"] = "STABLE";
    PoolType["TEZ"] = "TEZ";
})(PoolType || (exports.PoolType = PoolType = {}));
var TokenStandard;
(function (TokenStandard) {
    TokenStandard["FA12"] = "FA1.2";
    TokenStandard["FA2"] = "FA2";
    TokenStandard["TEZ"] = "TEZ";
})(TokenStandard || (exports.TokenStandard = TokenStandard = {}));
var Chain;
(function (Chain) {
    Chain["ETHEREUM"] = "ETHEREUM";
    Chain["BSC"] = "BSC";
    Chain["POLYGON"] = "POLYGON";
    Chain["TEZOS"] = "TEZOS";
})(Chain || (exports.Chain = Chain = {}));
;
//# sourceMappingURL=plenty.types.js.map