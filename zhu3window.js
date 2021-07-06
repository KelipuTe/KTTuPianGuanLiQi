//输出环境参数
console.log('Node:' + process.versions.node);
console.log('Chrome:' + process.versions.chrome);
console.log('Electron:' + process.versions.electron);

const rElectron = require('electron');
const rRemote = rElectron.remote;
const rMenu = rRemote.Menu;
const rDialog = rRemote.dialog;
const rIpcRenderer = rElectron.ipcRenderer;

const rJiao4Yan4 = require('./src/js/fu3zhu4/jiao4yan4');
const rMu4Lu4 = require('./src/js/mo2kuai4/mu4lu4');
const rBiao1Qian1 = require('./src/js/mo2kuai4/biao1qian1');
const rBiao1Ji4 = require('./src/js/mo2kuai4/biao1ji4');
const rTu2Pian4Arr = require('./src/js/mo2kuai4/tu2pian4arr');
const rTu2Pian4Item = require('./src/js/mo2kuai4/tu2pian4item');

//右击菜单
let oYou4Ji1Cai4Dan1 = rMenu.buildFromTemplate([
  {
    label: '打开调试窗口',
    accelerator: 'F12',
    click: function () {
      //给主进程发送消息
      rIpcRenderer.send('open0debug0window', '打开调试窗口');
    }
  }
]);
//监听右击事件
window.addEventListener('contextmenu', function (event) {
  //取消事件的默认动作
  event.preventDefault();
  //在目标窗口中弹出菜单
  oYou4Ji1Cai4Dan1.popup({window: rRemote.getCurrentWindow()});
}, false);

/*##dom对象##*/

let eMu4Lu4Select = {}; //选择目录界面
let eMu4Lu4SelectBtn = {}; //选择目录按钮

let eImageBiao1Ji4 = {}; //图片标记界面

let eTagQueryStr = {}; //标签查询输入
let eTagQueryBtn = {}; //标签查询按钮
let eTagQueryArr = {}; //标签查询列表

let eTagArr = {}; //标签列表
let eTagAddId = {}; //标签id输入
let eTagAddName = {}; //标签名称输入
let eTagAddBtn1 = {}; //添加分类标签按钮
let eTagAddBtn2 = {};//添加标记标签按钮

let eImageArr = {}; //图片列表
let eImageMoveBtn1 = {}; //移动并标记图片按钮
let eImageMoveBtn2 = {}; //更新图片列表按钮

let eImageShow = {}; //图片展示
let eImageMovePath = {}; //移动图片的全路径

/*####dom对象####*/

window.onload = function () {
  eMu4Lu4Select = document.getElementById('ml0select');
  eMu4Lu4Select.style.display = 'block';
  eMu4Lu4SelectBtn = document.getElementById('ml0select0btn');
  eMu4Lu4SelectBtn.onclick = fcMu4Lu4Select;

  eImageBiao1Ji4 = document.getElementById('image0biao1ji4');
  eImageBiao1Ji4.style.display = 'none';

  eTagQueryStr = document.getElementById('tag0query0str');
  eTagQueryBtn = document.getElementById('tag0query0btn');
  eTagQueryBtn.onclick = fcTagQuery;
  eTagQueryArr = document.getElementById('tag0query0arr');
  eTagQueryArr.style.display = 'none';

  eTagArr = document.getElementById('tag0arr');
  eTagAddId = document.getElementById('tag0add0id');
  eTagAddName = document.getElementById('tag0add0name');
  eTagAddBtn1 = document.getElementById('tag0add0btn1');
  eTagAddBtn1.onclick = fcTagAddBtn1;
  eTagAddBtn2 = document.getElementById('tag0add0btn2');
  eTagAddBtn2.onclick = fcTagAddBtn2;

  eImageArr = document.getElementById('image0arr');
  eImageMoveBtn1 = document.getElementById('image0move0btn');
  eImageMoveBtn1.onclick = fcImageMoveAndTag;
  eImageMoveBtn1.disabled = true;
  eImageMoveBtn2 = document.getElementById('image0pull0btn');
  eImageMoveBtn2.disabled = true;

  eImageShow = document.getElementById('image0show');
  eImageShow.onload = fImageOnLoad;
  eImageMovePath = document.getElementById('image0move0path');
}

