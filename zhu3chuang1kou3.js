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

// 标签类
const CBiaoQianService = function () {
    this.xuanZhongBiaoQianYe = CPeiZhiConst.yiJiBiaoQianBiaoShi;
    this.xuanZhongBiaoQianId = '';
    this.muBiaoMuLu = '';
    this.huoQuBiaoQianShuJu = function () {
        // 获取保存在文件里的标签
        let thisService = this;
        let wenJianLiJing = sMuLu.biaoQianMuLu + CPeiZhiConst.wenJianMingLieBiao.fenLeiBiaoQian;
        GFs.readFile(wenJianLiJing, 'utf8', function (yiChang, biaoQianShuJu) {
            if (yiChang === null) {
                try {
                    thisService.biaoQianShuJu = JSON.parse(biaoQianShuJu);
                    thisService.yiJiBiaoQianLieBiao = thisService.gouZaoBiaoQianShuJu(thisService.biaoQianShuJu);
                    thisService.gouZaoBiaoQian(CPeiZhiConst.yiJiBiaoQianBiaoShi);
                } catch (exception) {
                    console.warn(exception.message);
                }
            }
        });
    };
    this.gouZaoBiaoQianShuJu = function (biaoQianLieBiao) {
        let shuJu = {};
        let tempKeyLieBiao = Object.keys(biaoQianLieBiao);
        if (tempKeyLieBiao.length > 0) {
            for (let kBiaoQian of tempKeyLieBiao) {
                shuJu[kBiaoQian] = biaoQianLieBiao[kBiaoQian].ming_cheng;
            }
        }
        return shuJu;
    };
}

// 图片列表dom对象
let eleXuanZeMuLu = {};
let eleMuLuLuJing = {};
let eleTuPianLieBiao = {};
// 图片dom对象
let eleTuPianZhanShi = {};
// 标签页dom对象
let eleYiJiBiaoQian = {};
let eleErJiBiaoQian = {};
let eleSanJiBiaoQian = {};
let eleXinBiaoQianIdShuRu = {};
let eleXinBiaoQianMingShuRu = {};
let eleXinBiaoQianTianJia = {};
// 确认移动dom对象
let eleMuBiaoLuJing = {};
let eleQueRenYiDong = {};

let arrBiaoQian = [];
let arrBiaoQianYe = [];


// 页面初始化
window.onload = function () {
    // 选择目录按钮和左侧图片列表
    eleXuanZeMuLu = document.getElementById('xuan-ze-mu-lu');
    eleXuanZeMuLu.onclick = fDianJiXuanZeMuLu;
    eleMuLuLuJing = document.getElementById('mu-lu-lu-jing')
    eleTuPianLieBiao = document.getElementById('tu-pian-lie-biao');
    // 图片展示
    eleTuPianZhanShi = document.getElementById('tu-pian-zhan-shi');
    eleTuPianZhanShi.onload = fTuPianJuZhong;
    // 初始化标签页切换
    arrBiaoQian = document.getElementById('biao-qian-lie-biao').children;
    arrBiaoQianYe = document.getElementById('biao-qian-yei-lie-biao').children;
    for (let i = 0; i < arrBiaoQian.length; i++) {
        arrBiaoQian[i].id = 'biao-qian-' + i;
        arrBiaoQian[i].onclick = fQieHuanBiaoQianYe;
    }
    // 标签
    eleYiJiBiaoQian = document.getElementById('yi-ji-lie-biao');
    eleErJiBiaoQian = document.getElementById('er-ji-lie-biao');
    eleSanJiBiaoQian = document.getElementById('san-ji-lie-biao');
    eleXinBiaoQianIdShuRu = document.getElementById('xin-biao-qian-id');
    eleXinBiaoQianMingShuRu = document.getElementById('xin-biao-qian-ming');
    eleXinBiaoQianTianJia = document.getElementById('xin-biao-qian-tian-jia');
    eleXinBiaoQianTianJia.onclick = fDianJiTianJiaBiaoQian;
    // 移动目标目录和确认移动按钮
    eleMuBiaoLuJing = document.getElementById('mu-biao-lu-jing');
    eleQueRenYiDong = document.getElementById('que-ren-yi-dong');
    eleQueRenYiDong.onclick = dianJiQueRenYiDong;
}

function fDianJiXuanZeMuLu() {
    // 点击事件，点击选择目录
    rDialog.showOpenDialog({
        'title': '请选择操作目录',
        'properties': ['openDirectory']
    }).then(function (result) {
        if (rHelpers.fEmpty(result.filePaths[0])) {
            console.log('未选择操作目录');
        } else {
            rMuLu.fSetCaoZuoMuLu(result.filePaths[0]);
            let sWeiFenLeiMuLu = rMuLu.fGetWeiFenLeiMuLu()
            let sarrTuPianMing = rTuPian.fJiaZaiTuPianLieBiao(rFs, sWeiFenLeiMuLu);
            rXuanRan.fTuPianLieBiao(eleTuPianLieBiao, sWeiFenLeiMuLu, sarrTuPianMing, fDianJiXuanZeTuPian);
        }
    });
}

