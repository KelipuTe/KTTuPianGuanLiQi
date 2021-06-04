//输出环境参数
console.log('Node:' + process.versions.node);
console.log('Chrome:' + process.versions.chrome);
console.log('Electron:' + process.versions.electron);

const rHelper = require('./src/js/helper');
const rMu4Lu4 = require('./src/js/mu4lu4');
const rTu2Pian4 = require('./src/js/tu2pian4');
const rBiao1Qian1 = require('./src/js/biao1qian1');
const rXuan4Ran3 = require('./src/js/xuan4ran3');

const rElectron = require('electron');
const rRemote = rElectron.remote;
const rMenu = rRemote.Menu;
const rDialog = rRemote.dialog;
const rIpcRenderer = rElectron.ipcRenderer;

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

let eCZMLSelect = {}; //选择操作目录按钮
let eCZMLPath = {}; //操作目录路径展示

let eTPArr = {}; //左侧图片列表
let eTPShow = {}; //右侧图片展示

let eBQBQYBtnArr = {}; //标签页按钮列表
let eBQBQYBodyArr = {}; //标签页展示列表

let eBQArr1 = {}; //标签列表1
let eBQArr2 = {}; //标签列表2
let eBQArr3 = {}; //标签列表3

let eNewBQId = {}; //新标签id
let eNewBQName = {}; //新标签名
let eNewBQAdd = {}; //添加新标签按钮

let eTPTargetPath = {}; //图片移动目标路径
let eTPMove = {}; //图片移动按钮

/*####dom对象####*/

window.onload = function () {
    eCZMLSelect = document.getElementById('ml0czml0select');
    eCZMLSelect.onclick = fcCZMLSelect;
    eCZMLPath = document.getElementById('ml0czml0path')

    eTPArr = document.getElementById('tp0arr');
    eTPShow = document.getElementById('tp0show');
    eTPShow.onload = fTPOnLoad;
    //初始化标签页切换
    eBQBQYBtnArr = document.getElementById('bq0bqy0btn0arr').children;
    eBQBQYBodyArr = document.getElementById('bq0bqy0body0arr').children;
    for (let ii = 0; ii < eBQBQYBtnArr.length; ++ii) {
        eBQBQYBtnArr[ii].id = 'bq0bqy0i' + (ii + 1);
        eBQBQYBtnArr[ii].onclick = fcBQYSwitch;
    }

    eBQArr1 = document.getElementById('bq0arr1');
    eBQArr2 = document.getElementById('bq0arr2');
    eBQArr3 = document.getElementById('bq0arr3');

    eNewBQId = document.getElementById('bq0new0id');
    eNewBQName = document.getElementById('bq0new0name');
    eNewBQAdd = document.getElementById('bq0new0add');
    eNewBQAdd.onclick = fcNewBQAdd;

    eTPTargetPath = document.getElementById('ml0target0path');
    eTPMove = document.getElementById('ml0tp0move');
    eTPMove.onclick = fcTPMove;
    eTPMove.disabled = true;
}

//点击，操作选择目录
function fcCZMLSelect() {
    rDialog.showOpenDialog({
        'title': '请选择操作目录',
        'properties': ['openDirectory']
    }).then(function (result) {
        if (rHelper.fEmptyStr(result.filePaths[0])) {
            console.warn('未选择操作目录');
        } else {
            rMu4Lu4.fSetCZML(result.filePaths[0]);
            eCZMLPath.value = result.filePaths[0];
            let sWFLML = rMu4Lu4.fGetWFLML();
            let sarrTPName = rTu2Pian4.fLoadTP(sWFLML);
            fLoadTPArr(sWFLML, sarrTPName);
            rBiao1Qian1.fLoadFen1Lei4BQ(rMu4Lu4.fGetPathFen1Lei4BQ());
            fMakeBQArr(rBiao1Qian1.cConfig.iBQBS1, eBQArr1, rBiao1Qian1.fGetWaitBQ(rBiao1Qian1.cConfig.iBQBS1));
        }
    });
}

/**
 * 渲染图片列表
 * @string sWFLML
 * @string sarrTPName
 */
function fLoadTPArr(sWFLML, sarrTPName) {
    //先清空列表中的元素
    eTPArr.innerHTML = '';
    //然后遍历图片列表重新生成
    let ii = 1;
    for (let sTPName of sarrTPName) {
        // 构造图片按钮
        let tempEle = document.createElement('img');
        tempEle.id = 'tp0arr0i' + ii;
        tempEle.className = 'tp0arr';
        tempEle.setAttribute('data-tp0name', sTPName);
        tempEle.src = sWFLML + '\\' + sTPName;
        tempEle.onclick = fcTPItem;
        eTPArr.appendChild(tempEle);
        ++ii;
    }
}

