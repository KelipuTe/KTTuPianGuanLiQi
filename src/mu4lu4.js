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

function fSetCaoZuoMuLu(psCaoZuoMuLu) {
    sCaoZuoMuLu = psCaoZuoMuLu;
    sWeiFenLeiMuLu = psCaoZuoMuLu + '\\' + cConfig.oMuLu.sWeiFenLei;
    sBiaoQianMuLu = psCaoZuoMuLu + '\\' + cConfig.oMuLu.sBiaoQian;
}

function fGetWeiFenLeiMuLu() {
    return sWeiFenLeiMuLu;
}

function fGetBiaoQianMuLu() {
    return sBiaoQianMuLu;
}

module.exports.fSetCaoZuoMuLu = fSetCaoZuoMuLu;
module.exports.fGetWeiFenLeiMuLu = fGetWeiFenLeiMuLu;
module.exports.fGetBiaoQianMuLu = fGetBiaoQianMuLu;