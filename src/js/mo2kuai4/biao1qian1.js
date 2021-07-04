/*##标签模块##*/

const rFs = require('fs');

const rJiao4Yan4 = require('../fu3zhu4/jiao4yan4');
const rJi2He2 = require('../fu3zhu4/ji2he2');

const cConfig = {
  mapTagType: {
    fen1lei4: 1,
    biao1ji4: 2
  }
};

module.exports.cConfig = cConfig;

let mapTagData = {}; //标签数据
let arrImageTagData=[];

let sFen1Lei4TagId = '';
let arrBiao1Ji4TagId = [];

function fGetTagData() {
  return mapTagData;
}

module.exports.fGetTagData = fGetTagData;

function fAddTag(sTagId, sTagName, iTagType) {
  if (rJiao4Yan4.fEmpty(sTagId) || rJiao4Yan4.fEmpty(sTagName) || rJiao4Yan4.fEmptyNum(iTagType)) {
    alert('标签数据错误');
    return '';
  }
  sTagId = sTagId.toLowerCase();
  mapTagData[sTagId] = {
    tag0id: sTagId,
    tag0name: sTagName,
    tag0type: iTagType,
  }
  mapTagData = rJi2He2.fSortMapByKey(mapTagData);
  return mapTagData;
}

module.exports.fAddTag = fAddTag;

/**
 * @string sTagMu4Lu4 标签目录
 * @string sTagFilePath 标签文件路径
 */
function fSaveTagData(sTagMu4Lu4, sTagFilePath) {
  if (!rFs.existsSync(sTagMu4Lu4)) {
    rFs.mkdirSync(sTagMu4Lu4);
  }
  rFs.writeFileSync(sTagFilePath, JSON.stringify(mapTagData), 'utf8');
}

module.exports.fSaveTagData = fSaveTagData;

/**
 * @string sTagFilePath 标签文件路径
 */
function fLoadTagData(sTagFilePath) {
  if (!rFs.existsSync(sTagFilePath)) {
    return;
  }
  let tsTagData = rFs.readFileSync(sTagFilePath, 'utf8');
  mapTagData = JSON.parse(tsTagData);
  let arrKey = Object.keys(mapTagData);
  for (let tsKey of arrKey) {
    arrKey[tsKey] = mapTagData[tsKey].tag0name;
  }
}

module.exports.fLoadTagData = fLoadTagData;

function fSetSelectedTag(sTagId, iTagType) {
  iTagType = parseInt(iTagType);
  if (iTagType === cConfig.mapTagType.fen1lei4) {
    sFen1Lei4TagId = sTagId;
  } else if (iTagType === cConfig.mapTagType.biao1ji4) {
    arrBiao1Ji4TagId.push(sTagId);
  }
}

module.exports.fSetSelectedTag = fSetSelectedTag;

function fDelSelectedTag(sTagId, iTagType) {
  iTagType = parseInt(iTagType);
  if (iTagType === cConfig.mapTagType.fen1lei4) {
    sFen1Lei4TagId = '';
  } else if (iTagType === cConfig.mapTagType.biao1ji4) {
    let iIndex = arrBiao1Ji4TagId.indexOf(sTagId);
    if (iIndex >= 0) {
      arrBiao1Ji4TagId.splice(iIndex, 1);
    }
  }
}

module.exports.fDelSelectedTag = fDelSelectedTag;

function fGetSelectedTag() {
  return {
    sFen1Lei4TagId: sFen1Lei4TagId,
    arrBiao1Ji4TagId: arrBiao1Ji4TagId
  }
}

module.exports.fGetSelectedTag = fGetSelectedTag;

function fEncodeTagEleId(sTagId) {
  return 'tag0' + sTagId;
}

module.exports.fEncodeTagEleId = fEncodeTagEleId;

function fDecodeTagEleId(sTagId) {
  return sTagId.replace('tag0', '');
}

module.exports.fDecodeTagEleId = fDecodeTagEleId;

function fGetTagBtnClass(sTagId, iTagType) {
  let sClassName = '';
  iTagType = parseInt(iTagType)
  if (iTagType === cConfig.mapTagType.fen1lei4) {
    if (!rJiao4Yan4.fEmptyStr(sFen1Lei4TagId) && sTagId === sFen1Lei4TagId) {
      sClassName = 'btn0tag btn0lv4';
    } else {
      sClassName = 'btn0tag btn0hong2';
    }
  }
  if (iTagType === cConfig.mapTagType.biao1ji4) {
    if (!rJiao4Yan4.fEmpty(arrBiao1Ji4TagId) && arrBiao1Ji4TagId.indexOf(sTagId) >= 0) {
      sClassName = 'btn0tag btn0huang2';
    } else {
      sClassName = 'btn0tag btn0zi3';
    }
  }
  return sClassName;
}

module.exports.fGetTagBtnClass = fGetTagBtnClass;

function fCheckTagSelected(sTagId,iTagType){
  iTagType = parseInt(iTagType);
  if (iTagType === cConfig.mapTagType.fen1lei4) {
    return sTagId===sFen1Lei4TagId;
  } else if (iTagType === cConfig.mapTagType.biao1ji4) {
    return arrBiao1Ji4TagId.indexOf(sTagId)>=0
  }
}

module.exports.fCheckTagSelected = fCheckTagSelected;

function fCheckImageCanMove(){
  return !rJiao4Yan4.fEmptyStr(sFen1Lei4TagId) && arrBiao1Ji4TagId.length>0
}

module.exports.fCheckImageCanMove = fCheckImageCanMove;

function fSaveImageTagData(sBiao1Ji4FilePath,sNewName,sFen1Lei4Path){
  let sImageNewFilePath = sFen1Lei4Path + sNewName;
  let oData = {
    'image0name':sNewName,
    'image0file0path':sImageNewFilePath,
    'fen1lei4tag':sFen1Lei4TagId,
    'biao1ji4tag':arrBiao1Ji4TagId,
  }
  arrImageTagData.push(oData);
  rFs.writeFileSync(sBiao1Ji4FilePath, JSON.stringify(arrImageTagData), 'utf8');
}

module.exports.fSaveImageTagData = fSaveImageTagData;