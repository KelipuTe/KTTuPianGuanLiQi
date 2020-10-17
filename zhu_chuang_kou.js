// 输出开发环境参数
console.log('Node:' + process.versions.node);
console.log('Chrome:' + process.versions.chrome);
console.log('Electron:' + process.versions.electron);

// 全局常量
const GElectron = require('electron');
const GRemote = GElectron.remote;
const GMenu = GRemote.Menu;
const GDialog = GRemote.dialog;
const GIpcRenderer = GElectron.ipcRenderer;
const GFs = require('fs');

// 配置常量
const CPeiZhiConst = {
    muLuLieBiao: {
        weiFenLei: 'WeiFenLei\\',
        biaoQian: 'BiaoQian\\'
    },
    wenJianMingLieBiao: {
        fenLeiBiaoQian: 'fenLeiBiaoQian.json',
        biaoJiBiaoQian: 'biaoJiBiaoQian.json',
    },

    tuPianShuLiangMax: 20,
    tuPianKuanDuMax: 900,
    tuPianGaoDuMax: 800,

    yiJiBiaoQianBiaoShi: 0,
    erJiBiaoQianBiaoShi: 1,
    sanJiBiaoQianBiaoShi: 2
};

// 目录类
const CMuLuService = function () {
    this.caoZuoMuLu = '';
    this.weiFenLeiMuLu = '';
    this.biaoQianMuLu = '';
    this.sheZhiCaoZuoMuLu = function (caoZuoMuLu) {
        // 设置操作目录
        this.caoZuoMuLu = caoZuoMuLu;
        this.weiFenLeiMuLu = this.caoZuoMuLu + '\\' + CPeiZhiConst.muLuLieBiao.weiFenLei;
        this.biaoQianMuLu = this.caoZuoMuLu + '\\' + CPeiZhiConst.muLuLieBiao.biaoQian;
    };
};

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
    this.huoQuTuPianShuJu = function (tuPianMuLuQuan) {
        // 获取图片列表
        let thisService = this;
        let jiShu = 1;
        GFs.readdir(tuPianMuLuQuan, function (yiChang, wenJianLieBiao) {
            // 先初始化
            thisService.tuPianLieBiao = [];
            eleTuPianLieBiao.innerHTML = '';
            if (yiChang === null) {
                // 没有异常就继续
                for (let wenJianMing of wenJianLieBiao) {
                    if (jiShu > CPeiZhiConst.tuPianShuLiangMax) {
                        break;
                    }
                    thisService.tuPianLieBiao.push(wenJianMing);
                    // 构造图片列表按钮
                    let tempEle = document.createElement('button');
                    tempEle.id = 'tu-pian-lie-biao-' + jiShu;
                    tempEle.type = 'button';
                    tempEle.className = 'zuo-tu-pian-zu';
                    tempEle.innerHTML = wenJianMing;
                    tempEle.onclick = dianJiXuanZeTuPian;
                    eleTuPianLieBiao.appendChild(tempEle);
                    ++jiShu;
                }
            } else {
                console.error(yiChang)
            }
        });
    };
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
    this.biaoQianLieBiao = {};
    this.biaoQianYeLieBiao = {};
    this.xuanZhongBiaoQianYe = CPeiZhiConst.yiJiBiaoQianBiaoShi;
    this.xuanZhongBiaoQianId = '';
    this.biaoQianShuJu = {};
    this.yiJiBiaoQianLieBiao = {};
    this.erJiBiaoQianLieBiao = {};
    this.sanJiBiaoQianLieBiao = {};
    this.yiJiXuanZhongId = '';
    this.erJiXuanZhongId = '';
    this.sanJiXuanZhongId = '';
    this.muBiaoMuLu = '';
    this.huoQuBiaoQianShuJu = function () {
        // 获取保存在文件里的标签
        let thisService = this;
        let wenJianLiJing = sMuLu.biaoQianMuLu + CPeiZhiConst.wenJianMingLieBiao.fenLeiBiaoQian;
        GFs.readFile(wenJianLiJing, 'utf8', function (yiChang, biaoQianShuJu) {
            if (yiChang === null) {
                thisService.biaoQianShuJu = JSON.parse(biaoQianShuJu);
                thisService.yiJiBiaoQianLieBiao = thisService.gouZaoBiaoQianShuJu(thisService.biaoQianShuJu);
                thisService.gouZaoBiaoQian(CPeiZhiConst.yiJiBiaoQianBiaoShi);
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
    this.gouZaoBiaoQian = function (biaoQianJiBie) {
        // 构造标签列表按钮
        let daiGouZaoLieBiao = {};
        if (biaoQianJiBie === CPeiZhiConst.yiJiBiaoQianBiaoShi) {
            // 一级
            eleYiJiBiaoQian.innerHTML = '';
            daiGouZaoLieBiao = this.yiJiBiaoQianLieBiao;
        } else if (biaoQianJiBie === CPeiZhiConst.erJiBiaoQianBiaoShi) {
            // 二级
            eleErJiBiaoQian.innerHTML = '';
            daiGouZaoLieBiao = this.erJiBiaoQianLieBiao;
        } else if (biaoQianJiBie === CPeiZhiConst.sanJiBiaoQianBiaoShi) {
            // 三级
            eleSanJiBiaoQian.innerHTML = '';
            daiGouZaoLieBiao = this.sanJiBiaoQianLieBiao;
        }
        for (let kBiaoQian in daiGouZaoLieBiao) {
            // 构造标签按钮
            let tempEle = document.createElement('button');
            tempEle.id = kBiaoQian;
            tempEle.type = 'button';
            tempEle.innerHTML = daiGouZaoLieBiao[kBiaoQian];
            tempEle.className = 'an-niu-xiao an-niu-shan-hu-hong';
            tempEle.setAttribute('data-level', biaoQianJiBie);
            // 绑定标签点击事件
            tempEle.onclick = dianJiFenLeiBiaoQian;
            if (biaoQianJiBie === CPeiZhiConst.yiJiBiaoQianBiaoShi) {
                eleYiJiBiaoQian.appendChild(tempEle);
            } else if (biaoQianJiBie === CPeiZhiConst.erJiBiaoQianBiaoShi) {
                eleErJiBiaoQian.appendChild(tempEle);
            } else if (biaoQianJiBie === CPeiZhiConst.sanJiBiaoQianBiaoShi) {
                eleSanJiBiaoQian.appendChild(tempEle);
            }
        }
    };
}

// 类实例
let sMuLu = new CMuLuService();
let sTuPian = new CTuPianSerice();
let sBiaoQian = new CBiaoQianService();
// 图片列表dom对象
let eleXuanZeMuLu = {};
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

// 全局方法
// 判断空值
function gEmpty(bianLiang) {
    if (bianLiang === undefined) {
        return true;
    } else if (bianLiang === null) {
        return true;
    } else if (bianLiang === '') {
        return true;
    }
    return false;
}

// 右击菜单
const youJiCaiDanMuBan = [
    {
        label: '打开调试',
        accelerator: 'F12',
        click: function () {
            // 给主进程发送消息
            GIpcRenderer.send('da-kai-tiao-shi', '申请打开调试');
        }
    }
]
let youJiCaiDan = GMenu.buildFromTemplate(youJiCaiDanMuBan);
// 监听右击事件
window.addEventListener('contextmenu', function (event) {
    // 取消事件的默认动作
    event.preventDefault();
    // 在目标窗口中弹出菜单
    youJiCaiDan.popup({window: GRemote.getCurrentWindow()});
}, false);

// 页面初始化
window.onload = function () {
    // 选择目录按钮和左侧图片列表
    eleXuanZeMuLu = document.getElementById('xuan-ze-mu-lu');
    eleXuanZeMuLu.onclick = dianJiXuanZeMuLu;
    eleTuPianLieBiao = document.getElementById('tu-pian-lie-biao');
    // 图片展示
    eleTuPianZhanShi = document.getElementById('tu-pian-zhan-shi');
    eleTuPianZhanShi.onload = jiSuanPianYiLiang;
    // 初始化标签页切换
    sBiaoQian.biaoQianLieBiao = document.getElementById('biao-qian-lie-biao').children;
    sBiaoQian.biaoQianYeLieBiao = document.getElementById('biao-qian-yei-lie-biao').children;
    for (let i = 0; i < sBiaoQian.biaoQianLieBiao.length; i++) {
        sBiaoQian.biaoQianLieBiao[i].id = 'biao-qian-' + i;
        sBiaoQian.biaoQianLieBiao[i].onclick = qieHuanBiaoQianYe;
    }
    // 标签
    eleYiJiBiaoQian = document.getElementById('yi-ji-lie-biao');
    eleErJiBiaoQian = document.getElementById('er-ji-lie-biao');
    eleSanJiBiaoQian = document.getElementById('san-ji-lie-biao');
    eleXinBiaoQianIdShuRu = document.getElementById('xin-biao-qian-id');
    eleXinBiaoQianMingShuRu = document.getElementById('xin-biao-qian-ming');
    eleXinBiaoQianTianJia = document.getElementById('xin-biao-qian-tian-jia');
    eleXinBiaoQianTianJia.onclick = dianJiTianJiaBiaoQian;
    // 移动目标目录和确认移动按钮
    eleMuBiaoLuJing = document.getElementById('mu-biao-lu-jing');
    eleQueRenYiDong = document.getElementById('que-ren-yi-dong');
    eleQueRenYiDong.onclick = dianJiQueRenYiDong;
}

function dianJiXuanZeMuLu() {
    // 点击事件，点击选择目录
    GDialog.showOpenDialog({
        'title': '请选择操作目录',
        'properties': ['openDirectory']
    }).then(function (result) {
        sMuLu.sheZhiCaoZuoMuLu(result.filePaths[0]);
        sTuPian.huoQuTuPianShuJu(sMuLu.weiFenLeiMuLu);
        sBiaoQian.huoQuBiaoQianShuJu();
    });
}

function dianJiXuanZeTuPian() {
    // 点击事件，点击选择图片
    sTuPian.xuanZhongTuPianMing = this.textContent;
    sTuPian.tuPianLuJing = sMuLu.weiFenLeiMuLu + '\\' + this.textContent;
    eleTuPianZhanShi.src = sTuPian.tuPianLuJing;
}

// 图片加载的时候计算偏移量，让图片居中
function jiSuanPianYiLiang() {
    // 获取图片原始大小
    sTuPian.tuPianKuanDu = this.naturalWidth;
    sTuPian.tuPianGaoDu = this.naturalHeight;
    let imgWidth = this.naturalWidth;
    let imgHeight = this.naturalHeight;
    let imgMarginLeft = 0;
    let imgMarginTop = 0;
    if (imgWidth <= CPeiZhiConst.tuPianKuanDuMax && imgHeight <= CPeiZhiConst.tuPianGaoDuMax) {
        // 宽高都小于限制，直接计算偏移量
        imgMarginLeft = Math.round((CPeiZhiConst.tuPianKuanDuMax - imgWidth) / 2 * 100) / 100;
        imgMarginTop = Math.round((CPeiZhiConst.tuPianGaoDuMax - imgHeight) / 2 * 100) / 100;
    } else if (imgWidth <= CPeiZhiConst.tuPianKuanDuMax && imgHeight > CPeiZhiConst.tuPianGaoDuMax) {
        // 只有宽度超过限制，单独计算高度偏移量
        imgWidth = Math.round(imgWidth * (CPeiZhiConst.tuPianGaoDuMax / imgHeight));
        imgMarginLeft = Math.round((CPeiZhiConst.tuPianKuanDuMax - imgWidth) / 2 * 100) / 100;
    } else if (imgWidth > CPeiZhiConst.tuPianKuanDuMax && imgHeight <= CPeiZhiConst.tuPianGaoDuMax) {
        // 只有高度超过限制，单独计算宽度偏移量
        imgHeight = Math.round(imgHeight * (CPeiZhiConst.tuPianKuanDuMax / imgWidth));
        imgMarginTop = Math.round((CPeiZhiConst.tuPianGaoDuMax - imgHeight) / 2 * 100) / 100;
    } else if (imgWidth > CPeiZhiConst.tuPianKuanDuMax && imgHeight > CPeiZhiConst.tuPianGaoDuMax) {
        // 只有宽高都超过限制，判断哪个超的更多，需要同比压缩
        if ((imgWidth / CPeiZhiConst.tuPianKuanDuMax) >= (imgHeight / CPeiZhiConst.tuPianGaoDuMax)) {
            imgHeight = Math.round(imgHeight * (CPeiZhiConst.tuPianKuanDuMax / imgWidth));
            imgMarginTop = Math.round((CPeiZhiConst.tuPianGaoDuMax - imgHeight) / 2 * 100) / 100;
        } else {
            imgWidth = Math.round(imgWidth * (CPeiZhiConst.tuPianGaoDuMax / imgHeight));
            imgMarginLeft = Math.round((CPeiZhiConst.tuPianKuanDuMax - imgWidth) / 2 * 100) / 100;
        }
    }
    this.setAttribute('style', 'margin-left: ' + imgMarginLeft + 'px; margin-top: ' + imgMarginTop + 'px');
}

// 切换标签页
function qieHuanBiaoQianYe() {
    // 点击事件，切换标签页
    for (let j = 0; j < sBiaoQian.biaoQianLieBiao.length; j++) {
        sBiaoQian.biaoQianLieBiao[j].className = 'biao-qian-an-niu';
        sBiaoQian.biaoQianYeLieBiao[j].style.display = 'none';
    }
    let idIndex = this.id.replace('biao-qian-', '');
    sBiaoQian.xuanZhongBiaoQianYe = parseInt(idIndex);
    sBiaoQian.biaoQianLieBiao[idIndex].className = 'biao-qian-xuan-zhong';
    sBiaoQian.biaoQianYeLieBiao[idIndex].style.display = 'block';
}

// 点击添加标签
function dianJiTianJiaBiaoQian() {
    let xinBianQianId = eleXinBiaoQianIdShuRu.value;
    let xinBiaoQianMing = eleXinBiaoQianMingShuRu.value;
    let xinMuBiaoMuLu = sMuLu.caoZuoMuLu;
    if (sBiaoQian.xuanZhongBiaoQianYe === CBiaoQianService.yiJiBiaoQianBiaoShi) {
        // 一级
        sBiaoQian.biaoQianShuJu[xinBianQianId] = {};
        sBiaoQian.biaoQianShuJu[xinBianQianId].ming_cheng = xinBiaoQianMing;
        sBiaoQian.biaoQianShuJu[xinBianQianId].zi_lie_biao = {};
        sBiaoQian.yiJiBiaoQianLieBiao[xinBianQianId] = xinBiaoQianMing;
        xinMuBiaoMuLu = xinMuBiaoMuLu + '\\' + xinBianQianId;
    } else if (sBiaoQian.xuanZhongBiaoQianYe === CBiaoQianService.erJiBiaoQianBiaoShi) {
        // 二级
        if (gEmpty(sBiaoQian.yiJiXuanZhongId)) {
            alert('一级标签缺失');
        }
        sBiaoQian.biaoQianShuJu[sBiaoQian.yiJiXuanZhongId].zi_lie_biao[xinBianQianId] = {};
        sBiaoQian.biaoQianShuJu[sBiaoQian.yiJiXuanZhongId].zi_lie_biao[xinBianQianId].ming_cheng = xinBiaoQianMing;
        sBiaoQian.biaoQianShuJu[sBiaoQian.yiJiXuanZhongId].zi_lie_biao[xinBianQianId].zi_lie_biao = {};
        sBiaoQian.erJiBiaoQianLieBiao[xinBianQianId] = xinBiaoQianMing;
        xinMuBiaoMuLu = xinMuBiaoMuLu + '\\' + sBiaoQian.yiJiXuanZhongId + '\\' + xinBianQianId;
    } else if (sBiaoQian.xuanZhongBiaoQianYe === CBiaoQianService.sanJiBiaoQianBiaoShi) {
        // 三级
        if (gEmpty(sBiaoQian.yiJiXuanZhongId)) {
            alert('一级标签缺失');
        }
        if (gEmpty(sBiaoQian.erJiXuanZhongId)) {
            alert('二级标签缺失');
        }
        sBiaoQian.biaoQianShuJu[sBiaoQian.yiJiXuanZhongId].zi_lie_biao[sBiaoQian.erJiXuanZhongId].zi_lie_biao[xinBianQianId] = {};
        sBiaoQian.biaoQianShuJu[sBiaoQian.yiJiXuanZhongId].zi_lie_biao[sBiaoQian.erJiXuanZhongId].zi_lie_biao[xinBianQianId].ming_cheng = xinBiaoQianMing;
        sBiaoQian.sanJiBiaoQianLieBiao[xinBianQianId] = xinBiaoQianMing;
        xinMuBiaoMuLu = xinMuBiaoMuLu + '\\' + sBiaoQian.yiJiXuanZhongId + '\\' + sBiaoQian.erJiXuanZhongId + '\\' + xinBianQianId;
    }
    // 保存标签数据
    GFs.opendir(sMuLu.biaoQianMuLu, function (yiChang, muLu) {
        if (yiChang !== null) {
            console.warn(yiChang);
            GFs.mkdirSync(sMuLu.biaoQianMuLu);
        } else {
            let a = muLu.close();
            console.log(a);
        }
        GFs.writeFileSync(sMuLu.biaoQianMuLu + CPeiZhiConst.wenJianMingLieBiao.fenLeiBiaoQian, JSON.stringify(sBiaoQian.biaoQianShuJu), 'utf8');
    });
    // 创建标签对应目录
    GFs.opendir(xinMuBiaoMuLu, function (yiChang, muLu) {
        if (yiChang !== null) {
            console.warn(yiChang);
            GFs.mkdirSync(xinMuBiaoMuLu);
        } else {
            let a = muLu.close();
            console.log(a);
        }
    });
    sBiaoQian.gouZaoBiaoQian(sBiaoQian.xuanZhongBiaoQianYe);
    // 重置输入框
    eleXinBiaoQianIdShuRu.value = '';
    eleXinBiaoQianMingShuRu.value = '';
}

// 点击分类标签
function dianJiFenLeiBiaoQian() {
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
            console.log(sBiaoQian.erJiBiaoQianLieBiao);
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
            console.log(sBiaoQian.biaoQianShuJu[sBiaoQian.yiJiXuanZhongId]);

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
        }
        let xiaBiao = sTuPian.tuPianLieBiao.indexOf(sTuPian.xuanZhongTuPianMing)
        if (xiaBiao !== -1) {
            sTuPian.tuPianLieBiao.splice(xiaBiao, 1);
        }
        sTuPian.keYiYiDong = false;
    });
}