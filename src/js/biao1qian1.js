/*##标签模块##*/

const rHelper = require('./helper');
const rFs = require('fs');

//iBQBS[1,2,3]--[一,二,三]级标签标识
const cConfig = {
    iBQBS1: 1,
    iBQBS2: 2,
    iBQBS3: 3,
};

let oBQData = {}; //标签数据
let arrBQ1 = {}; //一级标签列表
let arrBQ2 = {}; //二级标签列表
let arrBQ3 = {}; //三级标签列表
let iBQBSSelect = cConfig.iBQBS1; //当前选中的标签标识
let sBQSelectId1 = ''; //当前选中的一级标签Id
let sBQSelectId2 = ''; //当前选中的二级标签Id
let sBQSelectId3 = ''; //当前选中的三级标签Id

/*##辅助函数##*/

/**
 * 标签列表排序
 * @object arrBQ 标签列表
 */
function fArrBQSort(arrBQ) {
    let arrBQKeySort = Object.keys(arrBQ).sort();
    let arrNewBQ = {};
    for (let ii = 0; ii < arrBQKeySort.length; ++ii) {
        arrNewBQ[arrBQKeySort[ii]] = arrBQ[arrBQKeySort[ii]];
    }
    return arrNewBQ;
}

/*####辅助函数####*/

//获取当前选中标签标识
function fGetBQBSSelect() {
    return iBQBSSelect;
}

/**
 * 设置当前选中标签标识
 * @int piBQBSSelect 标签标识
 */
function fSetBQBSSelect(piBQBSSelect) {
    iBQBSSelect = piBQBSSelect;
}

/**
 * 获取标签标识对应的标签id
 * @int iBQBSSelect 标签标识
 */
function fGetBQSelectId(iBQBSSelect) {
    if (iBQBSSelect === cConfig.iBQBS1) {
        return sBQSelectId1;
    } else if (iBQBSSelect === cConfig.iBQBS2) {
        return sBQSelectId2;
    } else if (iBQBSSelect === cConfig.iBQBS3) {
        return sBQSelectId3;
    }
}

/**
 * 设置标签标识对应的标签id
 * @int iBQBSSelect 标签标识
 * @string psBQSelectId 标签id
 */
function fSetBQSelectId(iBQBSSelect, psBQSelectId) {
    if (iBQBSSelect === cConfig.iBQBS1) {
        sBQSelectId1 = psBQSelectId;
        let arrBQKey = Object.keys(oBQData[psBQSelectId].mapzi3bq);
        for (let tsBQKey of arrBQKey) {
            arrBQ2[tsBQKey] = oBQData[psBQSelectId].mapzi3bq[tsBQKey].bq0name;
        }
        return arrBQ1[psBQSelectId];
    } else if (iBQBSSelect === cConfig.iBQBS2) {
        sBQSelectId2 = psBQSelectId;
        let arrBQKey = Object.keys(oBQData[sBQSelectId1].mapzi3bq[psBQSelectId].mapzi3bq);
        for (let tsBQKey of arrBQKey) {
            arrBQ3[tsBQKey] = oBQData[sBQSelectId1].mapzi3bq[psBQSelectId].mapzi3bq[tsBQKey].bq0name;
        }
        return arrBQ2[psBQSelectId];
    } else if (iBQBSSelect === cConfig.iBQBS3) {
        sBQSelectId3 = psBQSelectId;
        return arrBQ3[psBQSelectId];
    }
}

/**
 * 根据标签标识清理数据
 * @int iBQBSSelect 标签标识
 */
function fCleanBQSelectId(iBQBSSelect) {
    if (iBQBSSelect === cConfig.iBQBS1) {
        sBQSelectId1 = '';
        arrBQ2 = {};
        sBQSelectId2 = '';
        arrBQ3 = {};
        sBQSelectId3 = '';
    } else if (iBQBSSelect === cConfig.iBQBS2) {
        sBQSelectId2 = '';
        arrBQ3 = {};
        sBQSelectId3 = '';
    } else if (iBQBSSelect === cConfig.iBQBS3) {
        sBQSelectId3 = '';
    }
}

//获取全部选中标签的id
function fGetAllBQSelectId() {
    return [sBQSelectId1, sBQSelectId2, sBQSelectId3]
}

/**
 * 添加新标签
 * @string sXinBQId 标签id
 * @string sXinBQName 标签名
 */
