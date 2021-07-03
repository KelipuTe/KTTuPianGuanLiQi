/*##图片模块##*/

const rFs = require('fs');

const rJiao4Yan4 = require('../fu3zhu4/jiao4yan4');

//iSArrTPNameLen--图片名列表数量
//iTPShowKuanMax,iTPShowGaoMax--图片展示区域最大宽高
const cConfig = {
  iSArrTPNameLen: 50,
  iTPShowKuanMax: 900,
  iTPShowGaoMax: 800,
};

let sarrTPName = []; //图片名列表
let sTPName = ''; //图片名
let sTPLJ = ''; //图片路径
let iTPKuan = 0; //图片原始宽度
let iTPGao = 0; //图片原始高度
let sTime = ''; //时间标识
let sTPRename = ''; //重命名

/**
 * 加载图片
 * @string sTPML 图片目录
 */
function fLoadTP(sTPML) {
  if (!rFs.existsSync(sTPML)) {
    return [];
  }
  sarrTPName = [];
  //同步读取目录下的文件
  let sarrFileName = rFs.readdirSync(sTPML);
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

module.exports.fLoadTP = fLoadTP;

//获取图片名列表
function fGetSArrTPName() {
  return sarrTPName;
}

module.exports.fGetSArrTPName = fGetSArrTPName;

/**
 * 设置图片名
 * @string psTPMing
 */
function fSetTPName(psTPMing) {
  sTPName = psTPMing;
}

module.exports.fSetTPName = fSetTPName;

/**
 * 设置图片原始路径
 * @string pTPPath
 */
function fSetTPLJ(psTPLJ) {
  sTPLJ = psTPLJ;
}

module.exports.fSetTPLJ = fSetTPLJ;

/**
 * 设置图片原始宽高
 * @int piTPKuan
 * @int piTPGao
 */
function fSetTPKuanGao(piTPKuan, piTPGao) {
  iTPKuan = piTPKuan;
  iTPGao = piTPGao;
}

module.exports.fSetTPKuanGao = fSetTPKuanGao;

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

module.exports.fGetRename = fGetRename;

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

module.exports.fTPMove = fTPMove;

/**
 * 计算图片居中需要的偏移量
 * @int iTPKuan
 * @int iTPGao
 */
function fTPCenter(iTPKuan, iTPGao) {
  let iTPMarginLeft = 0;
  let iTPMarginTop = 0;
  if (iTPKuan <= cConfig.iTPShowKuanMax && iTPGao <= cConfig.iTPShowGaoMax) {
    // 宽高都小于限制，直接计算偏移量
    iTPMarginLeft = Math.round((cConfig.iTPShowKuanMax - iTPKuan) / 2 * 100) / 100;
    iTPMarginTop = Math.round((cConfig.iTPShowGaoMax - iTPGao) / 2 * 100) / 100;
  } else if (iTPKuan <= cConfig.iTPShowKuanMax && iTPGao > cConfig.iTPShowGaoMax) {
    // 只有宽度超过限制，单独计算高度偏移量
    iTPKuan = Math.round(iTPKuan * (cConfig.iTPShowGaoMax / iTPGao));
    iTPMarginLeft = Math.round((cConfig.iTPShowKuanMax - iTPKuan) / 2 * 100) / 100;
  } else if (iTPKuan > cConfig.iTPShowKuanMax && iTPGao <= cConfig.iTPShowGaoMax) {
    // 只有高度超过限制，单独计算宽度偏移量
    iTPGao = Math.round(iTPGao * (cConfig.iTPShowKuanMax / iTPKuan));
    iTPMarginTop = Math.round((cConfig.iTPShowGaoMax - iTPGao) / 2 * 100) / 100;
  } else if (iTPKuan > cConfig.iTPShowKuanMax && iTPGao > cConfig.iTPShowGaoMax) {
    // 只有宽高都超过限制，判断哪个超的更多，需要同比压缩
    if ((iTPKuan / cConfig.iTPShowKuanMax) >= (iTPGao / cConfig.iTPShowGaoMax)) {
      iTPGao = Math.round(iTPGao * (cConfig.iTPShowKuanMax / iTPKuan));
      iTPMarginTop = Math.round((cConfig.iTPShowGaoMax - iTPGao) / 2 * 100) / 100;
    } else {
      iTPKuan = Math.round(iTPKuan * (cConfig.iTPShowGaoMax / iTPGao));
      iTPMarginLeft = Math.round((cConfig.iTPShowKuanMax - iTPKuan) / 2 * 100) / 100;
    }
  }
  return {
    'iTPMarginTop': iTPMarginTop,
    'iTPMarginLeft': iTPMarginLeft
  };
}

module.exports.fTPCenter = fTPCenter;
