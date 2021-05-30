//输出环境参数
console.log('Node:' + process.versions.node);
console.log('Chrome:' + process.versions.chrome);
console.log('Electron:' + process.versions.electron);

const rHelper = require('./src/helper');
const rMu4Lu4 = require('./src/mu4lu4');
const rTu2Pian4 = require('./src/tu2pian4');
const rBiao1Qian1 = require('./src/biao1qian1');
const rXuan4Ran3 = require('./src/xuan4ran3');

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
            rIpcRenderer.send('da-kai-tiao-shi', '申请打开调试窗口');
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

let eBQYArr = {}; //标签页按钮列表
let eBQYShowArr = {}; //标签页展示列表

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
    eCZMLSelect = document.getElementById('czml-select');
    eCZMLSelect.onclick = fcCZMLSelect;
    eCZMLPath = document.getElementById('czml-path')

    eTPArr = document.getElementById('tp-arr');
    eTPShow = document.getElementById('tp-show');
    eTPShow.onload = fTPOnLoad;
    //初始化标签页切换
    eBQYArr = document.getElementById('bqy-arr').children;
    eBQYShowArr = document.getElementById('bqy-show-arr').children;
    for (let ii = 0; ii < eBQYArr.length; ++ii) {
        eBQYArr[ii].id = 'bq-' + (ii + 1);
        eBQYArr[ii].onclick = fQieHuanBiaoQianYe;
    }

    eBQArr1 = document.getElementById('bq-arr1');
    eBQArr2 = document.getElementById('bq-arr2');
    eBQArr3 = document.getElementById('bq-arr3');

    eNewBQId = document.getElementById('new-bq-id');
    eNewBQName = document.getElementById('new-bq-name');
    eNewBQAdd = document.getElementById('new-bq-add');
    eNewBQAdd.onclick = fcXinBQAdd;

    eTPTargetPath = document.getElementById('tp-target-path');
    eTPMove = document.getElementById('tp-move');
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
 * @param sWeiFenLeiMuLu
 * @param sarrTPName
 */
function fLoadTPArr(sWeiFenLeiMuLu, sarrTPName) {
    //先清空列表中的元素
    eTPArr.innerHTML = '';
    //然后遍历图片列表重新生成
    let iJiShu = 1;
    for (let sTPMing of sarrTPName) {
        // 构造图片按钮
        let tempEle = document.createElement('img');
        tempEle.id = 'tp-arr-' + iJiShu;
        tempEle.className = 'zuo-tu-pian-zu';
        tempEle.setAttribute('data-wen-jian-ming', sTPMing);
        tempEle.src = sWeiFenLeiMuLu + '\\' + sTPMing;
        tempEle.onclick = fcTPItem;
        eTPArr.appendChild(tempEle);
        ++iJiShu;
    }
}

/**
 * 点击事件，选择图片
 */
function fcTPItem() {
    let sTPMing = this.getAttribute('data-wen-jian-ming');
    rTu2Pian4.fSetTPMing(sTPMing);
    let sTPLuJing = rMu4Lu4.fGetWFLML() + sTPMing;
    rTu2Pian4.fSetTPLuJing(sTPLuJing);
    eTPShow.src = sTPLuJing;
}

//eTPShow的onload事件
function fTPOnLoad() {
    //获取图片原始大小
    let iTPKuan = this.naturalWidth;
    let iTPGao = this.naturalHeight;
    rTu2Pian4.fSetTPKuanGao(iTPKuan, iTPGao);
    let oRes = rXuan4Ran3.fTPJu1Zhong1(iTPKuan, iTPGao);
    let sStyle = 'margin-left: ' + oRes.iTPMarginLeft + 'px; margin-top: ' + oRes.iTPMarginTop + 'px';
    eTPShow.setAttribute('style', sStyle);
    fTPChong2Ming4Ming2();
}

/**
 * 图片重命名
 */
