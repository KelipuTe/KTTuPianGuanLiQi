/*##标签模块##*/

const rFs = require('fs');

const rJiao4Yan4 = require('../fu3zhu4/jiao4yan4');
const rJi2He2 = require('../fu3zhu4/ji2he2');

let mapTagData = {}; //标签数据

//获取标签数据
function fTagDataGet() {
  return mapTagData;
}

module.exports.fTagDataGet = fTagDataGet;

//添加标签
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

//保存标签数据到文件
function fSaveTagData(sTagMu4Lu4, sTagFilePath) {
  if (!rFs.existsSync(sTagMu4Lu4)) {
    rFs.mkdirSync(sTagMu4Lu4);
  }
  rFs.writeFileSync(sTagFilePath, JSON.stringify(mapTagData), 'utf8');
}

module.exports.fSaveTagData = fSaveTagData;

//从文件中读取标签数据
function fTagDataLoad(sFilePath) {
  if (!rFs.existsSync(sFilePath)) {
    return;
  }
  let tjsonTagData = rFs.readFileSync(sFilePath, 'utf8');
  mapTagData = JSON.parse(tjsonTagData);
}

module.exports.fTagDataLoad = fTagDataLoad;

//格式化标签按钮的id
function fTagEleIdEncode(sTagId) {
  return 'tag0' + sTagId;
}

module.exports.fTagEleIdEncode = fTagEleIdEncode;

//逆格式化标签按钮的id
function fTagEleIdDecode(sTagId) {
  return sTagId.replace('tag0', '');
}

module.exports.fTagEleIdDecode = fTagEleIdDecode;

//查询标签
function fTagQuery(sTagStr) {
  let tMapTagData = {};
  if (rJiao4Yan4.fEmptyStr(sTagStr)) {
    return tMapTagData;
  }
  let arrKey = Object.keys(mapTagData);
  for (let tsKey of arrKey) {
    if (tsKey.search(sTagStr) >= 0 || mapTagData[tsKey].tag0name.search(sTagStr) >= 0) {
      tMapTagData[tsKey] = mapTagData[tsKey];
    }
  }
  return tMapTagData;
}

module.exports.fTagQuery = fTagQuery;

//格式化标签按钮的id
function fTagQueryEleIdEncode(sTagId) {
  return 'tag0query0' + sTagId;
}

module.exports.fTagQueryEleIdEncode = fTagQueryEleIdEncode;

//逆格式化标签按钮的id
function fTagQueryEleIdDecode(sTagId) {
  return sTagId.replace('tag0query0', '');
}

module.exports.fTagQueryEleIdDecode = fTagQueryEleIdDecode;