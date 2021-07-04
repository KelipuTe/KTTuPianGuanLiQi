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
const rTu2Pian4 = require('./src/js/mo2kuai4/tu2pian4');
const rBiao1Qian1 = require('./src/js/mo2kuai4/biao1qian1');

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

let eMu4Lu4Select = {};
let eMu4Lu4SelectBtn = {}; //选择目录按钮

let eImageCao1Zuo4 = {};

let eTagSwitchBtn = {}; //切换按钮
let eImageQuery = {}; //图片检索
let eTagArr1 = {};

let eImageTag = {}; //图片标记
let eTagArr2 = {};
let eTagAddId = {};
let eTagAddName = {};
let eTagAddBtn1 = {}; //添加分类标签按钮
let eTagAddBtn2 = {};//添加标记标签按钮

let eImageArr = {}; //图片列表
let eImageMoveBtn1 = {}; //
let eImageMoveBtn2 = {}; //

let eImageShow = {}; //图片展示
let eImageMovePath = {}; //图片

/*####dom对象####*/

window.onload = function () {
  eMu4Lu4Select = document.getElementById('ml0select');
  eMu4Lu4SelectBtn = document.getElementById('ml0select0btn');
  eMu4Lu4SelectBtn.onclick = fcMLSelect;

  eImageCao1Zuo4 = document.getElementById('image0cao1zuo4');

  eTagSwitchBtn = document.getElementById('tag0switch0btn');
  eTagSwitchBtn.onclick = fcTagSwitch;

  eImageQuery = document.getElementById('image0query');

  eImageTag = document.getElementById('image0tag');
  eTagArr2 = document.getElementById('tag0arr2');
  eTagAddId = document.getElementById('tag0add0id');
  eTagAddName = document.getElementById('tag0add0name');
  eTagAddBtn1 = document.getElementById('tag0add0btn1');
  eTagAddBtn1.onclick = fcTagAddBtn1;
  eTagAddBtn2 = document.getElementById('tag0add0btn2');
  eTagAddBtn2.onclick = fcTagAddBtn2;

  eImageArr = document.getElementById('image0arr');
  eImageMoveBtn1 = document.getElementById('image0move0btn1');
  eImageMoveBtn1.onclick = fcImageMoveAndTag;
  eImageMoveBtn1.disabled = true;
  eImageMoveBtn2 = document.getElementById('image0move0btn2');
  eImageMoveBtn2.disabled = true;

  eImageShow = document.getElementById('image0show');
  eImageShow.onload = fImageOnLoad;
  eImageMovePath = document.getElementById('image0move0path');
}

//选择目录
function fcMLSelect() {
  rDialog.showOpenDialog({
    'title': '请选择操作目录',
    'properties': ['openDirectory']
  }).then(function (result) {
    if (!rJiao4Yan4.fEmptyStr(result.filePaths[0])) {
      eMu4Lu4Select.style.display = 'none';
      eImageCao1Zuo4.style.display = 'block';
      rMu4Lu4.fSetMu4Lu4(result.filePaths[0]);
      rBiao1Qian1.fLoadTagData(rMu4Lu4.fGetTagFilePath());
      fDrawTagArr(eTagArr2, rBiao1Qian1.fGetTagData());
      let sWFLMu4Lu4 = rMu4Lu4.fGetWFLMu4Lu4();
      rTu2Pian4.fLoadImage(sWFLMu4Lu4);
      fDrawImageArr(sWFLMu4Lu4, rTu2Pian4.fGetSArrImageName());
    }
  });
}

//切换图片检索图片标记
function fcTagSwitch() {
  if (eImageQuery.style.display === 'none') {
    eImageTag.style.display = 'none';
    eImageQuery.style.display = 'block';
    eTagSwitchBtn.innerHTML = '切换为图片标记';
  } else if (eImageTag.style.display === 'none') {
    eImageQuery.style.display = 'none';
    eImageTag.style.display = 'block';
    eTagSwitchBtn.innerHTML = '切换为图片检索';
  }
}

function fcTagAddBtn1() {
  fcTagAddBtn(rBiao1Qian1.cConfig.mapTagType.fen1lei4);
}

function fcTagAddBtn2() {
  fcTagAddBtn(rBiao1Qian1.cConfig.mapTagType.biao1ji4);
}

function fcTagAddBtn(iTagType) {
  let sTagId = eTagAddId.value;
  let sTagName = eTagAddName.value;
  rBiao1Qian1.fAddTag(sTagId, sTagName, iTagType);
  rBiao1Qian1.fSaveTagData(rMu4Lu4.fGetTagMu4Lu4(), rMu4Lu4.fGetTagFilePath());
  let mapTagData = rBiao1Qian1.fGetTagData();
  fDrawTagArr(eTagArr2, mapTagData);
}

/**
 * 渲染标签列表
 * @param eTagArr
 * @param mapTagData
 */
