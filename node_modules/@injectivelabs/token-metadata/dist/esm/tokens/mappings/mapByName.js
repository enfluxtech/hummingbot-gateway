export const getMappedTokensByName = (tokens) => Object.keys(tokens).reduce((result, token) => ({
    ...result,
    [tokens[token].name.toLowerCase()]: tokens[token],
}), {});
//# sourceMappingURL=mapByName.js.map