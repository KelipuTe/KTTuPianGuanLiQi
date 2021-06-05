/*##目录模块##*/

const rHelper = require('./helper');
const rFs = require('fs');

//oML.sWFL--未分类目录
//oML.sBQ--标签目录
//oWJM.sFen1Lei4BQ--分类标签文件名
const cConfig = {
    oML: {
        sWFL: 'wei4fen1lei4\\',
        sBQ: 'biao1qian1\\',
    },
    oWJM: {
        sFen1Lei4BQ: 'fen1lei4.json',
    }
};

let sCZML = ''; //操作目录
let sWFLML = ''; //未分类目录
let sBQML = ''; //标签目录

/**
 * 设置操作目录
 * @string psCZML
 */
function fSetCZML(psCZML) {
    sCZML = psCZML + '\\';
    sWFLML = sCZML + cConfig.oML.sWFL;
    sBQML = sCZML + cConfig.oML.sBQ;
}

//检查操作目录是否设置
function fCheckCZML() {
    return rHelper.fEmptyStr(sCZML);
}

//获取未分类目录
function fGetWFLML() {
    return sWFLML;
}

//获取标签目录
function fGetBQML() {
    return sBQML;
}

//获取分类标签文件路径
function fGetFen1Lei4BQWJLJ() {
    return sBQML + cConfig.oWJM.sFen1Lei4BQ;
}

/**
 * 构造新标签对应的目录
 * @int iBQBSSelect 选中的标签级别
 * @object oAllBQSelectId 所有选中的标签id
 * @int iXinBQId 新标签id
 */
function fMakeFen1Lei4BQML(iBQBSSelect, oAllBQSelectId, iXinBQId) {
    let tiTag = 1;
    let tsMuLu = sCZML
    while (tiTag < iBQBSSelect) {
        tsMuLu += oAllBQSelectId[tiTag - 1] + '\\';
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
 * 用当前选中的标签组合出对应目录
 * @int iBQBSSelect 选中的标签级别
 * @object oAllBQSelectId 所有选中的标签id
 */
function fGetFen1Lei4BQML(iBQBSSelect, oAllBQSelectId) {
    let tiTag = 1;
    let tsMuLu = sCZML
    while (tiTag <= iBQBSSelect) {
        tsMuLu += oAllBQSelectId[tiTag - 1] + '\\';
        if (!rFs.existsSync(tsMuLu)) {
            rFs.mkdirSync(tsMuLu);
        }
        ++tiTag;
    }
    return tsMuLu;
}

module.exports.fSetCZML = fSetCZML;
module.exports.fCheckCZML = fCheckCZML;
module.exports.fGetWFLML = fGetWFLML;
module.exports.fGetBQML = fGetBQML;

module.exports.fGetFen1Lei4BQWJLJ = fGetFen1Lei4BQWJLJ;
module.exports.fMakeFen1Lei4BQML = fMakeFen1Lei4BQML;
module.exports.fGetFen1Lei4BQML = fGetFen1Lei4BQML;