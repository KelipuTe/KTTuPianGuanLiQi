/*##全局辅助模块##*/

/*##判空##*/

function fEmpty(pParam) {
    return pParam === undefined || pParam === null ||
        pParam === {} || pParam === [] || pParam === '';
}

function fEmptyStr(p) {
    if (typeof p !== 'string') {
        return false;
    }
    return p === '';
}

function fEmptyNum(p) {
    if (typeof p !== 'number') {
        return false;
    }
    return isNaN(p);
}

/*####判空####*/

module.exports.fEmpty = fEmpty;
module.exports.fEmptyNum = fEmptyNum;
module.exports.fEmptyStr = fEmptyStr;
