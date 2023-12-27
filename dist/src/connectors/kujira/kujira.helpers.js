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
exports.isKujiraPrivateKey = exports.isValidKujiraPublicKey = exports.runWithRetryAndTimeout = exports.promiseAllInBatches = exports.sleep = exports.getNotNullOrThrowError = void 0;
const kujira_config_1 = require("./kujira.config");
const getNotNullOrThrowError = (value, errorMessage = 'Value is null or undefined') => {
    if (value === undefined || value === null)
        throw new Error(errorMessage);
    return value;
};
exports.getNotNullOrThrowError = getNotNullOrThrowError;
const sleep = (milliseconds) => new Promise((callback) => setTimeout(callback, milliseconds));
exports.sleep = sleep;
const promiseAllInBatches = (task, items, batchSize = kujira_config_1.KujiraConfig.config.parallel.all.batchSize, delayBetweenBatches = kujira_config_1.KujiraConfig.config.parallel.all
    .delayBetweenBatches) => __awaiter(void 0, void 0, void 0, function* () {
    let position = 0;
    let results = [];
    if (!batchSize) {
        batchSize = items.length;
    }
    while (position < items.length) {
        const itemsForBatch = items.slice(position, position + batchSize);
        results = [
            ...results,
            ...(yield Promise.all(itemsForBatch.map((item) => task(item)))),
        ];
        position += batchSize;
        if (position < items.length) {
            if (delayBetweenBatches > 0) {
                yield (0, exports.sleep)(delayBetweenBatches);
            }
        }
    }
    return results;
});
exports.promiseAllInBatches = promiseAllInBatches;
const runWithRetryAndTimeout = (targetObject, targetFunction, targetParameters, maxNumberOfRetries = kujira_config_1.KujiraConfig.config.retry.all.maxNumberOfRetries, delayBetweenRetries = kujira_config_1.KujiraConfig.config.retry.all
    .delayBetweenRetries, timeout = kujira_config_1.KujiraConfig.config.timeout.all, timeoutMessage = 'Timeout exceeded.') => __awaiter(void 0, void 0, void 0, function* () {
    const errors = [];
    let retryCount = 0;
    let timer;
    if (timeout > 0) {
        timer = setTimeout(() => new Error(timeoutMessage), timeout);
    }
    do {
        try {
            const result = yield targetFunction.apply(targetObject, targetParameters);
            if (timeout > 0) {
                clearTimeout(timer);
            }
            return result;
        }
        catch (error) {
            errors.push(error);
            retryCount++;
            console.debug(`${(targetObject === null || targetObject === void 0 ? void 0 : targetObject.constructor.name) || targetObject}:${targetFunction.name} => retry ${retryCount} of ${maxNumberOfRetries}`);
            if (retryCount < maxNumberOfRetries) {
                if (delayBetweenRetries > 0) {
                    yield (0, exports.sleep)(delayBetweenRetries);
                }
            }
            else {
                const allErrors = Error(`Failed to execute "${targetFunction.name}" with ${maxNumberOfRetries} retries. All error messages were:\n${errors
                    .map((error) => error.message)
                    .join(';\n')}\n`);
                allErrors.stack = error.stack;
                console.error(allErrors);
                throw allErrors;
            }
        }
    } while (retryCount < maxNumberOfRetries);
    throw Error('Unknown error.');
});
exports.runWithRetryAndTimeout = runWithRetryAndTimeout;
const isValidKujiraPublicKey = (publicKey) => {
    return /^kujira([a-z0-9]){39}$/.test(publicKey);
};
exports.isValidKujiraPublicKey = isValidKujiraPublicKey;
const isKujiraPrivateKey = (privateKey) => {
    return /^(?:\b[a-z]+\b(?:\s|$)){12}(?:(?:\b[a-z]+\b(?:\s|$)){12})?$/.test(privateKey);
};
exports.isKujiraPrivateKey = isKujiraPrivateKey;
//# sourceMappingURL=kujira.helpers.js.map