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
            fMakeBQArr(rBiao1Qian1.cConfig.iBQBS1, eBQArr1,
                rBiao1Qian1.fGetWaitBQ(rBiao1Qian1.cConfig.iBQBS1));
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
    rTu2Pian4.fSetTPMing(sTPName);
    let sTPPath = rMu4Lu4.fGetWFLML() + sTPName;
    rTu2Pian4.fSetTPLuJing(sTPPath);
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
    let sBQMuLu = rMu4Lu4.fZu3He2BQMuLu(rBiao1Qian1.fGetXuanZhongBQBS(), rBiao1Qian1.fGetAllXuanZhongId());
    let sXuanZhongId = rBiao1Qian1.fGetXuanZhongId(rBiao1Qian1.fGetXuanZhongBQBS());
    let sChongMingMing = rTu2Pian4.fGetChong2Ming4Ming4();
    let sMuBiaoLuJing = sBQMuLu + sXuanZhongId + sChongMingMing;
    rTu2Pian4.fSetMuBiaoLuJing(sMuBiaoLuJing);
    eTPTargetPath.value = sMuBiaoLuJing;
    eTPMove.disabled = false;
}

//点击，切换标签页
function fcBQYSwitch() {
    for (let ii = 0; ii < eBQBQYBtnArr.length; ++ii) {
        eBQBQYBodyArr[ii].style.display = 'none';
    }
    let iBQBS = this.id.replace('bq0bqy0i', '');
    rBiao1Qian1.fSetXuanZhongBQBS(parseInt(iBQBS));
    eBQBQYBodyArr[iBQBS - 1].style.display = 'block';
}

//点击，添加新标签
function fcNewBQAdd() {
    if (rMu4Lu4.fCheckCZML()) {
        alert('未选择操作目录');
        return;
    }
    let iXuanZhongBQBS = rBiao1Qian1.fGetXuanZhongBQBS();
    let iXinBQId = eNewBQId.value;
    let sXinBQMing = eNewBQName.value;
    rBiao1Qian1.fXinBQAdd(iXinBQId, sXinBQMing);
    rBiao1Qian1.fSaveFen1Lei4BQ(rMu4Lu4.fGetBQML(), rMu4Lu4.fGetPathFen1Lei4BQ());
    rMu4Lu4.fMakeBQMuLu(iXuanZhongBQBS, rBiao1Qian1.fGetAllXuanZhongId(), iXinBQId);
    if (iXuanZhongBQBS === rBiao1Qian1.cConfig.iBQBS1) {
        fMakeBQArr(iXuanZhongBQBS, eBQArr1,
            rBiao1Qian1.fGetWaitBQ(iXuanZhongBQBS));
    } else if (iXuanZhongBQBS === rBiao1Qian1.cConfig.iBQBS2) {
        fMakeBQArr(iXuanZhongBQBS, eBQArr2,
            rBiao1Qian1.fGetWaitBQ(iXuanZhongBQBS));
    } else if (iXuanZhongBQBS === rBiao1Qian1.cConfig.iBQBS3) {
        fMakeBQArr(iXuanZhongBQBS, eBQArr3,
            rBiao1Qian1.fGetWaitBQ(iXuanZhongBQBS));
    }
    // 重置输入框
    eNewBQId.value = '';
    eNewBQName.value = '';
}

/**
 * 渲染标签列表
 * @param iXuanZhongBQBS
 * @param eleBQ
 * @param arrDaiGouZaoBQ
 */
function fMakeBQArr(iXuanZhongBQBS, eleBQ, arrDaiGouZaoBQ) {
    eleBQ.innerHTML = '';
    for (let kBQ in arrDaiGouZaoBQ) {
        let tempEle = document.createElement('button');
        tempEle.id = kBQ;
        tempEle.type = 'button';
        tempEle.innerHTML = arrDaiGouZaoBQ[kBQ];
        tempEle.className = 'bq0bq0btn btn0shh';
        tempEle.setAttribute('data-bqbs', iXuanZhongBQBS);
        // 绑定标签点击事件
        tempEle.onclick = fcFen1Lei4BQ;
        eleBQ.appendChild(tempEle);
    }
}

