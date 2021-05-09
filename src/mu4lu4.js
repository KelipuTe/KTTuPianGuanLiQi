//目录模块

//配置
const cConfig = {
    oMuLu: {
        sWeiFenLei: 'wei4fen1lei4\\',
        sBiaoQian: 'biao1qian1\\',
    },
    oWenJianMing: {
        sFenLeiBiaoQian: 'fen1lei4biao1qian1.json',
        sBiaoJiBiaoQian: 'biao1ji4biao1qian1.json',
    }
};

//操作目录
let sCaoZuoMuLu = '';
//未分类目录
let sWeiFenLeiMuLu = '';
//标签目录
let sBiaoQianMuLu = '';

function setCaoZuoMuLu(psCaoZuoMuLu) {
    sCaoZuoMuLu = psCaoZuoMuLu;
    sWeiFenLeiMuLu = psCaoZuoMuLu + '\\' + cConfig.oMuLu.sWeiFenLei;
    sBiaoQianMuLu = psCaoZuoMuLu + '\\' + cConfig.oMuLu.sBiaoQian;
}

function getWeiFenLeiMuLu() {
    return sWeiFenLeiMuLu;
}

function getBiaoQianMuLu() {
    return sBiaoQianMuLu;
}

module.exports.setCaoZuoMuLu = setCaoZuoMuLu;
module.exports.getWeiFenLeiMuLu = getWeiFenLeiMuLu;
module.exports.getBiaoQianMuLu = getBiaoQianMuLu;