function fXinBQAdd(sXinBQId, sXinBQName) {
    if (rHelper.fEmpty(sXinBQId) || rHelper.fEmpty(sXinBQName)) {
        alert('标签数据错误');
        return '';
    }
    sXinBQId = sXinBQId.toLowerCase();
    let sOldBQId = ''; //用于判断是新标签还是老标签
    //判断现在选中的是哪一级的标签页
    if (iBQBSSelect === cConfig.iBQBS1) {
        if (rHelper.fEmpty(oBQData[sXinBQId])) {
            oBQData[sXinBQId] = {};
            oBQData[sXinBQId].bq0name = sXinBQName;
            oBQData[sXinBQId].mapzi3bq = {};
            oBQData[sXinBQId].mapzi3bq = fArrBQSort(oBQData[sXinBQId].mapzi3bq);
        } else {
            sOldBQId = sXinBQId;
            oBQData[sXinBQId].bq0name = sXinBQName;
        }
        arrBQ1[sXinBQId] = sXinBQName;
        arrBQ1 = fArrBQSort(arrBQ1);

        return sOldBQId;
    } else if (iBQBSSelect === cConfig.iBQBS2) {
        if (rHelper.fEmpty(sBQSelectId1)) {
            alert('一级标签缺失');
            return '';
        }
        if (rHelper.fEmpty(oBQData[sBQSelectId1].mapzi3bq[sXinBQId])) {
            oBQData[sBQSelectId1].mapzi3bq[sXinBQId] = {};
            oBQData[sBQSelectId1].mapzi3bq[sXinBQId].bq0name = sXinBQName;
            oBQData[sBQSelectId1].mapzi3bq[sXinBQId].mapzi3bq = {};
            oBQData[sBQSelectId1].mapzi3bq = fArrBQSort(oBQData[sBQSelectId1].mapzi3bq);
        } else {
            sOldBQId = sXinBQId;
            oBQData[sBQSelectId1].mapzi3bq[sXinBQId].bq0name = sXinBQName;
        }
        arrBQ2[sXinBQId] = sXinBQName;
        arrBQ2 = fArrBQSort(arrBQ2);

        return sOldBQId;
    } else if (iBQBSSelect === cConfig.iBQBS3) {
        if (rHelper.fEmpty(sBQSelectId1)) {
            alert('一级标签缺失');
            return '';
        }
        if (rHelper.fEmpty(sBQSelectId2)) {
            alert('二级标签缺失');
            return '';
        }
        if (rHelper.fEmpty(oBQData[sBQSelectId1].mapzi3bq[sBQSelectId2].mapzi3bq[sXinBQId])) {
            oBQData[sBQSelectId1].mapzi3bq[sBQSelectId2].mapzi3bq[sXinBQId] = {};
            oBQData[sBQSelectId1].mapzi3bq[sBQSelectId2].mapzi3bq[sXinBQId].bq0name = sXinBQName;
            oBQData[sBQSelectId1].mapzi3bq[sBQSelectId2].mapzi3bq =
                fArrBQSort(oBQData[sBQSelectId1].mapzi3bq[sBQSelectId2].mapzi3bq);
        } else {
            sOldBQId = sXinBQId;
            oBQData[sBQSelectId1].mapzi3bq[sBQSelectId2].mapzi3bq[sXinBQId].bq0name = sXinBQName;
        }
        arrBQ3[sXinBQId] = sXinBQName;
        arrBQ3 = fArrBQSort(arrBQ3);

        return sOldBQId;
    }
}

/**
 * 保存分类标签数据
 * @string sFen1Lei4BQML 分类标签目录
 * @string sBQPath 分类标签文件路径
 */
function fSaveFen1Lei4BQ(sFen1Lei4BQML, sBQPath) {
    if (!rFs.existsSync(sFen1Lei4BQML)) {
        rFs.mkdirSync(sFen1Lei4BQML);
    }
    rFs.writeFileSync(sBQPath, JSON.stringify(oBQData), 'utf8');
}

/**
 * 加载标签数据
 * @string sBQPath 分类标签文件路径
 */
function fLoadFen1Lei4BQ(sBQPath) {
    if (!rFs.existsSync(sBQPath)) {
        return;
    }
    let tsBQData = rFs.readFileSync(sBQPath, 'utf8');
    oBQData = JSON.parse(tsBQData);
    let arrBQKey = Object.keys(oBQData);
    for (let tsBQKey of arrBQKey) {
        arrBQ1[tsBQKey] = oBQData[tsBQKey].bq0name;
    }
}

/**
 * 获取待构造标签列表
 * @param piBQBSSelect 标签标识
 */
function fGetWaitBQ(piBQBSSelect) {
    if (piBQBSSelect === cConfig.iBQBS1) {
        return arrBQ1;
    } else if (piBQBSSelect === cConfig.iBQBS2) {
        return arrBQ2;
    } else if (piBQBSSelect === cConfig.iBQBS3) {
        return arrBQ3;
    }
    return {};
}

module.exports.cConfig = cConfig;
module.exports.fGetBQBSSelect = fGetBQBSSelect;
module.exports.fSetBQBSSelect = fSetBQBSSelect;
module.exports.fGetBQSelectId = fGetBQSelectId;
module.exports.fSetBQSelectId = fSetBQSelectId;
module.exports.fCleanBQSelectId = fCleanBQSelectId;
module.exports.fGetAllBQSelectId = fGetAllBQSelectId;
module.exports.fXinBQAdd = fXinBQAdd;
module.exports.fSaveFen1Lei4BQ = fSaveFen1Lei4BQ;
module.exports.fLoadFen1Lei4BQ = fLoadFen1Lei4BQ;
module.exports.fGetWaitBQ = fGetWaitBQ;

