"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMappedTokensByHash = void 0;
const getMappedTokensByHash = (tokens) => Object.keys(tokens).reduce((result, token) => {
    if (!tokens[token].ibc) {
        return result;
    }
    return Object.assign(Object.assign({}, result), { [tokens[token].ibc.hash.toUpperCase()]: tokens[token] });
}, {});
exports.getMappedTokensByHash = getMappedTokensByHash;
//# sourceMappingURL=mapByHash.js.map