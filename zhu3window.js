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

let eMLSelect = {};
let eMLSelectBtn = {}; //选择目录按钮

let eTPCao1Zuo4 = {};

let eTagSwitchBtn = {}; //切换按钮
let eTPSelect = {}; //图片检索
let eTagArr1 = {};

let eTPTag = {}; //图片标记
let eTagArr2 = {};
let eTagAddId = {};
let eTagAddName = {};
let eTagAddBtn1 = {}; //添加分类标签按钮
let eTagAddBtn2 = {};//添加标记标签按钮

let eTPArr = {}; //图片列表

let eTPShow = {}; //图片展示

/*####dom对象####*/

window.onload = function () {
  eMLSelect = document.getElementById('ml0select');
  eMLSelectBtn = document.getElementById('ml0select0btn');
  eMLSelectBtn.onclick = fcMLSelect;

  eTPCao1Zuo4 = document.getElementById('tp0cao1zuo4');

  eTagSwitchBtn = document.getElementById('tag0switch0btn');
  eTagSwitchBtn.onclick = fcTagSwitch;

  eTPSelect = document.getElementById('tp0select');

  eTPTag = document.getElementById('tp0tag');
  eTagArr2 = document.getElementById('tag0arr2');
  eTagAddId = document.getElementById('tag0add0id');
  eTagAddName = document.getElementById('tag0add0name');
  eTagAddBtn1 = document.getElementById('tag0add0btn1');
  eTagAddBtn1.onclick = fcTagAddBtn1;
  eTagAddBtn2 = document.getElementById('tag0add0btn2');
  eTagAddBtn2.onclick = fcTagAddBtn2;

  eTPArr = document.getElementById('tp0arr');
  eTPShow = document.getElementById('tp0show');
  eTPShow.onload = fTPOnLoad;
}

//选择目录
function fcMLSelect() {
  rDialog.showOpenDialog({
    'title': '请选择操作目录',
    'properties': ['openDirectory']
  }).then(function (result) {
    if (!rJiao4Yan4.fEmptyStr(result.filePaths[0])) {
      eMLSelect.style.display = 'none';
      eTPCao1Zuo4.style.display = 'block';
      rMu4Lu4.fSetMu4Lu4(result.filePaths[0]);
      let sWFLMu4Lu4 = rMu4Lu4.fGetWFLMu4Lu4();
      let sarrTPName = rTu2Pian4.fLoadTP(sWFLMu4Lu4);
      fLoadTPArr(sWFLMu4Lu4, sarrTPName);
    }
  });
}

