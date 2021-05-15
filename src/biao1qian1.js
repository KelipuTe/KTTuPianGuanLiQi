//标签模块

let rHelpers = require('./helpers');

//配置
const cConfig = {
    //一级标签标识
    iYiJiBiaoQianBiaoShi: 0,
    //二级标签标识
    iErJiBiaoQianBiaoShi: 1,
    //三级标签标识
    iSanJiBiaoQianBiaoShi: 2
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
let iXuanZhongBiaoQianYe = cConfig.iYiJiBiaoQianBiaoShi;
//当前选中的一级标签Id
let sYiJiXuanZhongId = '';
//当前选中的二级标签Id
let sErJiXuanZhongId = '';
//当前选中的三级标签Id
let sSanJiXuanZhongId = '';

function fGetXuanZhongBiaoQianYe() {
    return iXuanZhongBiaoQianYe;
}

function fSetXuanZhongBiaoQianYe(piXuanZhongBiaoQianYe) {
    iXuanZhongBiaoQianYe = piXuanZhongBiaoQianYe;
}

function fTianJiaBiaoQian(iXinBiaoQianId, sXinBiaoQianMing) {
    let sXinMuBiaoMuLu = '';
    if (rHelpers.fEmpty(iXinBiaoQianId) || rHelpers.fEmpty(sXinBiaoQianMing)) {
        alert('标签数据错误');
        return;
    }
    if (iXuanZhongBiaoQianYe === cConfig.iYiJiBiaoQianBiaoShi) {
        // 一级
        oBiaoQianShuJu[iXinBiaoQianId] = {};
        oBiaoQianShuJu[iXinBiaoQianId].ming2cheng1 = sXinBiaoQianMing;
        oBiaoQianShuJu[iXinBiaoQianId].zi3lie4biao3 = {};

        arrYiJiBiaoQian[iXinBiaoQianId] = sXinBiaoQianMing;

        sXinMuBiaoMuLu = iXinBiaoQianId;
    } else if (iXuanZhongBiaoQianYe === cConfig.iErJiBiaoQianBiaoShi) {
        // 二级
        if (rHelpers.fEmpty(sYiJiXuanZhongId)) {
            alert('一级标签缺失');
            return;
        }
        oBiaoQianShuJu[sYiJiXuanZhongId].zi3lie4biao3[iXinBiaoQianId] = {};
        oBiaoQianShuJu[sYiJiXuanZhongId].zi3lie4biao3[iXinBiaoQianId].ming2cheng1 = sXinBiaoQianMing;
        oBiaoQianShuJu[sYiJiXuanZhongId].zi3lie4biao3[iXinBiaoQianId].zi3lie4biao3 = {};

        arrErJiBiaoQian[iXinBiaoQianId] = sXinBiaoQianMing;

        sXinMuBiaoMuLu = sYiJiXuanZhongId + '\\' + iXinBiaoQianId;
    } else if (iXuanZhongBiaoQianYe === cConfig.iSanJiBiaoQianBiaoShi) {
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

        sXinMuBiaoMuLu = sYiJiXuanZhongId + '\\' + sErJiXuanZhongId + '\\' + iXinBiaoQianId;
    }

    console.log(oBiaoQianShuJu);
    console.log(arrYiJiBiaoQian);
    console.log(arrErJiBiaoQian);
    console.log(arrSanJiBiaoQian);

    return sXinMuBiaoMuLu;
}

function fGetDaiGouZaoBiaoQian() {
    if (iXuanZhongBiaoQianYe === cConfig.iYiJiBiaoQianBiaoShi) {
        return arrYiJiBiaoQian;
    } else if (iXuanZhongBiaoQianYe === cConfig.iErJiBiaoQianBiaoShi) {
        return arrErJiBiaoQian;
    } else if (iXuanZhongBiaoQianYe === cConfig.iSanJiBiaoQianBiaoShi) {
        return arrSanJiBiaoQian;
    }
    return [];
}

module.exports.fGetXuanZhongBiaoQianYe = fGetXuanZhongBiaoQianYe;
module.exports.fSetXuanZhongBiaoQianYe = fSetXuanZhongBiaoQianYe;
module.exports.fTianJiaBiaoQian = fTianJiaBiaoQian;
module.exports.fGetDaiGouZaoBiaoQian = fGetDaiGouZaoBiaoQian;

