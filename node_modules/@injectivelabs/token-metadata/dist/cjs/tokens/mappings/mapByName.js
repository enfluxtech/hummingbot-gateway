"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMappedTokensByName = void 0;
const getMappedTokensByName = (tokens) => Object.keys(tokens).reduce((result, token) => (Object.assign(Object.assign({}, result), { [tokens[token].name.toLowerCase()]: tokens[token] })), {});
exports.getMappedTokensByName = getMappedTokensByName;
//# sourceMappingURL=mapByName.js.map