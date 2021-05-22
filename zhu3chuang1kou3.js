// 输出开发环境参数
console.log('Node:' + process.versions.node);
console.log('Chrome:' + process.versions.chrome);
console.log('Electron:' + process.versions.electron);

const rHelpers = require('./src/helpers');
const rMuLu = require('./src/mu4lu4');
const rTuPian = require('./src/tu2pian4');
const rBiaoQian = require('./src/biao1qian1');
const rXuanRan = require('./src/xuan4ran3');

const rElectron = require('electron');
const rFs = require('fs');

const rRemote = rElectron.remote;
const rMenu = rRemote.Menu;
const rDialog = rRemote.dialog;
const rIpcRenderer = rElectron.ipcRenderer;

// 右击菜单
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
// 监听右击事件
window.addEventListener('contextmenu', function (event) {
    // 取消事件的默认动作
    event.preventDefault();
    // 在目标窗口中弹出菜单
    oYouJiCaiDan.popup({window: rRemote.getCurrentWindow()});
}, false);

// 图片类
const CTuPianSerice = function () {
    this.tuPianLieBiao = [];
    this.xuanZhongTuPianMing = '';
    this.tuPianLuJing = '';
    this.tuPianKuanDu = 0;
    this.tuPianGaoDu = 0;
    this.chongMingMingShiJian = '';
    this.tuPianChongMingMing = '';
    this.yiDongLuJing = '';
    this.keYiYiDong = false;
    this.chongMingMingTuPian = function () {
        // 重命名图片
        let tuPianMingShuZu = this.tuPianLuJing.split('.');
        let houZhuiMing = tuPianMingShuZu[tuPianMingShuZu.length - 1];
        let date = new Date();
        this.chongMingMingShiJian = String(date.getFullYear());
        let tempMing = date.getMonth() + 1;
        this.chongMingMingShiJian += (tempMing < 10) ? '0' + tempMing : String(tempMing);
        tempMing = date.getDate();
        this.chongMingMingShiJian += (tempMing < 10) ? '0' + tempMing : String(tempMing);
        tempMing = date.getHours();
        this.chongMingMingShiJian += (tempMing < 10) ? '0' + tempMing : String(tempMing);
        tempMing = date.getMinutes();
        this.chongMingMingShiJian += (tempMing < 10) ? '0' + tempMing : String(tempMing);
        tempMing = date.getSeconds();
        this.chongMingMingShiJian += (tempMing < 10) ? '0' + tempMing : String(tempMing);
        this.tuPianChongMingMing = sBiaoQian.xuanZhongBiaoQianId + '_'
            + this.tuPianKuanDu + '_' + this.tuPianGaoDu + '_' + this.chongMingMingShiJian + '.' + houZhuiMing;
        this.keYiYiDong = true;
        this.yiDongLuJing = sBiaoQian.muBiaoMuLu + this.tuPianChongMingMing;
        eleMuBiaoLuJing.innerHTML = this.yiDongLuJing;
    };
};

let eleXuanZeMuLu = {};
let eleMuLuLuJing = {};

/*#####图片dom对象#####*/
// 图片列表
let eleTPList = {};
// 图片展示
let eleTPShow = {};
/*##########图片dom对象##########*/

/*#####标签页dom对象#####*/
//标签列表
let elearrBiaoQian = {};
//标签页列表
let elearrBiaoQianYe = {};
/*##########其他dom对象##########*/

// 标签页dom对象
let eleBQlist1 = {};
let eleBQlist2 = {};
let eleBQlist3 = {};

let eleXinBQId = {};
let eleXinBQMing = {};
let eleXinBQAdd = {};

// 确认移动dom对象
let eleMuBiaoLuJing = {};
let eleQueRenYiDong = {};


