//目录模块

const rHelper = require('./helpers');
const rFs = require('fs');

//oMuLu.sWFL--未分类目录
//oMuLu.sBQ--标签目录
//oWenJianMing.sFenLeiBQ--分类标签存储文件名
//oWenJianMing.sBiaoJiBQ--标记标签存储文件名
const cConfig = {
    oMuLu: {
        sWFL: 'wei4fen1lei4\\',
        sBQ: 'biao1qian1\\',
    },
    oWenJianMing: {
        sFenLeiBQ: 'fen1lei4biao1qian1.json',
        sBiaoJiBQ: 'biao1ji4biao1qian1.json',
    }
};

//操作目录
let sCaoZuoMuLu = '';
//未分类目录
let sWFLMuLu = '';
//标签目录
let sBQMuLu = '';

/**
 * 获取操作目录
 * @returns {string}
 */
function getCaoZuoMuLu() {
    return sCaoZuoMuLu;
}

/**
 * 设置操作目录
 * @returns {string}
 */
function fSetCaoZuoMuLu(psCaoZuoMuLu) {
    sCaoZuoMuLu = psCaoZuoMuLu + '\\';
    sWFLMuLu = sCaoZuoMuLu + cConfig.oMuLu.sWFL;
    sBQMuLu = sCaoZuoMuLu + cConfig.oMuLu.sBQ;
}

/**
 * 检查操作目录是否设置
 * @returns {boolean}
 */
function fCheckCaoZuoMuLu() {
    return rHelper.fEmpty(sCaoZuoMuLu);
}

/**
 * 获取未分类目录
 * @returns {string}
 */
function fGetWeiFenLeiMuLu() {
    return sWFLMuLu;
}

/**
 * 获取标签目录
 * @returns {string}
 */
function fGetBQMuLu() {
    return sBQMuLu;
}

/**
 * 获取分类标签路径
 * @returns {string}
 */
function fGetFen1Lei4BQLu4Jing4() {
    return sBQMuLu + cConfig.oWenJianMing.sFenLeiBQ;
}

/**
 * 构造标签对应的目录
 * @param iXuanZhongBQBS
 * @param oAllXuanZhongId
 * @param iXinBQId
 */
function fMakeBQMuLu(iXuanZhongBQBS, oAllXuanZhongId, iXinBQId) {
    let tiTag = 1;
    let tsMuLu = sCaoZuoMuLu
    while (tiTag < iXuanZhongBQBS) {
        tsMuLu += oAllXuanZhongId[tiTag - 1] + '\\';
        if (!rFs.existsSync(tsMuLu)) {
            rFs.mkdirSync(tsMuLu);
        }
        ++tiTag;
    }
    tsMuLu += iXinBQId + '\\';
    if (!rFs.existsSync(tsMuLu)) {
        rFs.mkdirSync(tsMuLu);
    }
    return tsMuLu;
}

/**
 * 用当前标签组合出对应目录
 * @param iXuanZhongBQBS
 * @param oAllXuanZhongId
 * @returns {string}
 */
function fZu3He2BQMuLu(iXuanZhongBQBS, oAllXuanZhongId) {
    let tiTag = 1;
    let tsMuLu = sCaoZuoMuLu
    while (tiTag <= iXuanZhongBQBS) {
        tsMuLu += oAllXuanZhongId[tiTag - 1] + '\\';
        if (!rFs.existsSync(tsMuLu)) {
            rFs.mkdirSync(tsMuLu);
        }
        ++tiTag;
    }
    return tsMuLu;
}

module.exports.getCaoZuoMuLu = getCaoZuoMuLu;
module.exports.fSetCaoZuoMuLu = fSetCaoZuoMuLu;
module.exports.fCheckCaoZuoMuLu = fCheckCaoZuoMuLu;
module.exports.fGetWeiFenLeiMuLu = fGetWeiFenLeiMuLu;
module.exports.fGetBQMuLu = fGetBQMuLu;
module.exports.fGetFen1Lei4BQLu4Jing4 = fGetFen1Lei4BQLu4Jing4;
module.exports.fMakeBQMuLu = fMakeBQMuLu;
module.exports.fZu3He2BQMuLu = fZu3He2BQMuLu;