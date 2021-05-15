//目录模块

let rHelper = require('./helpers');

//配置
const cConfig = {
    oMuLu: {
        //未分类目录
        sWeiFenLei: 'wei4fen1lei4\\',
        //标签目录
        sBiaoQian: 'biao1qian1\\',
    },
    oWenJianMing: {
        //分类标签存储文件名
        sFenLeiBiaoQian: 'fen1lei4biao1qian1.json',
        //标记标签存储文件名
        sBiaoJiBiaoQian: 'biao1ji4biao1qian1.json',
    }
};

//操作目录
let sCaoZuoMuLu = '';
//未分类目录
let sWeiFenLeiMuLu = '';
//标签目录
let sBiaoQianMuLu = '';

function getCaoZuoMuLu() {
    return sCaoZuoMuLu;
}

function fSetCaoZuoMuLu(psCaoZuoMuLu) {
    sCaoZuoMuLu = psCaoZuoMuLu;
    sWeiFenLeiMuLu = psCaoZuoMuLu + '\\' + cConfig.oMuLu.sWeiFenLei + '\\';
    sBiaoQianMuLu = psCaoZuoMuLu + '\\' + cConfig.oMuLu.sBiaoQian + '\\';
}

function fCheckCaoZuoMuLu() {
    return rHelper.fEmpty(sCaoZuoMuLu);
}

function fGetWeiFenLeiMuLu() {
    return sWeiFenLeiMuLu;
}

function fGetBiaoQianMuLu() {
    return sBiaoQianMuLu;
}

module.exports.getCaoZuoMuLu = getCaoZuoMuLu;
module.exports.fSetCaoZuoMuLu = fSetCaoZuoMuLu;
module.exports.fCheckCaoZuoMuLu = fCheckCaoZuoMuLu;
module.exports.fGetWeiFenLeiMuLu = fGetWeiFenLeiMuLu;
module.exports.fGetBiaoQianMuLu = fGetBiaoQianMuLu;