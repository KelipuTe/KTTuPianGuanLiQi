//标签模块

let rHelpers = require('./helpers');

//配置
//iBQBS1:一级标签标识
//iBQBS2:二级标签标识
//iBQBS3:三级标签标识
const cConfig = {
    iBQBS1: 1,
    iBQBS2: 2,
    iBQBS3: 3
};

//标签数据
let oBiaoQianShuJu = {};
//一级标签列表
let arrYiJiBiaoQian = {};
//二级标签列表
let arrErJiBiaoQian = {};
//三级标签列表
let arrSanJiBiaoQian = {};
//当前选中的标签页
let iXuanZhongBQBS = cConfig.iYiJiBiaoQianBiaoShi;
//当前选中的一级标签Id
let sYiJiXuanZhongId = '';
//当前选中的二级标签Id
let sErJiXuanZhongId = '';
//当前选中的三级标签Id
let sSanJiXuanZhongId = '';


function fGetXuanZhongBQBS() {
    return iXuanZhongBQBS;
}

function fSetXuanZhongBQBS(piXuanZhongBQBS) {
    iXuanZhongBQBS = piXuanZhongBQBS;
}

function fGetFenJiXuanZhongId(iXuanZhongBQBS) {
    if (iXuanZhongBQBS === cConfig.iYiJiBiaoQianBiaoShi) {
        return sYiJiXuanZhongId;
    } else if (iXuanZhongBQBS === cConfig.iErJiBiaoQianBiaoShi) {
        return sErJiXuanZhongId;
    } else if (iXuanZhongBQBS === cConfig.iSanJiBiaoQianBiaoShi) {
        return sSanJiXuanZhongId;
    }
}

function fSetFenJiXuanZhongId(iXuanZhongBQBS, iXuanZhongId) {
    if (iXuanZhongBQBS === cConfig.iYiJiBiaoQianBiaoShi) {
        return sYiJiXuanZhongId = iXuanZhongId;
    } else if (iXuanZhongBQBS === cConfig.iErJiBiaoQianBiaoShi) {
        return sErJiXuanZhongId = iXuanZhongId;
    } else if (iXuanZhongBQBS === cConfig.iSanJiBiaoQianBiaoShi) {
        return sSanJiXuanZhongId = iXuanZhongId;
    }
}

function fCleanFenJiXuanZhongId(iXuanZhongBQBS) {
    sErJiXuanZhongId = ''
    sSanJiXuanZhongId = ''
}

function fXinBQAdd(iXinBiaoQianId, sXinBiaoQianMing) {
    if (rHelpers.fEmpty(iXinBiaoQianId) || rHelpers.fEmpty(sXinBiaoQianMing)) {
        alert('标签数据错误');
        return {};
    }
    if (iXuanZhongBQBS === cConfig.iYiJiBiaoQianBiaoShi) {
        // 一级
        oBiaoQianShuJu[iXinBiaoQianId] = {};
        oBiaoQianShuJu[iXinBiaoQianId].ming2cheng1 = sXinBiaoQianMing;
        oBiaoQianShuJu[iXinBiaoQianId].zi3lie4biao3 = {};

        arrYiJiBiaoQian[iXinBiaoQianId] = sXinBiaoQianMing;

        return arrYiJiBiaoQian;

    } else if (iXuanZhongBQBS === cConfig.iErJiBiaoQianBiaoShi) {
        // 二级
        if (rHelpers.fEmpty(sYiJiXuanZhongId)) {
            alert('一级标签缺失');
            return;
        }
        oBiaoQianShuJu[sYiJiXuanZhongId].zi3lie4biao3[iXinBiaoQianId] = {};
        oBiaoQianShuJu[sYiJiXuanZhongId].zi3lie4biao3[iXinBiaoQianId].ming2cheng1 = sXinBiaoQianMing;
        oBiaoQianShuJu[sYiJiXuanZhongId].zi3lie4biao3[iXinBiaoQianId].zi3lie4biao3 = {};

        arrErJiBiaoQian[iXinBiaoQianId] = sXinBiaoQianMing;

        return arrErJiBiaoQian;

    } else if (iXuanZhongBQBS === cConfig.iSanJiBiaoQianBiaoShi) {
        // 三级
        if (rHelpers.fEmpty(sYiJiXuanZhongId)) {
            alert('一级标签缺失');
            return;
        }
        if (rHelpers.fEmpty(sErJiXuanZhongId)) {
            alert('二级标签缺失');
            return;
        }
        oBiaoQianShuJu[sYiJiXuanZhongId].zi3lie4biao3[sErJiXuanZhongId].zi3lie4biao3[iXinBiaoQianId] = {};
        oBiaoQianShuJu[sYiJiXuanZhongId].zi3lie4biao3[sErJiXuanZhongId].zi3lie4biao3[iXinBiaoQianId].ming2cheng1 = sXinBiaoQianMing;

        arrSanJiBiaoQian[iXinBiaoQianId] = sXinBiaoQianMing;

        return arrSanJiBiaoQian;
    }
}

function fGetDaiGouZaoBiaoQian() {
    if (iXuanZhongBQBS === cConfig.iYiJiBiaoQianBiaoShi) {
        return arrYiJiBiaoQian;
    } else if (iXuanZhongBQBS === cConfig.iErJiBiaoQianBiaoShi) {
        return arrErJiBiaoQian;
    } else if (iXuanZhongBQBS === cConfig.iSanJiBiaoQianBiaoShi) {
        return arrSanJiBiaoQian;
    }
    return {};
}

module.exports.cConfig = cConfig;
module.exports.fGetXuanZhongBQBS = fGetXuanZhongBQBS;
module.exports.fSetXuanZhongBQBS = fSetXuanZhongBQBS;
module.exports.fGetFenJiXuanZhongId = fGetFenJiXuanZhongId;
module.exports.fXinBQAdd = fXinBQAdd;
module.exports.fGetDaiGouZaoBiaoQian = fGetDaiGouZaoBiaoQian;

