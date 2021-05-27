//输出开发环境参数
console.log('Node:' + process.versions.node);
console.log('Chrome:' + process.versions.chrome);
console.log('Electron:' + process.versions.electron);

//模块
const rHelper = require('./src/helper');
const rMu4Lu4 = require('./src/mu4lu4');
const rTu2Pian4 = require('./src/tu2pian4');
const rBiao1Qian1 = require('./src/biao1qian1');
const rXuan4Ran3 = require('./src/xuan4ran3');

//Electron模块
const rElectron = require('electron');
const rRemote = rElectron.remote;
const rMenu = rRemote.Menu;
const rDialog = rRemote.dialog;
const rIpcRenderer = rElectron.ipcRenderer;

//右击菜单
let oYou4Ji1Cai4Dan1T = [
    {
        label: '打开调试窗口',
        accelerator: 'F12',
        click: function () {
            //给主进程发送消息
            rIpcRenderer.send('da-kai-tiao-shi', '申请打开调试窗口');
        }
    }
];
let oYou4Ji1Cai4Dan1 = rMenu.buildFromTemplate(oYou4Ji1Cai4Dan1T);
//监听右击事件
window.addEventListener('contextmenu', function (event) {
    //取消事件的默认动作
    event.preventDefault();
    //在目标窗口中弹出菜单
    oYou4Ji1Cai4Dan1.popup({window: rRemote.getCurrentWindow()});
}, false);

/*#####dom对象#####*/
//选择目录
let eleXuanZeMuLu = {};
//目录路径
let eleMuLuLuJing = {};
//图片列表
let eleTPList = {};
//图片展示
let eleTPShow = {};
//标签页列表
let elearrBiao1Qian1 = {};
let elearrBiao1Qian1Ye = {};
//标签列表
let eleBQlist1 = {};
let eleBQlist2 = {};
let eleBQlist3 = {};
//添加新标签
let eleXinBQId = {};
let eleXinBQMing = {};
let eleXinBQAdd = {};
//确认移动
let eleMuBiaoLuJing = {};
let eleQueRenYiDong = {};
/*##########dom对象##########*/

//页面初始化
window.onload = function () {
    //选择目录按钮
    eleXuanZeMuLu = document.getElementById('xuan-ze-mu-lu');
    eleXuanZeMuLu.onclick = fClickXuanZeMuLu;
    eleMuLuLuJing = document.getElementById('mu-lu-lu-jing')
    //左侧图片列表和右侧图片展示区域
    eleTPList = document.getElementById('tp-list');
    eleTPShow = document.getElementById('tp-show');
    eleTPShow.onload = fTPOnLoad;
    //初始化标签页切换
    elearrBiao1Qian1 = document.getElementById('biao-qian-list').children;
    elearrBiao1Qian1Ye = document.getElementById('biao-qian-ye-list').children;
    for (let ii = 0; ii < elearrBiao1Qian1.length; ++ii) {
        elearrBiao1Qian1[ii].id = 'bq-' + (ii + 1);
        elearrBiao1Qian1[ii].onclick = fQieHuanBiaoQianYe;
    }
    //标签列表
    eleBQlist1 = document.getElementById('bq1-list');
    eleBQlist2 = document.getElementById('bq2-list');
    eleBQlist3 = document.getElementById('bq3-list');
    //添加新标签
    eleXinBQId = document.getElementById('xin-bq-id');
    eleXinBQMing = document.getElementById('xin-bq-ming');
    eleXinBQAdd = document.getElementById('xin-bq-add');
    eleXinBQAdd.onclick = fClickXinBQAdd;
    // 移动目标目录和确认移动按钮
    eleMuBiaoLuJing = document.getElementById('mu-biao-lu-jing');
    eleQueRenYiDong = document.getElementById('que-ren-yi-dong');
    eleQueRenYiDong.onclick = fClickQueRenYiDong;
    eleQueRenYiDong.disabled = true;
}

/**
 * 点击事件，选择目录
 */
function fClickXuanZeMuLu() {
    rDialog.showOpenDialog({
        'title': '请选择操作目录',
        'properties': ['openDirectory']
    }).then(function (result) {
        if (rHelper.fEmpty(result.filePaths[0])) {
            console.warn('未选择操作目录');
        } else {
            rMu4Lu4.fSetCaoZuoMuLu(result.filePaths[0]);
            let sWeiFenLeiMuLu = rMu4Lu4.fGetWeiFenLeiMuLu();
            let sarrTPMing = rTu2Pian4.fLoadTP(sWeiFenLeiMuLu);
            fLoadTuPianList(sWeiFenLeiMuLu, sarrTPMing);
            rBiao1Qian1.fLoadFen1Lei4BQ(rMu4Lu4.fGetFen1Lei4BQLu4Jing4());
            fGouZaoBQList(rBiao1Qian1.cConfig.iBQBS1, eleBQlist1,
                rBiao1Qian1.fGetDaiGouZaoBQ(rBiao1Qian1.cConfig.iBQBS1));
        }
    });
}

