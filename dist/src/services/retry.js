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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.throttleRetryWrapper = exports.ThrottleWrapper = exports.ThrottleIntervalMilliseconds = exports.ThrottleRate = void 0;
const pThrottle_1 = __importDefault(require("./pThrottle"));
const promise_retry_1 = __importDefault(require("promise-retry"));
exports.ThrottleRate = 60;
exports.ThrottleIntervalMilliseconds = 1000;
exports.ThrottleWrapper = (0, pThrottle_1.default)({
    limit: exports.ThrottleRate,
    interval: exports.ThrottleIntervalMilliseconds,
    strict: false,
});
function throttleRetryWrapper(f) {
    const wrappedFunc = (0, exports.ThrottleWrapper)(f);
    return (0, promise_retry_1.default)((retry, _) => __awaiter(this, void 0, void 0, function* () {
        try {
            return yield wrappedFunc();
        }
        catch (e) {
            retry(e);
        }
    }), { retries: 10, maxTimeout: 1000 });
}
exports.throttleRetryWrapper = throttleRetryWrapper;
//# sourceMappingURL=retry.js.map