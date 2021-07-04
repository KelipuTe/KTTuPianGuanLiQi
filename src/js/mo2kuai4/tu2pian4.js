/*##图片模块##*/

const rFs = require('fs');

const rJiao4Yan4 = require('../fu3zhu4/jiao4yan4');

//iSArrImageNameLen--图片名列表数量
//iImageShowKuanMax--图片展示区域最大宽度
//iImageShowGaoMax--图片展示区域最大高度
const cConfig = {
  iSArrImageNameLen: 50,
  iImageShowKuanMax: 900,
  iImageShowGaoMax: 850,
};

let sarrImageName = []; //图片名列表

let sImageName = ''; //图片名
let sImageFilePath = ''; //图片路径
let iImageKuan = 0; //图片原始宽度
let iImageGao = 0; //图片原始高度

let sTime = ''; //时间标识
let sImageNewName = ''; //重命名
let sImageNewFilePath = ''; //重命名

/**
 * @string sImageMu4Lu4 图片目录
 */
function fLoadImage(sImageMu4Lu4) {
  if (!rFs.existsSync(sImageMu4Lu4)) {
    return [];
  }
  sarrImageName = [];
  //同步读取目录下的文件
  let sarrFileName = rFs.readdirSync(sImageMu4Lu4);
  let ii = 1;
  for (let sFileName of sarrFileName) {
    if (ii > cConfig.iSArrImageNameLen) {
      break;
    } else {
      sarrImageName.push(sFileName);
      ++ii;
    }
  }
}

module.exports.fLoadImage = fLoadImage;

//获取图片名列表
function fGetSArrImageName() {
  return sarrImageName;
}

module.exports.fGetSArrImageName = fGetSArrImageName;

/**
 * 设置图片名
 * @string psImageMing
 */
function fSetImageName(psName) {
  sImageName = psName;
}

module.exports.fSetImageName = fSetImageName;

/**
 * 设置图片原始路径
 * @string psPath
 */
function fSetImageFilePath(psPath) {
  sImageFilePath = psPath;
}

module.exports.fSetImageFilePath = fSetImageFilePath;

/**
 * 设置图片原始宽高
 * @int piImageKuan
 * @int piImageGao
 */
function fSetImageKuanGao(piImageKuan, piImageGao) {
  iImageKuan = piImageKuan;
  iImageGao = piImageGao;
}

module.exports.fSetImageKuanGao = fSetImageKuanGao;

//图片重命名
function fGetRename(sTagId) {
  let arrImageName = sImageName.split('.');
  let sImageHou4Zhui4 = arrImageName[arrImageName.length - 1];
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
  sImageNewName = sTagId + '-' + (iImageKuan * iImageGao) + '-' + sTime + '.' + sImageHou4Zhui4;
}

module.exports.fGetRename = fGetRename;

function fGetNewName(){
  return sImageNewName;
}

module.exports.fGetNewName = fGetNewName;

function setImageNewFilePath(sPath) {
  sImageNewFilePath=sPath;
}

module.exports.setImageNewFilePath = setImageNewFilePath;

/**
 * 移动图片
 * @string sTargetLJ 目标路径
 */
function fImageMove() {
  if (rJiao4Yan4.fEmptyStr(sImageFilePath) || rJiao4Yan4.fEmptyStr(sImageNewFilePath)) {
    alert('缺少图片路径参数');
    return;
  }
  rFs.renameSync(sImageFilePath, sImageNewFilePath);
  let iIndex = sarrImageName.indexOf(sImageName);
  if (iIndex >= 0) {
    sarrImageName.splice(iIndex, 1);
  }
}

module.exports.fImageMove = fImageMove;

function fClearImageItemData(){
  sImageName = '';
  sImageFilePath = '';
  iImageKuan = 0;
  iImageGao = 0;
  sTime = '';
  sImageNewName = '';
  sImageNewFilePath = '';
}

module.exports.fClearImageItemData = fClearImageItemData;

/**
 * 计算图片居中需要的偏移量
 * @int iImageKuan
 * @int iImageGao
 */
function fImageCenter(iImageKuan, iImageGao) {
  let iImageMarginLeft = 0;
  let iImageMarginTop = 0;
  if (iImageKuan <= cConfig.iImageShowKuanMax && iImageGao <= cConfig.iImageShowGaoMax) {
    // 宽高都小于限制，直接计算偏移量
    iImageMarginLeft = Math.round((cConfig.iImageShowKuanMax - iImageKuan) / 2 * 100) / 100;
    iImageMarginTop = Math.round((cConfig.iImageShowGaoMax - iImageGao) / 2 * 100) / 100;
  } else if (iImageKuan <= cConfig.iImageShowKuanMax && iImageGao > cConfig.iImageShowGaoMax) {
    // 只有宽度超过限制，单独计算高度偏移量
    iImageKuan = Math.round(iImageKuan * (cConfig.iImageShowGaoMax / iImageGao));
    iImageMarginLeft = Math.round((cConfig.iImageShowKuanMax - iImageKuan) / 2 * 100) / 100;
  } else if (iImageKuan > cConfig.iImageShowKuanMax && iImageGao <= cConfig.iImageShowGaoMax) {
    // 只有高度超过限制，单独计算宽度偏移量
    iImageGao = Math.round(iImageGao * (cConfig.iImageShowKuanMax / iImageKuan));
    iImageMarginTop = Math.round((cConfig.iImageShowGaoMax - iImageGao) / 2 * 100) / 100;
  } else if (iImageKuan > cConfig.iImageShowKuanMax && iImageGao > cConfig.iImageShowGaoMax) {
    // 只有宽高都超过限制，判断哪个超的更多，需要同比压缩
    if ((iImageKuan / cConfig.iImageShowKuanMax) >= (iImageGao / cConfig.iImageShowGaoMax)) {
      iImageGao = Math.round(iImageGao * (cConfig.iImageShowKuanMax / iImageKuan));
      iImageMarginTop = Math.round((cConfig.iImageShowGaoMax - iImageGao) / 2 * 100) / 100;
    } else {
      iImageKuan = Math.round(iImageKuan * (cConfig.iImageShowGaoMax / iImageGao));
      iImageMarginLeft = Math.round((cConfig.iImageShowKuanMax - iImageKuan) / 2 * 100) / 100;
    }
  }
  return {
    'iImageMarginTop': iImageMarginTop,
    'iImageMarginLeft': iImageMarginLeft
  };
}

module.exports.fImageCenter = fImageCenter;
