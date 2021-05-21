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
let oBQData = {};
//一级标签列表
let arrBQ1 = {};
//二级标签列表
let arrBQ2 = {};
//三级标签列表
let arrBQ3 = {};

//当前选中的标签页
let iXuanZhongBQBS = cConfig.iBQBS1;
//当前选中的一级标签Id
let sXuanZhongId1 = '';
//当前选中的二级标签Id
let sXuanZhongId2 = '';
//当前选中的三级标签Id
let sXuanZhongId3 = '';


function fGetXuanZhongBQBS() {
    return iXuanZhongBQBS;
}

function fSetXuanZhongBQBS(piXuanZhongBQBS) {
    iXuanZhongBQBS = piXuanZhongBQBS;
}

function fGetXuanZhongId(iXuanZhongBQBS) {
    if (iXuanZhongBQBS === cConfig.iBQBS1) {
        return sXuanZhongId1;
    } else if (iXuanZhongBQBS === cConfig.iBQBS2) {
        return sXuanZhongId2;
    } else if (iXuanZhongBQBS === cConfig.iBQBS3) {
        return sXuanZhongId3;
    }
}

function fSetXuanZhongId(iXuanZhongBQBS, psXuanZhongId) {
    if (iXuanZhongBQBS === cConfig.iBQBS1) {
        sXuanZhongId1 = psXuanZhongId;
        arrBQ2 = oBQData[psXuanZhongId].zi3lie4biao3;
    } else if (iXuanZhongBQBS === cConfig.iBQBS2) {
        sXuanZhongId2 = psXuanZhongId;
        arrBQ3 = oBQData[sXuanZhongId1].zi3lie4biao3[psXuanZhongId].zi3lie4biao3;
    } else if (iXuanZhongBQBS === cConfig.iBQBS3) {
        sXuanZhongId3 = psXuanZhongId;
    }
}

/**
 * 根据标签标识清理数据
 * @param iXuanZhongBQBS
 */
function fCleanXuanZhongId(iXuanZhongBQBS) {
    if (iXuanZhongBQBS === cConfig.iBQBS1) {
        sXuanZhongId1 = '';
        arrBQ2 = {};
        sXuanZhongId2 = '';
        arrBQ3 = {};
        sXuanZhongId3 = '';
    } else if (iXuanZhongBQBS === cConfig.iBQBS2) {
        sXuanZhongId2 = '';
        arrBQ3 = {};
        sXuanZhongId3 = '';
    } else if (iXuanZhongBQBS === cConfig.iBQBS3) {
        sXuanZhongId3 = '';
    }
}

/**
 * 添加新标签
 * @param iXinBQId 标签id
 * @param sXinBQMing 标签名
 */
function fXinBQAdd(iXinBQId, sXinBQMing) {
    if (rHelpers.fEmpty(iXinBQId) || rHelpers.fEmpty(sXinBQMing)) {
        alert('标签数据错误');
        return {};
    }
    //判断现在选中的是哪一级的标签页
    if (iXuanZhongBQBS === cConfig.iBQBS1) {
        oBQData[iXinBQId] = {};
        oBQData[iXinBQId].ming2cheng1 = sXinBQMing;
        oBQData[iXinBQId].zi3lie4biao3 = {};

        arrBQ1[iXinBQId] = sXinBQMing;
        arrBQ1 = fArrBQSort(arrBQ1);

        return arrBQ1;

    } else if (iXuanZhongBQBS === cConfig.iBQBS2) {
        if (rHelpers.fEmpty(sXuanZhongId1)) {
            alert('一级标签缺失');
            return {};
        }
        oBQData[sXuanZhongId1].zi3lie4biao3[iXinBQId] = {};
        oBQData[sXuanZhongId1].zi3lie4biao3[iXinBQId].ming2cheng1 = sXinBQMing;
        oBQData[sXuanZhongId1].zi3lie4biao3[iXinBQId].zi3lie4biao3 = {};

        arrBQ2[iXinBQId] = sXinBQMing;
        arrBQ2 = fArrBQSort(arrBQ2);

        return arrBQ2;

    } else if (iXuanZhongBQBS === cConfig.iBQBS3) {
        if (rHelpers.fEmpty(sXuanZhongId1)) {
            alert('一级标签缺失');
            return {};
        }
        if (rHelpers.fEmpty(sXuanZhongId2)) {
            alert('二级标签缺失');
            return {};
        }
        oBQData[sXuanZhongId1].zi3lie4biao3[sXuanZhongId2].zi3lie4biao3[iXinBQId] = {};
        oBQData[sXuanZhongId1].zi3lie4biao3[sXuanZhongId2].zi3lie4biao3[iXinBQId].ming2cheng1 = sXinBQMing;

        arrBQ3[iXinBQId] = sXinBQMing;
        arrBQ3 = fArrBQSort(arrBQ3);

        return arrBQ3;
    }
}

function fArrBQSort(arrBQ) {
    let arrBQKeySort = Object.keys(arrBQ).sort();
    let arrNewBQ = {};
    for (let ii = 0; ii < arrBQKeySort.length; ++ii) {
        arrNewBQ[arrBQKeySort[ii]] = arrBQ1[arrBQKeySort[ii]];
    }
    return arrNewBQ;
}

/**
 * 获取待构造标签
 */
function fGetDaiGouZaoBQ() {
    if (iXuanZhongBQBS === cConfig.iBQBS1) {
        return arrBQ1;
    } else if (iXuanZhongBQBS === cConfig.iBQBS2) {
        return arrBQ2;
    } else if (iXuanZhongBQBS === cConfig.iBQBS3) {
        return arrBQ3;
    }
    return {};
}

module.exports.cConfig = cConfig;
module.exports.fGetXuanZhongBQBS = fGetXuanZhongBQBS;
module.exports.fSetXuanZhongBQBS = fSetXuanZhongBQBS;
module.exports.fGetXuanZhongId = fGetXuanZhongId;
module.exports.fSetXuanZhongId = fSetXuanZhongId;
module.exports.fCleanXuanZhongId = fCleanXuanZhongId;
module.exports.fXinBQAdd = fXinBQAdd;
module.exports.fGetDaiGouZaoBQ = fGetDaiGouZaoBQ;

