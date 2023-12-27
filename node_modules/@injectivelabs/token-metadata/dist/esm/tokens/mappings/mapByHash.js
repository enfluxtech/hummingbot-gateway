export const getMappedTokensByHash = (tokens) => Object.keys(tokens).reduce((result, token) => {
    if (!tokens[token].ibc) {
        return result;
    }
    return {
        ...result,
        [tokens[token].ibc.hash.toUpperCase()]: tokens[token],
    };
}, {});
//# sourceMappingURL=mapByHash.js.map