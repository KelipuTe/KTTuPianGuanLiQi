/*##图片模块##*/

const rHelper = require('./helper');
const rFs = require('fs');

//iSArrTPNameLen--图片列表数量
const cConfig = {
    iSArrTPNameLen: 20,
};

let sarrTPName = []; //图片名列表
let sTPName = ''; //图片名
let sTPLJ = ''; //图片路径
let iTPKuan = 0; //宽
let iTPGao = 0; //高
let sTime = ''; //时间标识
let sTPRename = ''; //重命名

/**
 * 加载图片
 * @string sWFLML 图片目录
 */
function fLoadTP(sWFLML) {
    if (!rFs.existsSync(sWFLML)) {
        return [];
    }
    //清空数据
    sarrTPName = [];
    //同步读取目录下的文件
    let sarrFileName = rFs.readdirSync(sWFLML);
    //一次取一定数量的图片
    let ii = 1;
    for (let sWJM of sarrFileName) {
        if (ii > cConfig.iSArrTPNameLen) {
            break;
        } else {
            sarrTPName.push(sWJM);
            ++ii;
        }
    }
    return sarrTPName;
}

//获取图片名列表
function fGetArrTPName() {
    return sarrTPName;
}

/**
 * 设置图片名
 * @string psTPMing
 */
function fSetTPName(psTPMing) {
    sTPName = psTPMing;
}

/**
 * 设置图片原始宽高
 * @int piTPKuan
 * @int piTPGao
 */
function fSetTPKuanGao(piTPKuan, piTPGao) {
    iTPKuan = piTPKuan;
    iTPGao = piTPGao;
}

/**
 * 设置图片原始路径
 * @string pTPPath
 */
function fSetTPLJ(psTPLJ) {
    sTPLJ = psTPLJ;
}

//图片重命名
function fGetRename() {
    let arrTPName = sTPName.split('.');
    let sTPHou4Zhui4 = arrTPName[arrTPName.length - 1];
    //构造时间字符串
    let oDate = new Date();
    sTime = String(oDate.getFullYear());
    let tiTime = oDate.getMonth() + 1;
    sTime += (tiTime < 10) ? '0' + tiTime : String(tiTime);
    tiTime = oDate.getDate();
    sTime += (tiTime < 10) ? '0' + tiTime : String(tiTime);
    tiTime = oDate.getHours();
    sTime += (tiTime < 10) ? '0' + tiTime : String(tiTime);
    tiTime = oDate.getMinutes();
    sTime += (tiTime < 10) ? '0' + tiTime : String(tiTime);
    tiTime = oDate.getSeconds();
    sTime += (tiTime < 10) ? '0' + tiTime : String(tiTime);
    sTPRename = '-' + iTPKuan + '-' + iTPGao + '-' + sTime + '.' + sTPHou4Zhui4;

    return sTPRename
}

/**
 * 移动图片
 * @string sTargetLJ 目标路径
 */
function fTPMove(sTargetLJ) {
    if (rHelper.fEmpty(sTPLJ) || rHelper.fEmpty(sTargetLJ)) {
        alert('缺少图片路径参数');
        return;
    }
    //移动图片
    rFs.renameSync(sTPLJ, sTargetLJ);
    //从列表移除图片
    let iIndex = sarrTPName.indexOf(sTPName);
    if (iIndex !== -1) {
        sarrTPName.splice(iIndex, 1);
    }
}

module.exports.fLoadTP = fLoadTP;
module.exports.fGetArrTPName = fGetArrTPName;

module.exports.fSetTPName = fSetTPName;
module.exports.fSetTPKuanGao = fSetTPKuanGao;
module.exports.fSetTPLJ = fSetTPLJ;

module.exports.fGetRename = fGetRename;
module.exports.fTPMove = fTPMove;
