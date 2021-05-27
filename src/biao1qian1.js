//标签模块

const rHelper = require('./helper');
const rFs = require('fs');

//iBQBS[1,2,3]--[一,二,三]级标签标识
const cConfig = {
    iBQBS1: 1,
    iBQBS2: 2,
    iBQBS3: 3,
};

//标签数据
let oBQData = {};
//[一,二,三]级标签列表
let arrBQ1 = {};
let arrBQ2 = {};
let arrBQ3 = {};

//当前选中的标签标识
let iXuanZhongBQBS = cConfig.iBQBS1;
//当前选中的[一,二,三]级标签Id
let sXuanZhongId1 = '';
let sXuanZhongId2 = '';
let sXuanZhongId3 = '';

/**
 * 获取当前选中标签标识
 * @returns {number}
 */
function fGetXuanZhongBQBS() {
    return iXuanZhongBQBS;
}

/**
 * 设置当前选中标签标识
 * @param piXuanZhongBQBS
 */
function fSetXuanZhongBQBS(piXuanZhongBQBS) {
    iXuanZhongBQBS = piXuanZhongBQBS;
}

/**
 * 获取标签标识对应的标签id
 * @param iXuanZhongBQBS
 * @returns {string}
 */
function fGetXuanZhongId(iXuanZhongBQBS) {
    if (iXuanZhongBQBS === cConfig.iBQBS1) {
        return sXuanZhongId1;
    } else if (iXuanZhongBQBS === cConfig.iBQBS2) {
        return sXuanZhongId2;
    } else if (iXuanZhongBQBS === cConfig.iBQBS3) {
        return sXuanZhongId3;
    }
}

/**
 * 获取全部选中标签的id
 * @returns {string[]}
 */
function fGetAllXuanZhongId() {
    return [sXuanZhongId1, sXuanZhongId2, sXuanZhongId3]
}

/**
 * 设置标签标识对应的标签id
 * @param iXuanZhongBQBS
 * @param psXuanZhongId
 */