//切换图片检索图片标记
function fcTagSwitch() {
  if (eTPSelect.style.display === 'none') {
    eTPTag.style.display = 'none';
    eTPSelect.style.display = 'block';
    eTagSwitchBtn.innerHTML = '切换为图片标记';
  } else if (eTPTag.style.display === 'none') {
    eTPSelect.style.display = 'none';
    eTPTag.style.display = 'block';
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
  let oTagData = rBiao1Qian1.fAddTag(sTagId, sTagName, iTagType);
  rBiao1Qian1.fSaveTagData(rMu4Lu4.fGetTagMu4Lu4(),rMu4Lu4.fGetTagFilePath());
  fDrawTagArr(eTagArr2,oTagData);
}

/**
 * 渲染标签列表
 * @param eTagArr
 * @param oTagData
 */
function fDrawTagArr(eTagArr, oTagData) {
  eTagArr.innerHTML = '';
  let arrKey = Object.keys(oTagData);
  for (let tsKey of arrKey) {
    let tempEle = document.createElement('button');
    tempEle.id = rBiao1Qian1.fEncodeTagEleId(tsKey);
    tempEle.type = 'button';
    tempEle.innerHTML = oTagData[tsKey].tag0name;
    tempEle.className = 'bq0bq0btn btn0shh';
    tempEle.setAttribute('data0tag0type', oTagData[tsKey].tag0type);
    tempEle.onclick = fcBiao1Qian1;
    eTagArr.appendChild(tempEle);
  }
}

function fcBiao1Qian1(){
  let sTagId = rBiao1Qian1.fDecodeTagEleId(this.id);
  let sTagType= this.getAttribute('data0tag0type');
}

/**
 * 渲染图片列表
 * @string sWFLML
 * @string sarrTPName
 */
function fLoadTPArr(sWFLMu4Lu4, sarrTPName) {
  eTPArr.innerHTML = '';
  let ii = 1;
  for (let sTPName of sarrTPName) {
    let tempEle = document.createElement('img');
    tempEle.id = 'tp0arr0i' + ii;
    tempEle.className = 'tp0item';
    tempEle.setAttribute('data-tp0name', sTPName);
    tempEle.src = sWFLMu4Lu4 + sTPName;
    tempEle.onclick = fcTPItem;
    eTPArr.appendChild(tempEle);
    ++ii;
  }
}

//点击，选择图片
function fcTPItem() {
  let sTPName = this.getAttribute('data-tp0name');
  rTu2Pian4.fSetTPName(sTPName);
  let sTPLJ = rMu4Lu4.fGetWFLMu4Lu4() + sTPName;
  rTu2Pian4.fSetTPLJ(sTPLJ);
  eTPShow.src = sTPLJ;
}

//eTPShow的onload事件
function fTPOnLoad() {
  //获取图片原始宽高
  let iTPKuan = this.naturalWidth;
  let iTPGao = this.naturalHeight;
  rTu2Pian4.fSetTPKuanGao(iTPKuan, iTPGao);
  let oRes = rTu2Pian4.fTPCenter(iTPKuan, iTPGao);
  let sStyle = 'margin-top: ' + oRes.iTPMarginTop + 'px;' +
    'margin-left: ' + oRes.iTPMarginLeft + 'px;';
  eTPShow.setAttribute('style', sStyle);
}

//
// //图片重命名
// function fTPRename() {
//     let sBQMuLu = rMu4Lu4.fGetFen1Lei4BQML(rBiao1Qian1.fGetBQBSSelect(), rBiao1Qian1.fGetAllBQSelectId());
//     let sBQId = rBiao1Qian1.fGetBQSelectId(rBiao1Qian1.fGetBQBSSelect());
//     let sTPRename = rTu2Pian4.fGetRename();
//     eTPMoveLJ.value = sBQMuLu + sBQId + sTPRename;
//     eTPMove.disabled = false;
// }
//
// //点击，分类标签
// function fcFen1Lei4BQ() {
//     let iBQBSSelect = parseInt(this.getAttribute('data-bqbs'));
//     let sBQKey = rHelper.fDecodeBQEleId(iBQBSSelect, this.id);
//     if (iBQBSSelect === rBiao1Qian1.cConfig.iBQBS1) {
//         //一级标签
//         if (rBiao1Qian1.fGetBQSelectId(iBQBSSelect) === sBQKey) {
//             //如果已选中的就是这个标签
//             //清空数据
//             rBiao1Qian1.fCleanBQSelectId(iBQBSSelect);
//             eBQArr2.innerHTML = '';
//             eBQArr3.innerHTML = '';
//             fRedrawFen1Lei4BQ(iBQBSSelect);
//         } else {
//             //如果已选中的是其他标签
//             //清空数据，然后加载对应标签的数据
//             rBiao1Qian1.fCleanBQSelectId(iBQBSSelect);
//             eBQArr2.innerHTML = '';
//             eBQArr3.innerHTML = '';
//
//             eNewBQId.value = sBQKey;
//             eNewBQName.value = rBiao1Qian1.fSetBQSelectId(iBQBSSelect, sBQKey);
//             fMakeBQArr(rBiao1Qian1.cConfig.iBQBS2, eBQArr2, rBiao1Qian1.fGetWaitBQ(rBiao1Qian1.cConfig.iBQBS2));
//             fRedrawFen1Lei4BQ(iBQBSSelect, this.id);
//         }
//     } else if (iBQBSSelect === rBiao1Qian1.cConfig.iBQBS2) {
//         //二级标签
//         if (rBiao1Qian1.fGetBQSelectId(iBQBSSelect) === sBQKey) {
//             rBiao1Qian1.fCleanBQSelectId(iBQBSSelect);
//             eBQArr3.innerHTML = '';
//             fRedrawFen1Lei4BQ(iBQBSSelect);
//         } else {
//             rBiao1Qian1.fCleanBQSelectId(iBQBSSelect);
//             eBQArr3.innerHTML = '';
//
//             eNewBQId.value = sBQKey;
//             eNewBQName.value = rBiao1Qian1.fSetBQSelectId(iBQBSSelect, sBQKey)
//             fMakeBQArr(rBiao1Qian1.cConfig.iBQBS3, eBQArr3, rBiao1Qian1.fGetWaitBQ(rBiao1Qian1.cConfig.iBQBS3));
//             fRedrawFen1Lei4BQ(iBQBSSelect, this.id);
//         }
//     } else if (iBQBSSelect === rBiao1Qian1.cConfig.iBQBS3) {
//         //三级标签
//         if (rBiao1Qian1.fGetBQSelectId(iBQBSSelect) === sBQKey) {
//             rBiao1Qian1.fCleanBQSelectId(iBQBSSelect);
//             fRedrawFen1Lei4BQ(iBQBSSelect);
//         } else {
//             eNewBQId.value = sBQKey;
//             eNewBQName.value = rBiao1Qian1.fSetBQSelectId(iBQBSSelect, sBQKey)
//             fRedrawFen1Lei4BQ(iBQBSSelect, this.id);
//         }
//     }
//     fTPRename();
// }
//
// /**
//  * 重绘分类标签
//  * @int iBQBSSelect
//  * @string sBQId
//  */
// function fRedrawFen1Lei4BQ(iBQBSSelect, sBQId = '') {
//     let teleBQList = [];
//     if (iBQBSSelect === rBiao1Qian1.cConfig.iBQBS1) {
//         teleBQList = eBQArr1.children;
//     } else if (iBQBSSelect === rBiao1Qian1.cConfig.iBQBS2) {
//         teleBQList = eBQArr2.children;
//     } else if (iBQBSSelect === rBiao1Qian1.cConfig.iBQBS3) {
//         teleBQList = eBQArr3.children;
//     }
//     for (let ii = 0; ii < teleBQList.length; ++ii) {
//         if (teleBQList[ii].id === sBQId) {
//             teleBQList[ii].className = 'bq0bq0btn btn0zi3';
//         } else {
//             teleBQList[ii].className = 'bq0bq0btn btn0shh';
//         }
//     }
// }
//
// //点击，图片移动
// function fcTPMove() {
//     rTu2Pian4.fTPMove(eTPMoveLJ.value);
//     //重置图片展示区域和确认移动按钮状态
//     eTPShow.src = '';
//     eTPMove.disabled = false;
//     //重新渲染左侧图片列表
//     let sWFLML = rMu4Lu4.fGetWFLML();
//     let sarrTPName = rTu2Pian4.fGetArrTPName();
//     if (sarrTPName.length < 1) {
//         sarrTPName = rTu2Pian4.fLoadTP(sWFLML);
//     }
//     fLoadTPArr(sWFLML, sarrTPName);
// }
