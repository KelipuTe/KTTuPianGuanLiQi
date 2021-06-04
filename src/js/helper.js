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

/**
 * 构造分类标签html元素id
 * @param iBQBSSelect
 * @param sBQId
 */
function fEncodeBQEleId(iBQBSSelect, sBQId) {
    return 'bqbs' + iBQBSSelect + 'id0' + sBQId;
}

/**
 * 从分类标签html元素id中提取分类标签id
 * @param iBQBSSelect
 * @param sBQEleId
 */
function fDecodeBQEleId(iBQBSSelect, sBQEleId) {
    return sBQEleId.replace('bqbs' + iBQBSSelect + 'id0', '');
}

module.exports.fEmpty = fEmpty;
module.exports.fEmptyNum = fEmptyNum;
module.exports.fEmptyStr = fEmptyStr;

module.exports.fEncodeBQEleId = fEncodeBQEleId;
module.exports.fDecodeBQEleId = fDecodeBQEleId;