//选择目录
function fcMu4Lu4Select() {
  rDialog.showOpenDialog({
    'title': '请选择目录',
    'properties': ['openDirectory']
  }).then(function (result) {
    if (!rJiao4Yan4.fEmptyStr(result.filePaths[0])) {
      eMu4Lu4Select.style.display = 'none';
      eImageBiao1Ji4.style.display = 'block';
      rMu4Lu4.fMu4Lu4Set(result.filePaths[0]);
      rBiao1Qian1.fTagDataLoad(rMu4Lu4.fTagFilePathGet());
      rBiao1Ji4.fBiao1Ji4DataLoad(rMu4Lu4.fBiao1Ji4FilePathGet());
      fDrawTagArr(rBiao1Qian1.fTagDataGet());
      rTu2Pian4Arr.fImageLoad(rMu4Lu4.fWFLMu4Lu4Get());
      fDrawImageArr(rTu2Pian4Arr.fOArrImageGet());
    }
  });
}

//查询标签
function fcTagQuery() {
  let tMapTagData = rBiao1Qian1.fTagQuery(eTagQueryStr.value);
  if (!rJiao4Yan4.fEmptyObj(tMapTagData)) {
    fDrawQueryTagArr(tMapTagData);
    eTagQueryArr.style.display = 'block';
  } else {
    eTagQueryArr.innerHTML = '';
    eTagQueryArr.style.display = 'none';
  }
}

//渲染查询标签列表
function fDrawQueryTagArr(mapTagData) {
  eTagQueryArr.innerHTML = '';
  let arrTagId = Object.keys(mapTagData);
  for (let tsTagId of arrTagId) {
    let iTagType = mapTagData[tsTagId].tag0type;
    let tEle = document.createElement('button');
    tEle.id = rBiao1Qian1.fTagQueryEleIdEncode(tsTagId);
    tEle.type = 'button';
    tEle.innerHTML = mapTagData[tsTagId].tag0name;
    tEle.className = rBiao1Ji4.fTagBtnClassGet(tsTagId, iTagType);
    tEle.setAttribute('data0tag0type', iTagType);
    tEle.onclick = fcTagQueryBtn;
    eTagQueryArr.appendChild(tEle);
  }
}

//点击查询标签
function fcTagQueryBtn() {
  let sTagId = rBiao1Qian1.fTagQueryEleIdDecode(this.id);
  let sTagType = this.getAttribute('data0tag0type');
  if (rBiao1Ji4.fSelectedTagIsSet(sTagId, sTagType)) {
    rBiao1Ji4.fSelectedTagDel(sTagId, sTagType);
  } else {
    rBiao1Ji4.fSelectedTagSet(sTagId, sTagType);
  }
  this.className = rBiao1Ji4.fTagBtnClassGet(sTagId, sTagType);
  let tEleArr = eTagArr.children;
  //标签列表也要变
  console.log(this.id);
  console.log(sTagId);
  for (let ii = 0; ii < tEleArr.length; ++ii) {
    let tsTagId = rBiao1Qian1.fTagEleIdDecode(tEleArr[ii].id);
    console.log(tsTagId);
    if (tsTagId === sTagId) {
      let tsTagType = this.getAttribute('data0tag0type');
      tEleArr[ii].className = rBiao1Ji4.fTagBtnClassGet(tsTagId, tsTagType);
    }
  }
  fImageRename();
}

function fcTagAddBtn1() {
  fcTagAddBtn(rBiao1Ji4.cConfig.mapTagType.fen1lei4);
}

function fcTagAddBtn2() {
  fcTagAddBtn(rBiao1Ji4.cConfig.mapTagType.biao1ji4);
}

//添加标签
function fcTagAddBtn(iTagType) {
  let sTagId = eTagAddId.value;
  let sTagName = eTagAddName.value;
  rBiao1Qian1.fAddTag(sTagId, sTagName, iTagType);
  rBiao1Qian1.fSaveTagData(rMu4Lu4.fTagMu4Lu4Get(), rMu4Lu4.fTagFilePathGet());
  fDrawTagArr(rBiao1Qian1.fTagDataGet());
}

//渲染标签列表
function fDrawTagArr(mapTagData) {
  eTagArr.innerHTML = '';
  let arrTagId = Object.keys(mapTagData);
  for (let tsTagId of arrTagId) {
    let iTagType = mapTagData[tsTagId].tag0type;
    let tEle = document.createElement('button');
    tEle.id = rBiao1Qian1.fTagEleIdEncode(tsTagId);
    tEle.type = 'button';
    tEle.innerHTML = mapTagData[tsTagId].tag0name;
    tEle.className = rBiao1Ji4.fTagBtnClassGet(tsTagId, iTagType);
    tEle.setAttribute('data0tag0type', iTagType);
    tEle.onclick = fcTagBtn;
    eTagArr.appendChild(tEle);
  }
}