/**
 * 渲染图片列表
 * @param sWeiFenLeiMuLu
 * @param sarrTPMing
 */
function fLoadTuPianList(sWeiFenLeiMuLu, sarrTPMing) {
    //先清空列表中的元素
    eleTPList.innerHTML = '';
    //然后遍历图片列表重新生成
    let iJiShu = 1;
    for (let sTPMing of sarrTPMing) {
        // 构造图片按钮
        let tempEle = document.createElement('img');
        tempEle.id = 'tp-list-' + iJiShu;
        tempEle.className = 'zuo-tu-pian-zu';
        tempEle.setAttribute('data-wen-jian-ming', sTPMing);
        tempEle.src = sWeiFenLeiMuLu + '\\' + sTPMing;
        tempEle.onclick = fClickTPItem;
        eleTPList.appendChild(tempEle);
        ++iJiShu;
    }
}

/**
 * 点击事件，选择图片
 */
function fClickTPItem() {
    let sTPMing = this.getAttribute('data-wen-jian-ming');
    rTu2Pian4.fSetTPMing(sTPMing);
    let sTPLuJing = rMu4Lu4.fGetWeiFenLeiMuLu() + sTPMing;
    rTu2Pian4.fSetTPLuJing(sTPLuJing);
    eleTPShow.src = sTPLuJing;
}

/**
 * 图片展示区域的onload事件
 */
function fTPOnLoad() {
    //获取图片原始大小
    let iTPKuan = this.naturalWidth;
    let iTPGao = this.naturalHeight;
    rTu2Pian4.fSetTPKuanGao(iTPKuan, iTPGao);
    let oRes = rXuan4Ran3.fTPJu1Zhong1(iTPKuan, iTPGao);
    let sStyle = 'margin-left: ' + oRes.iTPMarginLeft + 'px; margin-top: ' + oRes.iTPMarginTop + 'px';
    eleTPShow.setAttribute('style', sStyle);
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
    eleMuBiaoLuJing.innerHTML = sMuBiaoLuJing;
    eleQueRenYiDong.disabled = false;
}

/**
 * 点击事件，切换标签页
 */
function fQieHuanBiaoQianYe() {
    //全部重置，然后改动目标的展示样式
    for (let ii = 0; ii < elearrBiao1Qian1.length; ++ii) {
        elearrBiao1Qian1[ii].className = 'bq-an-niu';
        elearrBiao1Qian1Ye[ii].style.display = 'none';
    }
    let iBQBS = this.id.replace('bq-', '');
    rBiao1Qian1.fSetXuanZhongBQBS(parseInt(iBQBS));
    elearrBiao1Qian1[iBQBS - 1].className = 'bq-xuan-zhong';
    elearrBiao1Qian1Ye[iBQBS - 1].style.display = 'block';
}

/**
 * 点击事件，添加新标签
 */
function fClickXinBQAdd() {
    if (rMu4Lu4.fCheckCaoZuoMuLu()) {
        alert('未选择操作目录');
        return;
    }
    let iXuanZhongBQBS = rBiao1Qian1.fGetXuanZhongBQBS();
    let iXinBQId = eleXinBQId.value;
    let sXinBQMing = eleXinBQMing.value;
    rBiao1Qian1.fXinBQAdd(iXinBQId, sXinBQMing);
    rBiao1Qian1.fSaveFen1Lei4BQ(rMu4Lu4.fGetBQMuLu(), rMu4Lu4.fGetFen1Lei4BQLu4Jing4());
    rMu4Lu4.fMakeBQMuLu(iXuanZhongBQBS, rBiao1Qian1.fGetAllXuanZhongId(), iXinBQId);
    if (iXuanZhongBQBS === rBiao1Qian1.cConfig.iBQBS1) {
        fGouZaoBQList(iXuanZhongBQBS, eleBQlist1,
            rBiao1Qian1.fGetDaiGouZaoBQ(iXuanZhongBQBS));
    } else if (iXuanZhongBQBS === rBiao1Qian1.cConfig.iBQBS2) {
        fGouZaoBQList(iXuanZhongBQBS, eleBQlist2,
            rBiao1Qian1.fGetDaiGouZaoBQ(iXuanZhongBQBS));
    } else if (iXuanZhongBQBS === rBiao1Qian1.cConfig.iBQBS3) {
        fGouZaoBQList(iXuanZhongBQBS, eleBQlist3,
            rBiao1Qian1.fGetDaiGouZaoBQ(iXuanZhongBQBS));
    }
    // 重置输入框
    eleXinBQId.value = '';
    eleXinBQMing.value = '';
}

