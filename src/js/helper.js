/*##全局辅助模块##*/

/*##判空##*/

function fEmpty(op) {
    return op === undefined || op === null ||
        op === {} || op === [] || op === '';
}

function fEmptyStr(op) {
    if (typeof op !== 'string') {
        return false;
    }
    return op === '';
}

function fEmptyNum(op) {
    if (typeof op !== 'number') {
        return false;
    }
    return isNaN(op);
}

/*####判空####*/

module.exports.fEmpty = fEmpty;
module.exports.fEmptyNum = fEmptyNum;
module.exports.fEmptyStr = fEmptyStr;