//点击标签
function fcTagBtn() {
  let sTagId = rBiao1Qian1.fTagEleIdDecode(this.id);
  let sTagType = this.getAttribute('data0tag0type');
  if (rBiao1Ji4.fSelectedTagIsSet(sTagId, sTagType)) {
    rBiao1Ji4.fSelectedTagDel(sTagId, sTagType);
  } else {
    rBiao1Ji4.fSelectedTagSet(sTagId, sTagType);
  }
  this.className = rBiao1Ji4.fTagBtnClassGet(sTagId, sTagType);
  fImageRename();
}

//渲染图片列表
function fDrawImageArr(oarrImage) {
  eImageArr.innerHTML = '';
  let ii = 1;
  for (let iImageItem of oarrImage) {
    let tEle = document.createElement('img');
    tEle.id = 'image0arr0i' + ii;
    tEle.className = 'image0item';
    tEle.setAttribute('data-image0name', iImageItem.image0name);
    tEle.src = iImageItem.image0file0path;
    tEle.onclick = fcImageItem;
    eImageArr.appendChild(tEle);
    ++ii;
  }
}

//点击，选择图片
function fcImageItem() {
  let sImageName = this.getAttribute('data-image0name');
  rTu2Pian4Item.fImageNameSet(sImageName);
  let sImageFilePath = rMu4Lu4.fWFLMu4Lu4Get() + sImageName;
  rTu2Pian4Item.fImageFilePathSet(sImageFilePath);
  eImageShow.src = sImageFilePath;
  fImageRename();
}

//eImageShow的onload事件
function fImageOnLoad() {
  //naturalWidth和naturalHeight参数可以获得图片的原始宽高
  rTu2Pian4Item.fImageKuanGaoSet(this.naturalWidth, this.naturalHeight);
  let oResData = rTu2Pian4Item.fImageMoveCenter();
  let sStyle = 'margin-top: ' + oResData.iImageMarginTop + 'px;' + 'margin-left: ' + oResData.iImageMarginLeft + 'px;';
  eImageShow.setAttribute('style', sStyle);
}

//图片重命名
function fImageRename() {
  let bImageCanMove = rBiao1Ji4.fImageCanMove();
  eImageMoveBtn1.disabled = !bImageCanMove;
  eImageMoveBtn2.disabled = !bImageCanMove;
  if (bImageCanMove) {
    let sFen1Lei4Path = rMu4Lu4.fFen1Lei4Mu4Lu4Get(rBiao1Ji4.fSelectedTagGet(rBiao1Ji4.cConfig.mapTagType.fen1lei4));
    rTu2Pian4Item.fImageRename(rBiao1Ji4.fSelectedTagGet(rBiao1Ji4.cConfig.mapTagType.biao1ji4))
    let sImageNewFilePath = sFen1Lei4Path + rTu2Pian4Item.fNewNameGet();
    rTu2Pian4Item.fImageNewFilePathSet(sImageNewFilePath);
    eImageMovePath.value = sImageNewFilePath;
  }
}

//图片移动
function fcImageMoveAndTag() {
  let sFen1Lei4Path = rMu4Lu4.fFen1Lei4Mu4Lu4Get(rBiao1Ji4.fSelectedTagGet(rBiao1Ji4.cConfig.mapTagType.fen1lei4));
  rMu4Lu4.fFen1Lei4Mu4Lu4Check(sFen1Lei4Path);
  rBiao1Ji4.fBiao1Ji4DataSave(rMu4Lu4.fBiao1Ji4FilePathGet(), rTu2Pian4Item.fNewNameGet(), sFen1Lei4Path)
  rTu2Pian4Item.fImageMove();
  rTu2Pian4Arr.fImageItemDel(rTu2Pian4Item.fImageNameGet());
  rBiao1Ji4.fBiao1Ji4DataClear();
  rTu2Pian4Item.fImageItemDataClear();
  eImageMoveBtn1.disabled = true;
  eImageMoveBtn2.disabled = true;
  eImageShow.src = '';
  fDrawTagArr(rBiao1Qian1.fTagDataGet());
  if (rTu2Pian4Arr.fIArrImageLenGet() < 1) {
    rTu2Pian4Arr.fImageLoad(rMu4Lu4.fWFLMu4Lu4Get());
  }
  fDrawImageArr(rTu2Pian4Arr.fOArrImageGet());
}