function fSetXuanZhongId(iXuanZhongBQBS, psXuanZhongId) {
    if (iXuanZhongBQBS === cConfig.iBQBS1) {
        sXuanZhongId1 = psXuanZhongId;
        let arrBQKey = Object.keys(oBQData[psXuanZhongId].zi3list);
        for (let tsBQKey of arrBQKey) {
            arrBQ2[tsBQKey] = oBQData[psXuanZhongId].zi3list[tsBQKey].ming2cheng1;
        }
    } else if (iXuanZhongBQBS === cConfig.iBQBS2) {
        sXuanZhongId2 = psXuanZhongId;
        let arrBQKey = Object.keys(oBQData[sXuanZhongId1].zi3list[psXuanZhongId].zi3list);
        for (let tsBQKey of arrBQKey) {
            arrBQ3[tsBQKey] = oBQData[sXuanZhongId1].zi3list[psXuanZhongId].zi3list[tsBQKey].ming2cheng1;
        }
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
    if (rHelper.fEmpty(iXinBQId) || rHelper.fEmpty(sXinBQMing)) {
        alert('标签数据错误');
        return {};
    }
    //判断现在选中的是哪一级的标签页
    if (iXuanZhongBQBS === cConfig.iBQBS1) {
        oBQData[iXinBQId] = {};
        oBQData[iXinBQId].ming2cheng1 = sXinBQMing;
        oBQData[iXinBQId].zi3list = {};
        oBQData[iXinBQId].zi3list = fArrBQSort(oBQData[iXinBQId].zi3list);

        arrBQ1[iXinBQId] = sXinBQMing;
        arrBQ1 = fArrBQSort(arrBQ1);

        return arrBQ1;

    } else if (iXuanZhongBQBS === cConfig.iBQBS2) {
        if (rHelper.fEmpty(sXuanZhongId1)) {
            alert('一级标签缺失');
            return {};
        }
        oBQData[sXuanZhongId1].zi3list[iXinBQId] = {};
        oBQData[sXuanZhongId1].zi3list[iXinBQId].ming2cheng1 = sXinBQMing;
        oBQData[sXuanZhongId1].zi3list[iXinBQId].zi3list = {};
        oBQData[sXuanZhongId1].zi3list = fArrBQSort(oBQData[sXuanZhongId1].zi3list);

        arrBQ2[iXinBQId] = sXinBQMing;
        arrBQ2 = fArrBQSort(arrBQ2);

        return arrBQ2;

    } else if (iXuanZhongBQBS === cConfig.iBQBS3) {
        if (rHelper.fEmpty(sXuanZhongId1)) {
            alert('一级标签缺失');
            return {};
        }
        if (rHelper.fEmpty(sXuanZhongId2)) {
            alert('二级标签缺失');
            return {};
        }
        oBQData[sXuanZhongId1].zi3list[sXuanZhongId2].zi3list[iXinBQId] = {};
        oBQData[sXuanZhongId1].zi3list[sXuanZhongId2].zi3list[iXinBQId].ming2cheng1 = sXinBQMing;
        oBQData[sXuanZhongId1].zi3list[sXuanZhongId2].zi3list =
            fArrBQSort(oBQData[sXuanZhongId1].zi3list[sXuanZhongId2].zi3list);

        arrBQ3[iXinBQId] = sXinBQMing;
        arrBQ3 = fArrBQSort(arrBQ3);

        return arrBQ3;
    }
}

/**
 * 保存标签数据
 */
function fSaveFen1Lei4BQ(sFen1Lei4BQMuLu, sBQLu4Jing4) {
    if (!rFs.existsSync(sFen1Lei4BQMuLu)) {
        rFs.mkdirSync(sFen1Lei4BQMuLu);
    }
    rFs.writeFileSync(sBQLu4Jing4, JSON.stringify(oBQData), 'utf8');
}

/**
 * 加载标签数据
 * @param sBQLu4Jing4
 */
function fLoadFen1Lei4BQ(sBQLu4Jing4) {
    if (!rFs.existsSync(sBQLu4Jing4)) {
        return;
    }
    let tsBQData = rFs.readFileSync(sBQLu4Jing4, 'utf8');
    oBQData = JSON.parse(tsBQData);
    let arrBQKey = Object.keys(oBQData);
    for (let tsBQKey of arrBQKey) {
        arrBQ1[tsBQKey] = oBQData[tsBQKey].ming2cheng1;
    }
}

/**
 * 标签列表排序
 * @param arrBQ
 * @returns {{}}
 */
function fArrBQSort(arrBQ) {
    let arrBQKeySort = Object.keys(arrBQ).sort();
    let arrNewBQ = {};
    for (let ii = 0; ii < arrBQKeySort.length; ++ii) {
        arrNewBQ[arrBQKeySort[ii]] = arrBQ[arrBQKeySort[ii]];
    }
    return arrNewBQ;
}

/**
 * 获取待构造标签列表
 */
function fGetDaiGouZaoBQ(piXuanZhongBQBS) {
    if (piXuanZhongBQBS === cConfig.iBQBS1) {
        return arrBQ1;
    } else if (piXuanZhongBQBS === cConfig.iBQBS2) {
        return arrBQ2;
    } else if (piXuanZhongBQBS === cConfig.iBQBS3) {
        return arrBQ3;
    }
    return {};
}

module.exports.cConfig = cConfig;
module.exports.fGetXuanZhongBQBS = fGetXuanZhongBQBS;
module.exports.fSetXuanZhongBQBS = fSetXuanZhongBQBS;
module.exports.fGetXuanZhongId = fGetXuanZhongId;
module.exports.fGetAllXuanZhongId = fGetAllXuanZhongId;
module.exports.fSetXuanZhongId = fSetXuanZhongId;
module.exports.fCleanXuanZhongId = fCleanXuanZhongId;
module.exports.fXinBQAdd = fXinBQAdd;
module.exports.fGetDaiGouZaoBQ = fGetDaiGouZaoBQ;
module.exports.fSaveFen1Lei4BQ = fSaveFen1Lei4BQ;
module.exports.fLoadFen1Lei4BQ = fLoadFen1Lei4BQ;

