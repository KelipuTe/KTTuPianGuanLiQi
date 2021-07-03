/*##标签模块##*/

const rFs = require('fs');

const rJiao4Yan4 = require('../fu3zhu4/jiao4yan4');
const rPai2Xu4 = require('../fu3zhu4/pai2xu4');

const cConfig = {
  mapTagType: {
    fen1lei4: 1,
    biao1ji4: 2
  }
};

module.exports.cConfig = cConfig;

let mapTagData = {}; //标签数据
let sFen1Lei4TagId = '';
let arrBiao1Ji4TagId = [];

function setSelectedTag(sTagId, iTagType) {
  if (iTagType === cConfig.mapTagType.fen1lei4) {

  } else if (iTagType === cConfig.mapTagType.biao1ji4) {

  }
}

module.exports.setSelectedTag = setSelectedTag;

function getSelectedTag() {
  return {
    sFen1Lei4TagId: sFen1Lei4TagId,
    arrBiao1Ji4TagId: arrBiao1Ji4TagId
  }
}

module.exports.getSelectedTag = getSelectedTag;

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
  mapTagData = rPai2Xu4.fSortMapByKey(mapTagData);
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

function fEncodeTagEleId(sTagId) {
  return 'tag0' + sTagId;
}

module.exports.fEncodeTagEleId = fEncodeTagEleId;

function fDecodeTagEleId(sTagId) {
  return sTagId.replace('tag0', '');
}

module.exports.fDecodeTagEleId = fDecodeTagEleId;