// 点击事件，点击选择图片
function fDianJiXuanZeTuPian() {
    let sTuPianMing = this.getAttribute('data-wen-jian-ming');
    eleTuPianZhanShi.src = rMuLu.fGetWeiFenLeiMuLu() + sTuPianMing;
}

function fTuPianJuZhong() {
    rXuanRan.fTuPianJuZhong(eleTuPianZhanShi);
}

// 切换标签页
function fQieHuanBiaoQianYe() {
    // 点击事件，切换标签页
    for (let j = 0; j < arrBiaoQian.length; j++) {
        arrBiaoQian[j].className = 'biao-qian-an-niu';
        arrBiaoQianYe[j].style.display = 'none';
    }
    let idIndex = this.id.replace('biao-qian-', '');
    rBiaoQian.fSetXuanZhongBQBS(parseInt(idIndex));
    arrBiaoQian[idIndex].className = 'biao-qian-xuan-zhong';
    arrBiaoQianYe[idIndex].style.display = 'block';
}

function fDianJiTianJiaBiaoQian() {
    if (rMuLu.fCheckCaoZuoMuLu()) {
        alert('未选择操作目录');
        return;
    }
    let iXinBianQianId = eleXinBiaoQianIdShuRu.value;
    let sXinBiaoQianMing = eleXinBiaoQianMingShuRu.value;
    rBiaoQian.fTianJiaBiaoQian(iXinBianQianId, sXinBiaoQianMing);
    // // 保存标签数据
    // GFs.opendir(sMuLu.biaoQianMuLu, function (yiChang, muLu) {
    //     if (yiChang !== null) {
    //         console.warn(yiChang);
    //         GFs.mkdirSync(sMuLu.biaoQianMuLu);
    //     } else {
    //         let tempMuLu = muLu.close();
    //     }
    //     GFs.writeFileSync(sMuLu.biaoQianMuLu + CPeiZhiConst.wenJianMingLieBiao.fenLeiBiaoQian, JSON.stringify(sBiaoQian.biaoQianShuJu), 'utf8');
    // });
    // // 创建标签对应目录
    // GFs.opendir(xinMuBiaoMuLu, function (yiChang, muLu) {
    //     if (yiChang !== null) {
    //         console.warn(yiChang);
    //         GFs.mkdirSync(xinMuBiaoMuLu, {recursive: true});
    //     } else {
    //         let tempMuLu = muLu.close();
    //     }
    // });
    let iXuanZhongBQBS = rBiaoQian.fGetXuanZhongBQBS();
    if (iXuanZhongBQBS === rBiaoQian.cConfig.iYiJiBiaoQianBiaoShi) {
        rXuanRan.fBiaoQianLieBiao(iXuanZhongBQBS, eleYiJiBiaoQian, rBiaoQian.fGetDaiGouZaoBiaoQian());
    } else if (iXuanZhongBQBS === rBiaoQian.cConfig.iErJiBiaoQianBiaoShi) {
        rXuanRan.fBiaoQianLieBiao(iXuanZhongBQBS, eleErJiBiaoQian, rBiaoQian.fGetDaiGouZaoBiaoQian());
    } else if (iXuanZhongBQBS === rBiaoQian.cConfig.iSanJiBiaoQianBiaoShi) {
        rXuanRan.fBiaoQianLieBiao(iXuanZhongBQBS, eleSanJiBiaoQian, rBiaoQian.fGetDaiGouZaoBiaoQian());
    }
    // 重置输入框
    eleXinBiaoQianIdShuRu.value = '';
    eleXinBiaoQianMingShuRu.value = '';
}

