//图片模块

const rHelper = require('./helper');
const rFs = require('fs');

//iTPNum--图片列表数量
const cConfig = {
    iSArrTPMingLen: 5,
};

//图片名列表
let sarrTPMing = [];
//图片名
let sTPMing = '';
let sTPLuJing = '';
//图片宽高
let iTPKuan = 0;
let iTPGao = 0;
//重命名
let sShi2Jian1 = '';
let sChongMingMing = '';
let sMuBiaoLuJing = '';

/**
 * 加载图片
 * @param sMuLu 图片目录路径
 */
function fLoadTP(sMuLu) {
    if (!rFs.existsSync(sMuLu)) {
        return [];
    }
    //清空数据
    sarrTPMing = [];
    //同步读取目录下的文件
    let sarrWenJianMing = rFs.readdirSync(sMuLu);
    //一次取一定数量的图片
    let ii = 1;
    for (let sWenJianMing of sarrWenJianMing) {
        if (ii > cConfig.iSArrTPMingLen) {
            break;
        } else {
            sarrTPMing.push(sWenJianMing);
            ++ii;
        }
    }
    return sarrTPMing;
}

/**
 * 获取图片名列表
 * @returns {[]}
 */
function fGetArrTPMing() {
    return sarrTPMing;
}

/**
 * 设置图片名
 * @param psTPMing
 */
function fSetTPMing(psTPMing) {
    sTPMing = psTPMing;
}

/**
 * 获取图片名
 * @returns {string}
 */
function fGetTPMing() {
    return sTPMing;
}

/**
 * 设置图片原始宽高
 * @param piTPKuan
 * @param piTPGao
 */
function fSetTPKuanGao(piTPKuan, piTPGao) {
    iTPKuan = piTPKuan;
    iTPGao = piTPGao;
}

/**
 * 图片重命名
 * @returns {string}
 */
function fGetChong2Ming4Ming4() {
    let arrTPMing = sTPMing.split('.');
    let sTPHou4Zhui4 = arrTPMing[arrTPMing.length - 1];
    //构造时间字符串
    let oDate = new Date();
    sShi2Jian1 = String(oDate.getFullYear());
    let tiTime = oDate.getMonth() + 1;
    sShi2Jian1 += (tiTime < 10) ? '0' + tiTime : String(tiTime);
    tiTime = oDate.getDate();
    sShi2Jian1 += (tiTime < 10) ? '0' + tiTime : String(tiTime);
    tiTime = oDate.getHours();
    sShi2Jian1 += (tiTime < 10) ? '0' + tiTime : String(tiTime);
    tiTime = oDate.getMinutes();
    sShi2Jian1 += (tiTime < 10) ? '0' + tiTime : String(tiTime);
    tiTime = oDate.getSeconds();
    sShi2Jian1 += (tiTime < 10) ? '0' + tiTime : String(tiTime);
    sChongMingMing = '-' + iTPKuan + '-' + iTPGao + '-' + sShi2Jian1 + '.' + sTPHou4Zhui4;

    return sChongMingMing
}

/**
 * 设置图片原始路径
 * @param pTPLuJing
 */
function fSetTPLuJing(pTPLuJing) {
    sTPLuJing = pTPLuJing;
}

/**
 * 设置图片将要移动到的目标路径
 * @param psMuBiaoLuJing
 */
function fSetMuBiaoLuJing(psMuBiaoLuJing) {
    sMuBiaoLuJing = psMuBiaoLuJing;
}

/**
 * 移动图片
 */
function fYiDongTuPian() {
    if (rHelper.fEmpty(sTPLuJing) || rHelper.fEmpty(sMuBiaoLuJing)) {
        alert('缺少图片路径参数');
        return;
    }
    //移动图片
    rFs.renameSync(sTPLuJing, sMuBiaoLuJing);
    //从列表移除图片
    let iIndex = sarrTPMing.indexOf(sTPMing);
    if (iIndex !== -1) {
        sarrTPMing.splice(iIndex, 1);
    }
}

module.exports.fLoadTP = fLoadTP;
module.exports.fGetTPMing = fGetTPMing;
module.exports.fSetTPMing = fSetTPMing;
module.exports.fSetTPKuanGao = fSetTPKuanGao;
module.exports.fGetChong2Ming4Ming4 = fGetChong2Ming4Ming4;
module.exports.fSetTPLuJing = fSetTPLuJing;
module.exports.fSetMuBiaoLuJing = fSetMuBiaoLuJing;
module.exports.fYiDongTuPian = fYiDongTuPian;
module.exports.fGetArrTPMing = fGetArrTPMing;