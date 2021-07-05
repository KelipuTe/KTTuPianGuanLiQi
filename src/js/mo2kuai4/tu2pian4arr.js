/*##图片列表模块##*/

const rFs = require('fs');

//iOArrImageLen--图片列表数量
const cConfig = {
  iOArrImageLen: 50,
};

let oarrImage = []; //图片列表
let iarrImageLen = 0; //图片列表长度

//获取图片列表
function fOArrImageGet() {
  return oarrImage;
}

module.exports.fOArrImageGet = fOArrImageGet;

//获取图片列表长度
function fIArrImageLenGet() {
  return iarrImageLen;
}

module.exports.fIArrImageLenGet = fIArrImageLenGet;

//从目录中读取图片
function fImageLoad(sMu4Lu4) {
  if (!rFs.existsSync(sMu4Lu4)) {
    return [];
  }
  oarrImage = [];
  let sarrFileName = rFs.readdirSync(sMu4Lu4);
  iarrImageLen = 0;
  for (let sFileName of sarrFileName) {
    if (iarrImageLen >= cConfig.iOArrImageLen) {
      break;
    } else {
      let tImageItem = {
        image0name: sFileName,
        image0file0path: sMu4Lu4 + sFileName
      }
      oarrImage.push(tImageItem);
      ++iarrImageLen;
    }
  }
}

module.exports.fImageLoad = fImageLoad;

//移除图片列表中对应图片
function fImageItemDel(sImageName) {
  for (let ii = 0; ii < iarrImageLen; ++ii) {
    if (oarrImage[ii].image0name === sImageName) {
      oarrImage.splice(ii, 1);
      --iarrImageLen;
      break;
    }
  }
}

module.exports.fImageItemDel = fImageItemDel;