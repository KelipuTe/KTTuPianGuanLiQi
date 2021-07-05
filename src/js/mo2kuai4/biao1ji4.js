/*##标记模块##*/

const rFs = require('fs');

const rJiao4Yan4 = require('../fu3zhu4/jiao4yan4');

//mapTagType--标签类别：1=分类标签；2=标记标签
const cConfig = {
  mapTagType: {
    fen1lei4: 1,
    biao1ji4: 2
  }
};

module.exports.cConfig = cConfig;

let arrBiao1Ji4Data = []; //标记数据

let sFen1Lei4TagId = ''; //选中的分类标签id
let sarrBiao1Ji4TagId = []; //选中的标记标签id列表

//设置标签
function fSelectedTagSet(sTagId, iTagType) {
  iTagType = parseInt(iTagType);
  if (iTagType === cConfig.mapTagType.fen1lei4) {
    sFen1Lei4TagId = sTagId;
  } else if (iTagType === cConfig.mapTagType.biao1ji4) {
    sarrBiao1Ji4TagId.push(sTagId);
  }
}

module.exports.fSelectedTagSet = fSelectedTagSet;

//移除标签
function fSelectedTagDel(sTagId, iTagType) {
  iTagType = parseInt(iTagType);
  if (iTagType === cConfig.mapTagType.fen1lei4) {
    sFen1Lei4TagId = '';
  } else if (iTagType === cConfig.mapTagType.biao1ji4) {
    let iIndex = sarrBiao1Ji4TagId.indexOf(sTagId);
    if (iIndex >= 0) {
      sarrBiao1Ji4TagId.splice(iIndex, 1);
    }
  }
}

module.exports.fSelectedTagDel = fSelectedTagDel;

//校验标签是否已经设置
function fSelectedTagIsSet(sTagId, iTagType) {
  iTagType = parseInt(iTagType);
  if (iTagType === cConfig.mapTagType.fen1lei4) {
    return sTagId === sFen1Lei4TagId;
  } else if (iTagType === cConfig.mapTagType.biao1ji4) {
    return sarrBiao1Ji4TagId.indexOf(sTagId) >= 0
  }
}

module.exports.fSelectedTagIsSet = fSelectedTagIsSet;

//获取已经设置的标签
function fSelectedTagGet(iTagType) {
  iTagType = parseInt(iTagType);
  if (iTagType === cConfig.mapTagType.fen1lei4) {
    return sFen1Lei4TagId;
  } else if (iTagType === cConfig.mapTagType.biao1ji4) {
    return sarrBiao1Ji4TagId
  }
}

module.exports.fSelectedTagGet = fSelectedTagGet;

//获取标签的颜色样式
function fTagBtnClassGet(sTagId, iTagType) {
  let sClassName = '';
  iTagType = parseInt(iTagType)
  if (iTagType === cConfig.mapTagType.fen1lei4) {
    if (!rJiao4Yan4.fEmptyStr(sFen1Lei4TagId) && sTagId === sFen1Lei4TagId) {
      sClassName = 'tag0arr0btn btn0lv4';
    } else {
      sClassName = 'tag0arr0btn btn0hong2';
    }
  }
  if (iTagType === cConfig.mapTagType.biao1ji4) {
    if (!rJiao4Yan4.fEmpty(sarrBiao1Ji4TagId) && sarrBiao1Ji4TagId.indexOf(sTagId) >= 0) {
      sClassName = 'tag0arr0btn btn0huang2';
    } else {
      sClassName = 'tag0arr0btn btn0zi3';
    }
  }
  return sClassName;
}

module.exports.fTagBtnClassGet = fTagBtnClassGet;

//校验图片是否可以移动
function fImageCanMove() {
  return !rJiao4Yan4.fEmptyStr(sFen1Lei4TagId) && sarrBiao1Ji4TagId.length > 0
}

module.exports.fImageCanMove = fImageCanMove;

//保存标记数据到文件
function fBiao1Ji4DataSave(sBiao1Ji4FilePath, sImageName, sFen1Lei4Path) {
  let toBiao1Ji4Data = {
    'image0name': sImageName,
    'image0file0path': sFen1Lei4Path + sImageName,
    'fen1lei4tag': sFen1Lei4TagId,
    'biao1ji4tag': sarrBiao1Ji4TagId,
  }
  arrBiao1Ji4Data.push(toBiao1Ji4Data);
  rFs.writeFileSync(sBiao1Ji4FilePath, JSON.stringify(arrBiao1Ji4Data), 'utf8');
}

module.exports.fBiao1Ji4DataSave = fBiao1Ji4DataSave;

//从文件中读取标记数据
function fBiao1Ji4DataLoad(sFilePath) {
  if (!rFs.existsSync(sFilePath)) {
    return;
  }
  let tjsonBiao1Ji4Data = rFs.readFileSync(sFilePath, 'utf8');
  arrBiao1Ji4Data = JSON.parse(tjsonBiao1Ji4Data);
}

module.exports.fBiao1Ji4DataLoad = fBiao1Ji4DataLoad;

//参数重置
function fBiao1Ji4DataClear() {
  sFen1Lei4TagId = '';
  sarrBiao1Ji4TagId = [];
}

module.exports.fBiao1Ji4DataClear = fBiao1Ji4DataClear;