// 点击分类标签
function dianJiFenLeiBiaoQian() {
    if (gEmpty(sMuLu.caoZuoMuLu)) {
        alert('未选择操作目录');
        return;
    }
    sBiaoQian.xuanZhongBiaoQianId = this.id;
    let biaoQianJiBie = parseInt(this.getAttribute('data-level'));
    if (biaoQianJiBie === CPeiZhiConst.yiJiBiaoQianBiaoShi) {
        // 一级标签互斥，同时获取二级标签
        if (sBiaoQian.yiJiXuanZhongId === this.id) {
            sBiaoQian.yiJiXuanZhongId = '';
            sBiaoQian.erJiXuanZhongId = '';
            eleErJiBiaoQian.innerHTML = '';
            sBiaoQian.erJiBiaoQianLieBiao = {};
            sBiaoQian.sanJiXuanZhongId = '';
            eleSanJiBiaoQian.innerHTML = '';
            sBiaoQian.sanJiBiaoQianLieBiao = {};
            sBiaoQian.muBiaoMuLu = sMuLu.caoZuoMuLu + '\\';
            let yiJiLieBiao = document.getElementById('yi-ji-lie-biao').children;
            for (let i = 0; i < yiJiLieBiao.length; ++i) {
                yiJiLieBiao[i].className = 'an-niu-xiao an-niu-shan-hu-hong';
            }
        } else {
            sBiaoQian.yiJiXuanZhongId = this.id;
            sBiaoQian.erJiBiaoQianLieBiao = sBiaoQian.gouZaoBiaoQianShuJu(sBiaoQian.biaoQianShuJu[sBiaoQian.yiJiXuanZhongId].zi_lie_biao);
            sBiaoQian.gouZaoBiaoQian(CPeiZhiConst.erJiBiaoQianBiaoShi);
            sBiaoQian.muBiaoMuLu = sMuLu.caoZuoMuLu + '\\' + sBiaoQian.yiJiXuanZhongId + '\\';
            let yiJiLieBiao = document.getElementById('yi-ji-lie-biao').children;
            for (let i = 0; i < yiJiLieBiao.length; ++i) {
                if (yiJiLieBiao[i].id === this.id) {
                    yiJiLieBiao[i].className = 'an-niu-xiao an-niu-zi';
                } else {
                    yiJiLieBiao[i].className = 'an-niu-xiao an-niu-shan-hu-hong';
                }
            }

        }
    } else if (biaoQianJiBie === CPeiZhiConst.erJiBiaoQianBiaoShi) {
        // 二级标签互斥，同时获取三级标签
        if (sBiaoQian.erJiXuanZhongId === this.id) {
            sBiaoQian.erJiXuanZhongId = '';
            sBiaoQian.sanJiXuanZhongId = '';
            eleSanJiBiaoQian.innerHTML = '';
            sBiaoQian.sanJiBiaoQianLieBiao = {};
            sBiaoQian.muBiaoMuLu = sMuLu.caoZuoMuLu + '\\' + sBiaoQian.yiJiXuanZhongId + '\\'
            let erJiLieBiao = document.getElementById('er-ji-lie-biao').children;
            for (let i = 0; i < erJiLieBiao.length; i++) {
                erJiLieBiao[i].className = 'an-niu-xiao an-niu-shan-hu-hong';
            }
        } else {
            sBiaoQian.erJiXuanZhongId = this.id;
            sBiaoQian.sanJiBiaoQianLieBiao = sBiaoQian.gouZaoBiaoQianShuJu(sBiaoQian.biaoQianShuJu[sBiaoQian.yiJiXuanZhongId].zi_lie_biao[sBiaoQian.erJiXuanZhongId].zi_lie_biao);
            sBiaoQian.gouZaoBiaoQian(CPeiZhiConst.sanJiBiaoQianBiaoShi);
            sBiaoQian.muBiaoMuLu = sMuLu.caoZuoMuLu + '\\' + sBiaoQian.yiJiXuanZhongId + '\\'
                + sBiaoQian.erJiXuanZhongId + '\\';
            let erJiLieBiao = document.getElementById('er-ji-lie-biao').children;
            for (let i = 0; i < erJiLieBiao.length; i++) {
                if (erJiLieBiao[i].id === this.id) {
                    erJiLieBiao[i].className = 'an-niu-xiao an-niu-zi';
                } else {
                    erJiLieBiao[i].className = 'an-niu-xiao an-niu-shan-hu-hong';
                }
            }
        }
    } else if (biaoQianJiBie === CPeiZhiConst.sanJiBiaoQianBiaoShi) {
        // 三级标签互斥
        if (sBiaoQian.sanJiXuanZhongId === this.id) {
            sBiaoQian.sanJiXuanZhongId = '';
            sBiaoQian.muBiaoMuLu = sMuLu.caoZuoMuLu + '\\' + sBiaoQian.yiJiXuanZhongId + '\\'
                + sBiaoQian.erJiXuanZhongId + '\\';
            let sanJiLieBiao = document.getElementById('san-ji-lie-biao').children;
            for (let i = 0; i < sanJiLieBiao.length; i++) {
                sanJiLieBiao[i].className = 'an-niu-xiao an-niu-shan-hu-hong';
            }
        } else {
            sBiaoQian.sanJiXuanZhongId = this.id;
            sBiaoQian.muBiaoMuLu = sMuLu.caoZuoMuLu + '\\' + sBiaoQian.yiJiXuanZhongId + '\\'
                + sBiaoQian.erJiXuanZhongId + '\\' + sBiaoQian.sanJiXuanZhongId + '\\';
            let sanJiLieBiao = document.getElementById('san-ji-lie-biao').children;
            for (let i = 0; i < sanJiLieBiao.length; i++) {
                if (sanJiLieBiao[i].id === this.id) {
                    sanJiLieBiao[i].className = 'an-niu-xiao an-niu-zi';
                } else {
                    sanJiLieBiao[i].className = 'an-niu-xiao an-niu-shan-hu-hong';
                }
            }
        }
    }
    sTuPian.chongMingMingTuPian();
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