/**
 * 渲染标签列表
 * @param iXuanZhongBQBS
 * @param eleBQ
 * @param arrDaiGouZaoBQ
 */
function fGouZaoBQList(iXuanZhongBQBS, eleBQ, arrDaiGouZaoBQ) {
    eleBQ.innerHTML = '';
    for (let kBQ in arrDaiGouZaoBQ) {
        let tempEle = document.createElement('button');
        tempEle.id = kBQ;
        tempEle.type = 'button';
        tempEle.innerHTML = arrDaiGouZaoBQ[kBQ];
        tempEle.className = 'an-niu-xiao an-niu-shan-hu-hong';
        tempEle.setAttribute('data-bqbs', iXuanZhongBQBS);
        // 绑定标签点击事件
        tempEle.onclick = fClickFen1Lei4BQ;
        eleBQ.appendChild(tempEle);
    }
}

/**
 * 点击分类标签
 */
function fClickFen1Lei4BQ() {
    let iXuanZhongBQBS = parseInt(this.getAttribute('data-bqbs'));
    if (iXuanZhongBQBS === rBiao1Qian1.cConfig.iBQBS1) {
        //一级标签
        if (rBiao1Qian1.fGetXuanZhongId(iXuanZhongBQBS) === this.id) {
            //如果已选中的就是这个标签
            //清空数据
            rBiao1Qian1.fCleanXuanZhongId(iXuanZhongBQBS);
            eleBQlist2.innerHTML = '';
            eleBQlist3.innerHTML = '';

            let teleBQList = eleBQlist1.children;
            for (let ii = 0; ii < teleBQList.length; ++ii) {
                teleBQList[ii].className = 'an-niu-xiao an-niu-shan-hu-hong';
            }
        } else {
            //如果已选中的是其他标签
            //清空数据，然后加载对应标签的数据
            rBiao1Qian1.fCleanXuanZhongId(iXuanZhongBQBS);
            eleBQlist2.innerHTML = '';
            eleBQlist3.innerHTML = '';

            rBiao1Qian1.fSetXuanZhongId(iXuanZhongBQBS, this.id);
            fGouZaoBQList(rBiao1Qian1.cConfig.iBQBS2, eleBQlist2,
                rBiao1Qian1.fGetDaiGouZaoBQ(rBiao1Qian1.cConfig.iBQBS2));

            let teleBQList = eleBQlist1.children;
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
            eleBQlist3.innerHTML = '';

            let teleBQList = eleBQlist2.children;
            for (let ii = 0; ii < teleBQList.length; ++ii) {
                teleBQList[ii].className = 'an-niu-xiao an-niu-shan-hu-hong';
            }
        } else {
            rBiao1Qian1.fCleanXuanZhongId(iXuanZhongBQBS);
            eleBQlist3.innerHTML = '';

            rBiao1Qian1.fSetXuanZhongId(iXuanZhongBQBS, this.id)
            fGouZaoBQList(rBiao1Qian1.cConfig.iBQBS3, eleBQlist3,
                rBiao1Qian1.fGetDaiGouZaoBQ(rBiao1Qian1.cConfig.iBQBS3));

            let teleBQList = eleBQlist2.children;
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

            let teleBQList = eleBQlist3.children;
            for (let ii = 0; ii < teleBQList.length; ++ii) {
                teleBQList[ii].className = 'an-niu-xiao an-niu-shan-hu-hong';
            }
        } else {
            rBiao1Qian1.fSetXuanZhongId(iXuanZhongBQBS, this.id)

            let teleBQList = eleBQlist3.children;
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

/**
 * 点击确认移动
 */
function fClickQueRenYiDong() {
    rTu2Pian4.fYiDongTuPian();
    //重置图片展示区域和确认移动按钮状态
    eleTPShow.src = '';
    eleQueRenYiDong.disabled = false;
    //重新渲染左侧图片列表
    let sWeiFenLeiMuLu = rMu4Lu4.fGetWeiFenLeiMuLu();
    let sarrTPMing = rTu2Pian4.fGetArrTPMing();
    if (sarrTPMing.length < 1) {
        sarrTPMing = rTu2Pian4.fLoadTP(sWeiFenLeiMuLu);
    }
    fLoadTuPianList(sWeiFenLeiMuLu, sarrTPMing);
}


