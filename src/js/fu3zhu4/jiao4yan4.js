/*##辅助模块--校验##*/

function fEmpty(op) {
  return op === undefined || op === null ||
    op === {} || op === [] || op === '';
}

module.exports.fEmpty = fEmpty;

function fEmptyStr(op) {
  if (typeof op !== 'string') {
    return false;
  }
  return op === '';
}

module.exports.fEmptyNum = fEmptyNum;

function fEmptyNum(op) {
  if (typeof op !== 'number') {
    return false;
  }
  return isNaN(op);
}

module.exports.fEmptyStr = fEmptyStr;