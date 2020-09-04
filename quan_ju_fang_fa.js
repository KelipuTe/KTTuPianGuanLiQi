/*判断空值*/
function gEmpty(bianLiang) {
    if (bianLiang === undefined) {
        return true;
    } else if (bianLiang === null) {
        return true;
    } else if (bianLiang === '') {
        return true;
    }
    return false;
}