function fTPChong2Ming4Ming2() {
    let sBQMuLu = rMu4Lu4.fZu3He2BQMuLu(rBiao1Qian1.fGetXuanZhongBQBS(), rBiao1Qian1.fGetAllXuanZhongId());
    let sXuanZhongId = rBiao1Qian1.fGetXuanZhongId(rBiao1Qian1.fGetXuanZhongBQBS());
    let sChongMingMing = rTu2Pian4.fGetChong2Ming4Ming4();
    let sMuBiaoLuJing = sBQMuLu + sXuanZhongId + sChongMingMing;
    rTu2Pian4.fSetMuBiaoLuJing(sMuBiaoLuJing);
    eTPTargetPath.innerHTML = sMuBiaoLuJing;
    eTPMove.disabled = false;
}

/**
 * 点击事件，切换标签页
 */
function fQieHuanBiaoQianYe() {
    //全部重置，然后改动目标的展示样式
    for (let ii = 0; ii < eBQYArr.length; ++ii) {
        eBQYArr[ii].className = 'bq-an-niu';
        eBQYShowArr[ii].style.display = 'none';
    }
    let iBQBS = this.id.replace('bq-', '');
    rBiao1Qian1.fSetXuanZhongBQBS(parseInt(iBQBS));
    eBQYArr[iBQBS - 1].className = 'bq-xuan-zhong';
    eBQYShowArr[iBQBS - 1].style.display = 'block';
}

//点击，添加新标签
function fcXinBQAdd() {
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
        tempEle.className = 'an-niu-xiao an-niu-shan-hu-hong';
        tempEle.setAttribute('data-bqbs', iXuanZhongBQBS);
        // 绑定标签点击事件
        tempEle.onclick = fcFen1Lei4BQ;
        eleBQ.appendChild(tempEle);
    }
}

/**
 * 点击分类标签
 */
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
                teleBQList[ii].className = 'an-niu-xiao an-niu-shan-hu-hong';
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
                    teleBQList[ii].className = 'an-niu-xiao an-niu-zi';
                } else {
                    teleBQList[ii].className = 'an-niu-xiao an-niu-shan-hu-hong';
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
                teleBQList[ii].className = 'an-niu-xiao an-niu-shan-hu-hong';
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
                    teleBQList[ii].className = 'an-niu-xiao an-niu-zi';
                } else {
                    teleBQList[ii].className = 'an-niu-xiao an-niu-shan-hu-hong';
                }
            }
        }
    } else if (iXuanZhongBQBS === rBiao1Qian1.cConfig.iBQBS3) {
        //三级标签
        if (rBiao1Qian1.fGetXuanZhongId(iXuanZhongBQBS) === this.id) {
            rBiao1Qian1.fCleanXuanZhongId(iXuanZhongBQBS);

            let teleBQList = eBQArr3.children;
            for (let ii = 0; ii < teleBQList.length; ++ii) {
                teleBQList[ii].className = 'an-niu-xiao an-niu-shan-hu-hong';
            }
        } else {
            rBiao1Qian1.fSetXuanZhongId(iXuanZhongBQBS, this.id)

            let teleBQList = eBQArr3.children;
            for (let ii = 0; ii < teleBQList.length; ++ii) {
                if (teleBQList[ii].id === this.id) {
                    teleBQList[ii].className = 'an-niu-xiao an-niu-zi';
                } else {
                    teleBQList[ii].className = 'an-niu-xiao an-niu-shan-hu-hong';
                }
            }
        }
    }
    fTPChong2Ming4Ming2();
}

//点击，图片移动
function fcTPMove() {
    rTu2Pian4.fYiDongTuPian();
    //重置图片展示区域和确认移动按钮状态
    eTPShow.src = '';
    eTPMove.disabled = false;
    //重新渲染左侧图片列表
    let sWeiFenLeiMuLu = rMu4Lu4.fGetWFLML();
    let sarrTPName = rTu2Pian4.fGetArrTPMing();
    if (sarrTPName.length < 1) {
        sarrTPName = rTu2Pian4.fLoadTP(sWeiFenLeiMuLu);
    }
    fLoadTPArr(sWeiFenLeiMuLu, sarrTPName);
}


