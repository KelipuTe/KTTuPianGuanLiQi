/*##目录模块##*/

const rHelper = require('./helper');
const rFs = require('fs');

//oML.sWFL--未分类目录；
//oML.sBQ--标签目录
//oWJM.sFen1Lei4BQ--分类标签存储文件名
//oWJM.sBiao1Ji4BQ--标记标签存储文件名
const cConfig = {
    oML: {
        sWFL: 'wei4fen1lei4\\',
        sBQ: 'biao1qian1\\',
    },
    oWJM: {
        sFen1Lei4BQ: 'fen1lei4biao1qian1.json',
        sBiao1Ji4BQ: 'biao1ji4biao1qian1.json',
    }
};

let sCZML = ''; //操作目录
let sWFLML = ''; //未分类目录
let sBQML = ''; //标签目录

/**
 * 设置操作目录
 * @string psCZML
 */
function fSetCaoZuoMuLu(psCZML) {
    sCZML = psCZML + '\\';
    sWFLML = sCZML + cConfig.oML.sWFL;
    sBQML = sCZML + cConfig.oML.sBQ;
}

/**
 * 检查操作目录是否设置
 * @returns {boolean}
 */
function fCheckCaoZuoMuLu() {
    return rHelper.fEmpty(sCZML);
}

/**
 * 获取未分类目录
 * @returns {string}
 */
function fGetWeiFenLeiMuLu() {
    return sWFLML;
}

/**
 * 获取标签目录
 * @returns {string}
 */
function fGetBQMuLu() {
    return sBQML;
}

/**
 * 获取分类标签路径
 * @returns {string}
 */
function fGetFen1Lei4BQLu4Jing4() {
    return sBQML + cConfig.oWJM.sFen1Lei4BQ;
}

/**
 * 构造标签对应的目录
 * @param iXuanZhongBQBS
 * @param oAllXuanZhongId
 * @param iXinBQId
 */
function fMakeBQMuLu(iXuanZhongBQBS, oAllXuanZhongId, iXinBQId) {
    let tiTag = 1;
    let tsMuLu = sCZML
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
    let tsMuLu = sCZML
    while (tiTag <= iXuanZhongBQBS) {
        tsMuLu += oAllXuanZhongId[tiTag - 1] + '\\';
        if (!rFs.existsSync(tsMuLu)) {
            rFs.mkdirSync(tsMuLu);
        }
        ++tiTag;
    }
    return tsMuLu;
}

module.exports.fSetCaoZuoMuLu = fSetCaoZuoMuLu;
module.exports.fCheckCaoZuoMuLu = fCheckCaoZuoMuLu;
module.exports.fGetWeiFenLeiMuLu = fGetWeiFenLeiMuLu;
module.exports.fGetBQMuLu = fGetBQMuLu;
module.exports.fGetFen1Lei4BQLu4Jing4 = fGetFen1Lei4BQLu4Jing4;
module.exports.fMakeBQMuLu = fMakeBQMuLu;
module.exports.fZu3He2BQMuLu = fZu3He2BQMuLu;