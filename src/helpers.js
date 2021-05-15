//全局辅助模块

//判断变量是否为空
function fEmpty(bianLiang) {
    if (bianLiang === undefined) {
        return true;
    } else if (bianLiang === null) {
        return true;
    } else if (bianLiang === '') {
        return true;
    }
    return false;
}

module.exports.fEmpty = fEmpty;