//点击，选择图片
function fcTPItem() {
    let sTPName = this.getAttribute('data-tp0name');
    rTu2Pian4.fSetTPName(sTPName);
    let sTPPath = rMu4Lu4.fGetWFLML() + sTPName;
    rTu2Pian4.fSetTPPath(sTPPath);
    eTPShow.src = sTPPath;
}

//eTPShow的onload事件
function fTPOnLoad() {
    //获取图片原始宽高
    let iTPKuan = this.naturalWidth;
    let iTPGao = this.naturalHeight;
    rTu2Pian4.fSetTPKuanGao(iTPKuan, iTPGao);
    let oRes = rXuan4Ran3.fTPJu1Zhong1(iTPKuan, iTPGao);
    let sStyle = 'margin-left: ' + oRes.iTPMarginLeft + 'px; margin-top: ' + oRes.iTPMarginTop + 'px';
    eTPShow.setAttribute('style', sStyle);
    fTPRename();
}

//图片重命名
function fTPRename() {
    let sBQMuLu = rMu4Lu4.fZu3He2BQML(rBiao1Qian1.fGetBQBSSelect(), rBiao1Qian1.fGetAllBQSelectId());
    let sBQId = rBiao1Qian1.fGetBQSelectId(rBiao1Qian1.fGetBQBSSelect());
    let sTPRename = rTu2Pian4.fGetRename();
    eTPTargetPath.value = sBQMuLu + sBQId + sTPRename;
    eTPMove.disabled = false;
}

//点击，切换标签页
function fcBQYSwitch() {
    for (let ii = 0; ii < eBQBQYBtnArr.length; ++ii) {
        eBQBQYBodyArr[ii].style.display = 'none';
    }
    let iBQBS = this.id.replace('bq0bqy0i', '');
    rBiao1Qian1.fSetBQBSSelect(parseInt(iBQBS));
    eBQBQYBodyArr[iBQBS - 1].style.display = 'block';
}

//点击，添加新标签
function fcNewBQAdd() {
    if (rMu4Lu4.fCheckCZML()) {
        alert('未选择操作目录');
        return;
    }
    let iBQBSSelect = rBiao1Qian1.fGetBQBSSelect();
    let iXinBQId = eNewBQId.value;
    let sXinBQName = eNewBQName.value;
    rBiao1Qian1.fXinBQAdd(iXinBQId, sXinBQName);
    rBiao1Qian1.fSaveFen1Lei4BQ(rMu4Lu4.fGetBQML(), rMu4Lu4.fGetPathFen1Lei4BQ());
    rMu4Lu4.fMakeBQML(iBQBSSelect, rBiao1Qian1.fGetAllBQSelectId(), iXinBQId);
    if (iBQBSSelect === rBiao1Qian1.cConfig.iBQBS1) {
        fMakeBQArr(iBQBSSelect, eBQArr1, rBiao1Qian1.fGetWaitBQ(iBQBSSelect));
    } else if (iBQBSSelect === rBiao1Qian1.cConfig.iBQBS2) {
        fMakeBQArr(iBQBSSelect, eBQArr2, rBiao1Qian1.fGetWaitBQ(iBQBSSelect));
    } else if (iBQBSSelect === rBiao1Qian1.cConfig.iBQBS3) {
        fMakeBQArr(iBQBSSelect, eBQArr3, rBiao1Qian1.fGetWaitBQ(iBQBSSelect));
    }
    // 重置输入框
    eNewBQId.value = '';
    eNewBQName.value = '';
}

/**
 * 渲染标签列表
 * @param iBQBSSelect
 * @param eleBQ
 * @param arrDaiGouZaoBQ
 */
function fMakeBQArr(iBQBSSelect, eleBQ, arrDaiGouZaoBQ) {
    eleBQ.innerHTML = '';
    for (let kBQ in arrDaiGouZaoBQ) {
        let tempEle = document.createElement('button');
        tempEle.id = kBQ;
        tempEle.type = 'button';
        tempEle.innerHTML = arrDaiGouZaoBQ[kBQ];
        tempEle.className = 'bq0bq0btn btn0shh';
        tempEle.setAttribute('data-bqbs', iBQBSSelect);
        // 绑定标签点击事件
        tempEle.onclick = fcFen1Lei4BQ;
        eleBQ.appendChild(tempEle);
    }
}