function fDrawTagArr(eTagArr, mapTagData) {
  eTagArr.innerHTML = '';
  let arrTagId = Object.keys(mapTagData);
  for (let tsTagId of arrTagId) {
    let iTagType = mapTagData[tsTagId].tag0type;
    let tEle = document.createElement('button');
    tEle.id = rBiao1Qian1.fEncodeTagEleId(tsTagId);
    tEle.type = 'button';
    tEle.innerHTML = mapTagData[tsTagId].tag0name;
    tEle.className = rBiao1Qian1.fGetTagBtnClass(tsTagId, iTagType);
    tEle.setAttribute('data0tag0type', iTagType);
    tEle.onclick = fcBiao1Qian1;
    eTagArr.appendChild(tEle);
  }
}

function fcBiao1Qian1() {
  let sTagId = rBiao1Qian1.fDecodeTagEleId(this.id);
  let sTagType = this.getAttribute('data0tag0type');
  if (rBiao1Qian1.fCheckTagSelected(sTagId, sTagType)) {
    rBiao1Qian1.fDelSelectedTag(sTagId, sTagType);
  } else {
    rBiao1Qian1.fSetSelectedTag(sTagId, sTagType);
  }
  this.className = rBiao1Qian1.fGetTagBtnClass(sTagId, sTagType);
}

/**
 * 渲染图片列表
 * @string sWFLMu4Lu4
 * @string sarrImageName
 */
function fDrawImageArr(sWFLMu4Lu4, sarrImageName) {
  eImageArr.innerHTML = '';
  let ii = 1;
  for (let sImageName of sarrImageName) {
    let tempEle = document.createElement('img');
    tempEle.id = 'image0arr0i' + ii;
    tempEle.className = 'image0item';
    tempEle.setAttribute('data-image0name', sImageName);
    tempEle.src = sWFLMu4Lu4 + sImageName;
    tempEle.onclick = fcImageItem;
    eImageArr.appendChild(tempEle);
    ++ii;
  }
}

//点击，选择图片
function fcImageItem() {
  let sImageName = this.getAttribute('data-image0name');
  rTu2Pian4.fSetImageName(sImageName);
  let sImageFilePath = rMu4Lu4.fGetWFLMu4Lu4() + sImageName;
  rTu2Pian4.fSetImageFilePath(sImageFilePath);
  eImageShow.src = sImageFilePath;
  fImageRename();
}

//eImageShow的onload事件
function fImageOnLoad() {
  //获取图片原始宽高
  let iImageKuan = this.naturalWidth;
  let iImageGao = this.naturalHeight;
  rTu2Pian4.fSetImageKuanGao(iImageKuan, iImageGao);
  let oResData = rTu2Pian4.fImageCenter(iImageKuan, iImageGao);
  let sStyle = 'margin-top: ' + oResData.iImageMarginTop + 'px;' + 'margin-left: ' + oResData.iImageMarginLeft + 'px;';
  eImageShow.setAttribute('style', sStyle);
}

//图片重命名
function fImageRename() {
  let bImageCanMove = rBiao1Qian1.fCheckImageCanMove();
  eImageMoveBtn1.disabled = !bImageCanMove;
  eImageMoveBtn2.disabled = !bImageCanMove;
  if (bImageCanMove) {
    let oSelectedTag = rBiao1Qian1.fGetSelectedTag();
    let sFen1Lei4Path = rMu4Lu4.fMakeFen1Lei4Mu4Lu4(oSelectedTag.sFen1Lei4TagId);
    rMu4Lu4.fCheckFen1Lei4Mu4Lu4(sFen1Lei4Path);
    rTu2Pian4.fGetRename(oSelectedTag.arrBiao1Ji4TagId[0])
    let sNewName = rTu2Pian4.fGetNewName();
    let sImageNewFilePath = sFen1Lei4Path + sNewName;
    rTu2Pian4.setImageNewFilePath(sImageNewFilePath);
    eImageMovePath.value = sImageNewFilePath;
  }
}

//点击，图片移动
function fcImageMoveAndTag() {
  let oSelectedTag = rBiao1Qian1.fGetSelectedTag();
  let sFen1Lei4Path = rMu4Lu4.fMakeFen1Lei4Mu4Lu4(oSelectedTag.sFen1Lei4TagId);
  rMu4Lu4.fCheckFen1Lei4Mu4Lu4(sFen1Lei4Path);
  let sNewName = rTu2Pian4.fGetNewName();
  let sBiao1Ji4FilePath = rMu4Lu4.fGetBiao1Ji4FilePath();
  rBiao1Qian1.fSaveImageTagData(sBiao1Ji4FilePath,sNewName,sFen1Lei4Path)
  rTu2Pian4.fImageMove();
  rTu2Pian4.fClearImageItemData();
  eImageMoveBtn1.disabled = true;
  eImageMoveBtn2.disabled = true;
  eImageShow.src = '';
  let sWFLMu4Lu4 = rMu4Lu4.fGetWFLMu4Lu4();
  let sarrImageName = rTu2Pian4.fGetSArrImageName();
  if (sarrImageName.length < 1) {
    rTu2Pian4.fLoadImage(sWFLMu4Lu4);
  }
  fDrawImageArr(sWFLMu4Lu4, rTu2Pian4.fGetSArrImageName());
}
