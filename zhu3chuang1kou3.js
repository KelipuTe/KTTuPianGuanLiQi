// 输出开发环境参数
console.log('Node:' + process.versions.node);
console.log('Chrome:' + process.versions.chrome);
console.log('Electron:' + process.versions.electron);

//模块
const rHelpers = require('./src/helpers');
const rMuLu = require('./src/mu4lu4');
const rTuPian = require('./src/tu2pian4');
const rBiaoQian = require('./src/biao1qian1');
const rXuanRan = require('./src/xuan4ran3');

//Electron模块
const rElectron = require('electron');
const rRemote = rElectron.remote;
const rMenu = rRemote.Menu;
const rDialog = rRemote.dialog;
const rIpcRenderer = rElectron.ipcRenderer;

//右击菜单
let oYouJiCaiDanMuBan = [
    {
        label: '打开调试窗口',
        accelerator: 'F12',
        click: function () {
            // 给主进程发送消息
            rIpcRenderer.send('da-kai-tiao-shi', '申请打开调试窗口');
        }
    }
]
let oYouJiCaiDan = rMenu.buildFromTemplate(oYouJiCaiDanMuBan);
//监听右击事件
window.addEventListener('contextmenu', function (event) {
    //取消事件的默认动作
    event.preventDefault();
    //在目标窗口中弹出菜单
    oYouJiCaiDan.popup({window: rRemote.getCurrentWindow()});
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
let elearrBiaoQian = {};
let elearrBiaoQianYe = {};
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
    elearrBiaoQian = document.getElementById('biao-qian-list').children;
    elearrBiaoQianYe = document.getElementById('biao-qian-ye-list').children;
    for (let ii = 0; ii < elearrBiaoQian.length; ++ii) {
        elearrBiaoQian[ii].id = 'bq-' + (ii + 1);
        elearrBiaoQian[ii].onclick = fQieHuanBiaoQianYe;
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
        if (rHelpers.fEmpty(result.filePaths[0])) {
            console.warn('未选择操作目录');
        } else {
            rMuLu.fSetCaoZuoMuLu(result.filePaths[0]);
            let sWeiFenLeiMuLu = rMuLu.fGetWeiFenLeiMuLu();
            let sarrTPMing = rTuPian.fLoadTP(sWeiFenLeiMuLu);
            fLoadTuPianList(sWeiFenLeiMuLu, sarrTPMing);
            rBiaoQian.fLoadFen1Lei4BQ(rMuLu.fGetFen1Lei4BQLu4Jing4());
            fGouZaoBQList(rBiaoQian.cConfig.iBQBS1, eleBQlist1,
                rBiaoQian.fGetDaiGouZaoBQ(rBiaoQian.cConfig.iBQBS1));
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
    rTuPian.fSetTPMing(sTPMing);
    let sTPLuJing = rMuLu.fGetWeiFenLeiMuLu() + sTPMing;
    rTuPian.fSetTPLuJing(sTPLuJing);
    eleTPShow.src = sTPLuJing;
}

/**
 * 图片展示区域的onload事件
 */
function fTPOnLoad() {
    //获取图片原始大小
    let iTPKuan = this.naturalWidth;
    let iTPGao = this.naturalHeight;
    rTuPian.fSetTPKuanGao(iTPKuan, iTPGao);
    let oRes = rXuanRan.fTPJu1Zhong1(iTPKuan, iTPGao);
    let sStyle = 'margin-left: ' + oRes.iTPMarginLeft + 'px; margin-top: ' + oRes.iTPMarginTop + 'px';
    eleTPShow.setAttribute('style', sStyle);
    fTPChong2Ming4Ming2();
}

/**
 * 图片重命名
 */
function fTPChong2Ming4Ming2() {
    let sBQMuLu = rMuLu.fZu3He2BQMuLu(rBiaoQian.fGetXuanZhongBQBS(), rBiaoQian.fGetAllXuanZhongId());
    let sXuanZhongId = rBiaoQian.fGetXuanZhongId(rBiaoQian.fGetXuanZhongBQBS());
    let sChongMingMing = rTuPian.fGetChong2Ming4Ming4();
    let sMuBiaoLuJing = sBQMuLu + sXuanZhongId + sChongMingMing;
    rTuPian.fSetMuBiaoLuJing(sMuBiaoLuJing);
    eleMuBiaoLuJing.innerHTML = sMuBiaoLuJing;
    eleQueRenYiDong.disabled = false;
}

/**
 * 点击事件，切换标签页
 */
function fQieHuanBiaoQianYe() {
    //全部重置，然后改动目标的展示样式
    for (let ii = 0; ii < elearrBiaoQian.length; ++ii) {
        elearrBiaoQian[ii].className = 'bq-an-niu';
        elearrBiaoQianYe[ii].style.display = 'none';
    }
    let iBQBS = this.id.replace('bq-', '');
    rBiaoQian.fSetXuanZhongBQBS(parseInt(iBQBS));
    elearrBiaoQian[iBQBS - 1].className = 'bq-xuan-zhong';
    elearrBiaoQianYe[iBQBS - 1].style.display = 'block';
}

/**
 * 点击事件，添加新标签
 */
function fClickXinBQAdd() {
    if (rMuLu.fCheckCaoZuoMuLu()) {
        alert('未选择操作目录');
        return;
    }
    let iXuanZhongBQBS = rBiaoQian.fGetXuanZhongBQBS();
    let iXinBQId = eleXinBQId.value;
    let sXinBQMing = eleXinBQMing.value;
    rBiaoQian.fXinBQAdd(iXinBQId, sXinBQMing);
    rBiaoQian.fSaveFen1Lei4BQ(rMuLu.fGetBQMuLu(), rMuLu.fGetFen1Lei4BQLu4Jing4());
    rMuLu.fMakeBQMuLu(iXuanZhongBQBS, rBiaoQian.fGetAllXuanZhongId(), iXinBQId);
    if (iXuanZhongBQBS === rBiaoQian.cConfig.iBQBS1) {
        fGouZaoBQList(iXuanZhongBQBS, eleBQlist1,
            rBiaoQian.fGetDaiGouZaoBQ(iXuanZhongBQBS));
    } else if (iXuanZhongBQBS === rBiaoQian.cConfig.iBQBS2) {
        fGouZaoBQList(iXuanZhongBQBS, eleBQlist2,
            rBiaoQian.fGetDaiGouZaoBQ(iXuanZhongBQBS));
    } else if (iXuanZhongBQBS === rBiaoQian.cConfig.iBQBS3) {
        fGouZaoBQList(iXuanZhongBQBS, eleBQlist3,
            rBiaoQian.fGetDaiGouZaoBQ(iXuanZhongBQBS));
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
    if (iXuanZhongBQBS === rBiaoQian.cConfig.iBQBS1) {
        //一级标签
        if (rBiaoQian.fGetXuanZhongId(iXuanZhongBQBS) === this.id) {
            //如果已选中的就是这个标签
            //清空数据
            rBiaoQian.fCleanXuanZhongId(iXuanZhongBQBS);
            eleBQlist2.innerHTML = '';
            eleBQlist3.innerHTML = '';

            let teleBQList = eleBQlist1.children;
            for (let ii = 0; ii < teleBQList.length; ++ii) {
                teleBQList[ii].className = 'an-niu-xiao an-niu-shan-hu-hong';
            }
        } else {
            //如果已选中的是其他标签
            //清空数据，然后加载对应标签的数据
            rBiaoQian.fCleanXuanZhongId(iXuanZhongBQBS);
            eleBQlist2.innerHTML = '';
            eleBQlist3.innerHTML = '';

            rBiaoQian.fSetXuanZhongId(iXuanZhongBQBS, this.id);
            fGouZaoBQList(rBiaoQian.cConfig.iBQBS2, eleBQlist2,
                rBiaoQian.fGetDaiGouZaoBQ(rBiaoQian.cConfig.iBQBS2));

            let teleBQList = eleBQlist1.children;
            for (let ii = 0; ii < teleBQList.length; ++ii) {
                if (teleBQList[ii].id === this.id) {
                    teleBQList[ii].className = 'an-niu-xiao an-niu-zi';
                } else {
                    teleBQList[ii].className = 'an-niu-xiao an-niu-shan-hu-hong';
                }
            }
        }
    } else if (iXuanZhongBQBS === rBiaoQian.cConfig.iBQBS2) {
        //二级标签
        if (rBiaoQian.fGetXuanZhongId(iXuanZhongBQBS) === this.id) {
            rBiaoQian.fCleanXuanZhongId(iXuanZhongBQBS);
            eleBQlist3.innerHTML = '';

            let teleBQList = eleBQlist2.children;
            for (let ii = 0; ii < teleBQList.length; ++ii) {
                teleBQList[ii].className = 'an-niu-xiao an-niu-shan-hu-hong';
            }
        } else {
            rBiaoQian.fCleanXuanZhongId(iXuanZhongBQBS);
            eleBQlist3.innerHTML = '';

            rBiaoQian.fSetXuanZhongId(iXuanZhongBQBS, this.id)
            fGouZaoBQList(rBiaoQian.cConfig.iBQBS3, eleBQlist3,
                rBiaoQian.fGetDaiGouZaoBQ(rBiaoQian.cConfig.iBQBS3));

            let teleBQList = eleBQlist2.children;
            for (let ii = 0; ii < teleBQList.length; ++ii) {
                if (teleBQList[ii].id === this.id) {
                    teleBQList[ii].className = 'an-niu-xiao an-niu-zi';
                } else {
                    teleBQList[ii].className = 'an-niu-xiao an-niu-shan-hu-hong';
                }
            }
        }
    } else if (iXuanZhongBQBS === rBiaoQian.cConfig.iBQBS3) {
        //三级标签
        if (rBiaoQian.fGetXuanZhongId(iXuanZhongBQBS) === this.id) {
            rBiaoQian.fCleanXuanZhongId(iXuanZhongBQBS);

            let teleBQList = eleBQlist3.children;
            for (let ii = 0; ii < teleBQList.length; ++ii) {
                teleBQList[ii].className = 'an-niu-xiao an-niu-shan-hu-hong';
            }
        } else {
            rBiaoQian.fSetXuanZhongId(iXuanZhongBQBS, this.id)

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
    rTuPian.fYiDongTuPian();
    //重置图片展示区域和确认移动按钮状态
    eleTPShow.src = '';
    eleQueRenYiDong.disabled = false;
    //重新渲染左侧图片列表
    let sWeiFenLeiMuLu = rMuLu.fGetWeiFenLeiMuLu();
    let sarrTPMing = rTuPian.fGetArrTPMing();
    if (sarrTPMing.length < 1) {
        sarrTPMing = rTuPian.fLoadTP(sWeiFenLeiMuLu);
    }
    fLoadTuPianList(sWeiFenLeiMuLu, sarrTPMing);
}


