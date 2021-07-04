/*##目录模块##*/

const rFs = require('fs');

const rJiao4Yan4 = require('../fu3zhu4/jiao4yan4');

//mapMu4Lu4.sWFL--未分类目录
//mapMu4Lu4.sBiao1Qian1--标签目录
//mapFileName.sFen1Lei4Tag--分类标签文件名
//mapFileName.sBiao1Ji4Tag--标记标签文件名
const cConfig = {
  mapMu4Lu4: {
    sWFL: 'wei4fen1lei4\\',
    sBiao1Qian1: 'biao1qian1\\',
  },
  mapFileName: {
    sBiao1Qian1: 'biao1qian1.json',
    sBiao1ji4: 'biao1ji4.json',
  }
};

let sMu4Lu4 = ''; //目录
let sWFLMu4Lu4 = ''; //未分类目录
let sTagMu4Lu4 = ''; //标签目录

/**
 * @string psMu4Lu4 目录
 */
function fSetMu4Lu4(psMu4Lu4) {
  sMu4Lu4 = psMu4Lu4 + '\\';
  sWFLMu4Lu4 = sMu4Lu4 + cConfig.mapMu4Lu4.sWFL;
  sTagMu4Lu4 = sMu4Lu4 + cConfig.mapMu4Lu4.sBiao1Qian1;
}

module.exports.fSetMu4Lu4 = fSetMu4Lu4;

//检查目录是否设置
function fIsSetMu4Lu4() {
  return rJiao4Yan4.fEmptyStr(sMu4Lu4);
}

module.exports.fIsSetMu4Lu4 = fIsSetMu4Lu4;

//获取未分类目录
function fGetWFLMu4Lu4() {
  return sWFLMu4Lu4;
}

module.exports.fGetWFLMu4Lu4 = fGetWFLMu4Lu4;

//获取标签目录
function fGetTagMu4Lu4() {
  return sTagMu4Lu4;
}

module.exports.fGetTagMu4Lu4 = fGetTagMu4Lu4;

//获取分类标签文件路径
function fGetTagFilePath() {
  return sTagMu4Lu4 + cConfig.mapFileName.sBiao1Qian1;
}

module.exports.fGetTagFilePath = fGetTagFilePath;

function fMakeFen1Lei4Mu4Lu4(sFen1Lei4TagId){
  return sMu4Lu4 + sFen1Lei4TagId + '\\';
}

module.exports.fMakeFen1Lei4Mu4Lu4 = fMakeFen1Lei4Mu4Lu4;

function fCheckFen1Lei4Mu4Lu4(sFen1Lei4Path) {
  if (!rFs.existsSync(sFen1Lei4Path)) {
    rFs.mkdirSync(sFen1Lei4Path);
  }
}

module.exports.fCheckFen1Lei4Mu4Lu4 = fCheckFen1Lei4Mu4Lu4;

function fGetBiao1Ji4FilePath(){
  return sTagMu4Lu4 + cConfig.mapFileName.sBiao1ji4;
}

module.exports.fGetBiao1Ji4FilePath = fGetBiao1Ji4FilePath;