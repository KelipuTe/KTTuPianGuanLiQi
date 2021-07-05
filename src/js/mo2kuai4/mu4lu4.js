/*##目录模块##*/

const rFs = require('fs');

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
    sBiao1Ji4: 'biao1ji4.json',
  }
};

let sMu4Lu4 = ''; //目录
let sWFLMu4Lu4 = ''; //未分类目录
let sTagMu4Lu4 = ''; //标签目录

//设置目录全路径
function fMu4Lu4Set(psMu4Lu4) {
  sMu4Lu4 = psMu4Lu4 + '\\';
  sWFLMu4Lu4 = sMu4Lu4 + cConfig.mapMu4Lu4.sWFL;
  sTagMu4Lu4 = sMu4Lu4 + cConfig.mapMu4Lu4.sBiao1Qian1;
}

module.exports.fMu4Lu4Set = fMu4Lu4Set;

//获取未分类目录全路径
function fWFLMu4Lu4Get() {
  return sWFLMu4Lu4;
}

module.exports.fWFLMu4Lu4Get = fWFLMu4Lu4Get;

//获取标签目录全路径
function fTagMu4Lu4Get() {
  return sTagMu4Lu4;
}

module.exports.fTagMu4Lu4Get = fTagMu4Lu4Get;

//获取分类标签文件全路径
function fTagFilePathGet() {
  return sTagMu4Lu4 + cConfig.mapFileName.sBiao1Qian1;
}

module.exports.fTagFilePathGet = fTagFilePathGet;

//获取标记数据文件全路径
function fBiao1Ji4FilePathGet(){
  return sTagMu4Lu4 + cConfig.mapFileName.sBiao1Ji4;
}

module.exports.fBiao1Ji4FilePathGet = fBiao1Ji4FilePathGet;

//获取分类标签目录全路径
function fFen1Lei4Mu4Lu4Get(sTagId){
  return sMu4Lu4 + sTagId + '\\';
}
module.exports.fFen1Lei4Mu4Lu4Get = fFen1Lei4Mu4Lu4Get;

//校验分类目录是否创建
function fFen1Lei4Mu4Lu4Check(sFen1Lei4Path) {
  if (!rFs.existsSync(sFen1Lei4Path)) {
    rFs.mkdirSync(sFen1Lei4Path);
  }
}

module.exports.fFen1Lei4Mu4Lu4Check = fFen1Lei4Mu4Lu4Check;