// 页面初始化
window.onload = function () {
    // 选择目录按钮和左侧图片列表
    eleXuanZeMuLu = document.getElementById('xuan-ze-mu-lu');
    eleXuanZeMuLu.onclick = fClickXuanZeMuLu;

    eleMuLuLuJing = document.getElementById('mu-lu-lu-jing')

    eleTPList = document.getElementById('tp-list');
    eleTPShow = document.getElementById('tp-show');
    eleTPShow.onload = fTPJu1Zhong1;

    // 初始化标签页切换
    elearrBiaoQian = document.getElementById('biao-qian-list').children;
    elearrBiaoQianYe = document.getElementById('biao-qian-ye-list').children;
    for (let ii = 0; ii < elearrBiaoQian.length; ++ii) {
        elearrBiaoQian[ii].id = 'bq-' + (ii + 1);
        elearrBiaoQian[ii].onclick = fQieHuanBQYe;
    }
    // 标签
    eleBQlist1 = document.getElementById('bq1-list');
    eleBQlist2 = document.getElementById('bq2-list');
    eleBQlist3 = document.getElementById('bq3-list');

    eleXinBQId = document.getElementById('xin-bq-id');
    eleXinBQMing = document.getElementById('xin-bq-ming');
    eleXinBQAdd = document.getElementById('xin-bq-add');
    eleXinBQAdd.onclick = fClickXinBQAdd;

    // 移动目标目录和确认移动按钮
    eleMuBiaoLuJing = document.getElementById('mu-biao-lu-jing');
    eleQueRenYiDong = document.getElementById('que-ren-yi-dong');
    eleQueRenYiDong.onclick = dianJiQueRenYiDong;
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
            let sWeiFenLeiMuLu = rMuLu.fGetWeiFenLeiMuLu()
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
    let jiShu = 1;
    for (let sTPMing of sarrTPMing) {
        // 构造图片按钮
        let tempEle = document.createElement('img');
        tempEle.id = 'tp-list-' + jiShu;
        tempEle.className = 'zuo-tu-pian-zu';
        tempEle.setAttribute('data-wen-jian-ming', sTPMing);
        tempEle.src = sWeiFenLeiMuLu + '\\' + sTPMing;
        tempEle.onclick = fClickTPItem;
        eleTPList.appendChild(tempEle);
        ++jiShu;
    }
}

/**
 * 点击事件，选择图片
 */
function fClickTPItem() {
    let sTPMing = this.getAttribute('data-wen-jian-ming');
    eleTPShow.src = rMuLu.fGetWeiFenLeiMuLu() + sTPMing;
}

/**
 * 图片居中
 */
function fTPJu1Zhong1() {
    // 获取图片原始大小
    let iTPKuan = this.naturalWidth;
    let iTPGao = this.naturalHeight;
    let oRes = rXuanRan.fTPJu1Zhong1(iTPKuan, iTPGao);
    let sStyle = 'margin-left: ' + oRes.iTPMarginLeft + 'px; margin-top: ' + oRes.iTPMarginTop + 'px';
    eleTPShow.setAttribute('style', sStyle);
}

/**
 * 点击事件，切换标签页
 */
function fQieHuanBQYe() {
    for (let ii = 0; ii < elearrBiaoQian.length; ++ii) {
        elearrBiaoQian[ii].className = 'biao-qian-an-niu';
        elearrBiaoQianYe[ii].style.display = 'none';
    }
    let iBQBS = this.id.replace('bq-', '');
    rBiaoQian.fSetXuanZhongBQBS(parseInt(iBQBS));
    elearrBiaoQian[iBQBS - 1].className = 'biao-qian-xuan-zhong';
    elearrBiaoQianYe[iBQBS - 1].style.display = 'block';
}

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
    rMuLu.fMakeBQMuLu(iXuanZhongBQBS, rBiaoQian.fGetAllXuanZhongId(),iXinBQId);
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
            rBiaoQian.fCleanXuanZhongId(iXuanZhongBQBS);
            eleBQlist2.innerHTML = '';
            eleBQlist3.innerHTML = '';
            let teleBQList = eleBQlist1.children;
            for (let ii = 0; ii < teleBQList.length; ++ii) {
                teleBQList[ii].className = 'an-niu-xiao an-niu-shan-hu-hong';
            }
        } else {
            //如果已选中的是其他标签
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
        // 二级标签
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
        // 三级标签
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
    // sTuPian.chongMingMingTuPian();
}

// 点击确认移动
function dianJiQueRenYiDong() {
    if (gEmpty(sTuPian.tuPianLuJing)) {
        alert('未选择图片');
        return;
    }
    GFs.rename(sTuPian.tuPianLuJing, sTuPian.yiDongLuJing, function (yiChang) {
        if (!gEmpty(yiChang)) {
            console.error(yiChang);
            alert('移动图片异常');
        } else {
            sTuPian.keYiYiDong = false;
            eleTuPianZhanShi.src = '';
            let xiaBiao = sTuPian.tuPianLieBiao.indexOf(sTuPian.xuanZhongTuPianMing)
            if (xiaBiao !== -1) {
                sTuPian.tuPianLieBiao.splice(xiaBiao, 1);
            }
            sTuPian.chongHuiTuPianLieBiao(sMuLu.weiFenLeiMuLu);
        }
    });
}


