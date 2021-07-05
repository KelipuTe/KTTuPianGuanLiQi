/*图片个体模块*/

const rFs = require('fs');

const rJiao4Yan4 = require('../fu3zhu4/jiao4yan4');

//iImageShowKuanMax--图片展示区域最大宽度
//iImageShowGaoMax--图片展示区域最大高度
const cConfig = {
  iImageShowKuanMax: 900,
  iImageShowGaoMax: 850,
};

let sImageName = ''; //图片名
let sImageFilePath = ''; //图片路径
let iImageKuan = 0; //图片原始宽度
let iImageGao = 0; //图片原始高度
let sImageNewName = ''; //新图片名
let sImageNewFilePath = ''; //新图片路径

//设置被点击的图片名
function fImageNameSet(psName) {
  sImageName = psName;
}

module.exports.fImageNameSet = fImageNameSet;

//获取被点击的图片名
function fImageNameGet(psName) {
  return sImageName;
}

module.exports.fImageNameGet = fImageNameGet;

//设置被点击的图片的原始全路径
function fImageFilePathSet(psPath) {
  sImageFilePath = psPath;
}

module.exports.fImageFilePathSet = fImageFilePathSet;

//设置图片原始宽高
function fImageKuanGaoSet(iKuan, iGao) {
  iImageKuan = iKuan;
  iImageGao = iGao;
}

module.exports.fImageKuanGaoSet = fImageKuanGaoSet;

//计算图片居中需要的偏移量
function fImageMoveCenter() {
  let tiImageKuan=iImageKuan;
  let tiImageGao=iImageGao;
  let iImageMarginLeft = 0;
  let iImageMarginTop = 0;
  if (tiImageKuan <= cConfig.iImageShowKuanMax && tiImageGao <= cConfig.iImageShowGaoMax) {
    //宽高都小于限制，直接计算偏移量
    iImageMarginLeft = Math.round((cConfig.iImageShowKuanMax - tiImageKuan) / 2 * 100) / 100;
    iImageMarginTop = Math.round((cConfig.iImageShowGaoMax - tiImageGao) / 2 * 100) / 100;
  } else if (tiImageKuan <= cConfig.iImageShowKuanMax && tiImageGao > cConfig.iImageShowGaoMax) {
    //只有宽度超过限制，单独计算高度偏移量
    tiImageKuan = Math.round(tiImageKuan * (cConfig.iImageShowGaoMax / tiImageGao));
    iImageMarginLeft = Math.round((cConfig.iImageShowKuanMax - tiImageKuan) / 2 * 100) / 100;
  } else if (tiImageKuan > cConfig.iImageShowKuanMax && tiImageGao <= cConfig.iImageShowGaoMax) {
    //只有高度超过限制，单独计算宽度偏移量
    tiImageGao = Math.round(tiImageGao * (cConfig.iImageShowKuanMax / tiImageKuan));
    iImageMarginTop = Math.round((cConfig.iImageShowGaoMax - tiImageGao) / 2 * 100) / 100;
  } else if (iImageKuan > cConfig.iImageShowKuanMax && tiImageGao > cConfig.iImageShowGaoMax) {
    //只有宽高都超过限制，判断哪个超的更多，需要同比压缩
    if ((tiImageKuan / cConfig.iImageShowKuanMax) >= (tiImageGao / cConfig.iImageShowGaoMax)) {
      tiImageGao = Math.round(tiImageGao * (cConfig.iImageShowKuanMax / tiImageKuan));
      iImageMarginTop = Math.round((cConfig.iImageShowGaoMax - tiImageGao) / 2 * 100) / 100;
    } else {
      tiImageKuan = Math.round(tiImageKuan * (cConfig.iImageShowGaoMax / tiImageGao));
      iImageMarginLeft = Math.round((cConfig.iImageShowKuanMax - tiImageKuan) / 2 * 100) / 100;
    }
  }
  return {
    'iImageMarginTop': iImageMarginTop,
    'iImageMarginLeft': iImageMarginLeft
  };
}

module.exports.fImageMoveCenter = fImageMoveCenter;

//图片重命名
function fImageRename(sarrTagId) {
  let arrImageName = sImageName.split('.');
  let sImageHou4Zhui4 = arrImageName[arrImageName.length - 1];
  //构造时间字符串
  let oDate = new Date();
  let sTime = String(oDate.getFullYear());
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
  sImageNewName = sarrTagId[0] + '-' + (iImageKuan * iImageGao) + '-' + sTime + '.' + sImageHou4Zhui4;
}

module.exports.fImageRename = fImageRename;

//获取新的图片名
function fNewNameGet(){
  return sImageNewName;
}

module.exports.fNewNameGet = fNewNameGet;

//设置被点击的图片的新文件的全路径
function fImageNewFilePathSet(sPath) {
  sImageNewFilePath=sPath;
}

module.exports.fImageNewFilePathSet = fImageNewFilePathSet;

//移动图片
function fImageMove() {
  if (rJiao4Yan4.fEmptyStr(sImageFilePath) || rJiao4Yan4.fEmptyStr(sImageNewFilePath)) {
    alert('缺少图片路径参数');
    return;
  }
  rFs.renameSync(sImageFilePath, sImageNewFilePath);
}

module.exports.fImageMove = fImageMove;

//参数重置
function fImageItemDataClear(){
  sImageName = '';
  sImageFilePath = '';
  iImageKuan = 0;
  iImageGao = 0;
  sImageNewName = '';
  sImageNewFilePath = '';
}

module.exports.fImageItemDataClear = fImageItemDataClear;