//点击，分类标签
function fcFen1Lei4BQ() {
    let iBQBSSelect = parseInt(this.getAttribute('data-bqbs'));
    if (iBQBSSelect === rBiao1Qian1.cConfig.iBQBS1) {
        //一级标签
        if (rBiao1Qian1.fGetBQSelectId(iBQBSSelect) === this.id) {
            //如果已选中的就是这个标签
            //清空数据
            rBiao1Qian1.fCleanBQSelectId(iBQBSSelect);
            eBQArr2.innerHTML = '';
            eBQArr3.innerHTML = '';

            let teleBQList = eBQArr1.children;
            for (let ii = 0; ii < teleBQList.length; ++ii) {
                teleBQList[ii].className = 'bq0bq0btn btn0shh';
            }
        } else {
            //如果已选中的是其他标签
            //清空数据，然后加载对应标签的数据
            rBiao1Qian1.fCleanBQSelectId(iBQBSSelect);
            eBQArr2.innerHTML = '';
            eBQArr3.innerHTML = '';

            rBiao1Qian1.fSetBQSelectId(iBQBSSelect, this.id);
            fMakeBQArr(rBiao1Qian1.cConfig.iBQBS2, eBQArr2, rBiao1Qian1.fGetWaitBQ(rBiao1Qian1.cConfig.iBQBS2));

            let teleBQList = eBQArr1.children;
            for (let ii = 0; ii < teleBQList.length; ++ii) {
                if (teleBQList[ii].id === this.id) {
                    teleBQList[ii].className = 'bq0bq0btn btn0zi3';
                } else {
                    teleBQList[ii].className = 'bq0bq0btn btn0shh';
                }
            }
        }
    } else if (iBQBSSelect === rBiao1Qian1.cConfig.iBQBS2) {
        //二级标签
        if (rBiao1Qian1.fGetBQSelectId(iBQBSSelect) === this.id) {
            rBiao1Qian1.fCleanBQSelectId(iBQBSSelect);
            eBQArr3.innerHTML = '';

            let teleBQList = eBQArr2.children;
            for (let ii = 0; ii < teleBQList.length; ++ii) {
                teleBQList[ii].className = 'bq0bq0btn btn0shh';
            }
        } else {
            rBiao1Qian1.fCleanBQSelectId(iBQBSSelect);
            eBQArr3.innerHTML = '';

            rBiao1Qian1.fSetBQSelectId(iBQBSSelect, this.id)
            fMakeBQArr(rBiao1Qian1.cConfig.iBQBS3, eBQArr3, rBiao1Qian1.fGetWaitBQ(rBiao1Qian1.cConfig.iBQBS3));

            let teleBQList = eBQArr2.children;
            for (let ii = 0; ii < teleBQList.length; ++ii) {
                if (teleBQList[ii].id === this.id) {
                    teleBQList[ii].className = 'bq0bq0btn btn0zi3';
                } else {
                    teleBQList[ii].className = 'bq0bq0btn btn0shh';
                }
            }
        }
    } else if (iBQBSSelect === rBiao1Qian1.cConfig.iBQBS3) {
        //三级标签
        if (rBiao1Qian1.fGetBQSelectId(iBQBSSelect) === this.id) {
            rBiao1Qian1.fCleanBQSelectId(iBQBSSelect);

            let teleBQList = eBQArr3.children;
            for (let ii = 0; ii < teleBQList.length; ++ii) {
                teleBQList[ii].className = 'bq0bq0btn btn0shh';
            }
        } else {
            rBiao1Qian1.fSetBQSelectId(iBQBSSelect, this.id)

            let teleBQList = eBQArr3.children;
            for (let ii = 0; ii < teleBQList.length; ++ii) {
                if (teleBQList[ii].id === this.id) {
                    teleBQList[ii].className = 'bq0bq0btn btn0zi3';
                } else {
                    teleBQList[ii].className = 'bq0bq0btn btn0shh';
                }
            }
        }
    }
    fTPRename();
}

//点击，图片移动
function fcTPMove() {
    rTu2Pian4.fTPMove(eTPTargetPath.value);
    //重置图片展示区域和确认移动按钮状态
    eTPShow.src = '';
    eTPMove.disabled = false;
    //重新渲染左侧图片列表
    let sWFLML = rMu4Lu4.fGetWFLML();
    let sarrTPName = rTu2Pian4.fGetArrTPName();
    if (sarrTPName.length < 1) {
        sarrTPName = rTu2Pian4.fLoadTP(sWFLML);
    }
    fLoadTPArr(sWFLML, sarrTPName);
}