//点击，分类标签
function fcFen1Lei4BQ() {
    let iXuanZhongBQBS = parseInt(this.getAttribute('data-bqbs'));
    if (iXuanZhongBQBS === rBiao1Qian1.cConfig.iBQBS1) {
        //一级标签
        if (rBiao1Qian1.fGetXuanZhongId(iXuanZhongBQBS) === this.id) {
            //如果已选中的就是这个标签
            //清空数据
            rBiao1Qian1.fCleanXuanZhongId(iXuanZhongBQBS);
            eBQArr2.innerHTML = '';
            eBQArr3.innerHTML = '';

            let teleBQList = eBQArr1.children;
            for (let ii = 0; ii < teleBQList.length; ++ii) {
                teleBQList[ii].className = 'bq0bq0btn btn0shh';
            }
        } else {
            //如果已选中的是其他标签
            //清空数据，然后加载对应标签的数据
            rBiao1Qian1.fCleanXuanZhongId(iXuanZhongBQBS);
            eBQArr2.innerHTML = '';
            eBQArr3.innerHTML = '';

            rBiao1Qian1.fSetXuanZhongId(iXuanZhongBQBS, this.id);
            fMakeBQArr(rBiao1Qian1.cConfig.iBQBS2, eBQArr2,
                rBiao1Qian1.fGetWaitBQ(rBiao1Qian1.cConfig.iBQBS2));

            let teleBQList = eBQArr1.children;
            for (let ii = 0; ii < teleBQList.length; ++ii) {
                if (teleBQList[ii].id === this.id) {
                    teleBQList[ii].className = 'bq0bq0btn btn0zi3';
                } else {
                    teleBQList[ii].className = 'bq0bq0btn btn0shh';
                }
            }
        }
    } else if (iXuanZhongBQBS === rBiao1Qian1.cConfig.iBQBS2) {
        //二级标签
        if (rBiao1Qian1.fGetXuanZhongId(iXuanZhongBQBS) === this.id) {
            rBiao1Qian1.fCleanXuanZhongId(iXuanZhongBQBS);
            eBQArr3.innerHTML = '';

            let teleBQList = eBQArr2.children;
            for (let ii = 0; ii < teleBQList.length; ++ii) {
                teleBQList[ii].className = 'bq0bq0btn btn0shh';
            }
        } else {
            rBiao1Qian1.fCleanXuanZhongId(iXuanZhongBQBS);
            eBQArr3.innerHTML = '';

            rBiao1Qian1.fSetXuanZhongId(iXuanZhongBQBS, this.id)
            fMakeBQArr(rBiao1Qian1.cConfig.iBQBS3, eBQArr3,
                rBiao1Qian1.fGetWaitBQ(rBiao1Qian1.cConfig.iBQBS3));

            let teleBQList = eBQArr2.children;
            for (let ii = 0; ii < teleBQList.length; ++ii) {
                if (teleBQList[ii].id === this.id) {
                    teleBQList[ii].className = 'bq0bq0btn btn0zi3';
                } else {
                    teleBQList[ii].className = 'bq0bq0btn btn0shh';
                }
            }
        }
    } else if (iXuanZhongBQBS === rBiao1Qian1.cConfig.iBQBS3) {
        //三级标签
        if (rBiao1Qian1.fGetXuanZhongId(iXuanZhongBQBS) === this.id) {
            rBiao1Qian1.fCleanXuanZhongId(iXuanZhongBQBS);

            let teleBQList = eBQArr3.children;
            for (let ii = 0; ii < teleBQList.length; ++ii) {
                teleBQList[ii].className = 'bq0bq0btn btn0shh';
            }
        } else {
            rBiao1Qian1.fSetXuanZhongId(iXuanZhongBQBS, this.id)

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
    rTu2Pian4.fYiDongTuPian();
    //重置图片展示区域和确认移动按钮状态
    eTPShow.src = '';
    eTPMove.disabled = false;
    //重新渲染左侧图片列表
    let sWFLML = rMu4Lu4.fGetWFLML();
    let sarrTPName = rTu2Pian4.fGetArrTPMing();
    if (sarrTPName.length < 1) {
        sarrTPName = rTu2Pian4.fLoadTP(sWFLML);
    }
    fLoadTPArr(sWFLML, sarrTPName);
}


