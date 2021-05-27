//全局辅助模块

//判断变量是否为空
function fEmpty(pParam) {
    if (pParam === undefined) {
        return true;
    } else if (pParam === null) {
        return true;
    } else if (pParam === '') {
        return true;
    }
    return false;
}

module.exports.fEmpty = fEmpty;