const _ = require('lodash');

module.exports = {
    mergeByFile,
    mergeBy,
    merge
};

function mergeByFile(coverageResults){
    return mergeBy(coverageResults, 'file');
}

function mergeBy(coverageResults, grouper){
    return _.chain(coverageResults)
        .groupBy(grouper)
        .map(merge)
        .value();
}

function merge(coverageResults){
    const lastResult = _.last(coverageResults);
    return {
        title: lastResult.title,
        file: lastResult.file,
        lines: mergeSections(coverageResults, 'lines', 'hit', 'line', mergeLinesDetails),
        functions: mergeSections(coverageResults, 'functions', 'hit', 'line', mergeFunctionsDetails),
        branches: mergeSections(coverageResults, 'branches', 'taken', getBranchDetailGroup, mergeBranchesDetails),
    };
}

function mergeSections(coverageResults, sectionKey, hitKey, grouper, merger){
    return _.chain(coverageResults)
        .map(result => _.get(result, [sectionKey, 'details']))
        .flatten()
        .thru(details => mergeDetails(details, grouper, merger))
        .thru(mergedDetails => createSection(mergedDetails, hitKey))
        .value();
}

function mergeDetails(details, grouper, merger){
    return _.chain(details)
        .groupBy(grouper)
        .map(merger)
        .value();
}

function createSection(details, hitKey){
    return {
        found: details.length,
        hit: _.sumBy(details, detail => detail[hitKey] ? 1 : 0),
        details
    }
}

function getBranchDetailGroup(detail){
    return `${detail.line}_${detail.block || 0 }_${detail.branch}`;
}

function mergeFunctionsDetails(details){
    const lastDetail = _.last(details);
    return {
        name: lastDetail.name,
        line: lastDetail.line,
        hit: _.sumBy(details, 'hit')
    };
}

function mergeLinesDetails(details){
    const lastDetail = _.last(details);
    return {
        line: lastDetail.line,
        hit: _.sumBy(details, 'hit')
    };
}

function mergeBranchesDetails(details){
    const lastDetail = _.last(details);
    return {
        line: lastDetail.line,
        block: lastDetail.block || 0,
        branch: lastDetail.branch,
        taken: _.sumBy(details, 'taken')
    };
}
