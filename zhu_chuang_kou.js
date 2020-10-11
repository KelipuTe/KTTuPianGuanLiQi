// 输出开发环境参数
console.log('Node:' + process.versions.node);
console.log('Chrome:' + process.versions.chrome);
console.log('Electron:' + process.versions.electron);

// 全局变量
const GElectron = require('electron');
const GRemote = GElectron.remote;
const GMenu = GRemote.Menu;
const GDialog = GRemote.dialog;
const GIpcRenderer = GElectron.ipcRenderer;
const GFs = require('fs');

// 配置类
const CPeiZhiService = {
    muLuLieBiao: {
        weiFenLei: 'WeiFenLei\\',
        biaoQian: 'BiaoQian\\'
    },
    wenJianMingLieBiao: {
        fenLeiBiaoQian: 'fenLeiBiaoQian.json',
        biaoJiBiaoQian: 'biaoJiBiaoQian.json',
    },
    createNew: function () {
        let newService = {};
        newService.caoZuoMuLu = '';
        newService.weiFenLeiMuLu = '';
        newService.biaoQianMuLu = '';
        newService.sheZhiCaoZuoMuLu = function (caoZuoMuLu) {
            this.caoZuoMuLu = caoZuoMuLu;
            this.weiFenLeiMuLu = this.caoZuoMuLu + '\\' + CPeiZhiService.muLuLieBiao.weiFenLei;
            this.biaoQianMuLu = this.caoZuoMuLu + '\\' + CPeiZhiService.muLuLieBiao.biaoQian;
        };
        return newService;
    }
}

// 图片类
const CTuPianService = {
    tuPianShuLiang: 20,
    tuPianKuanDuMax: 900,
    tuPianGaoDuMax: 800,
    createNew: function () {
        let newService = {};
        newService.tuPianLieBiao = [];
        newService.tuPianMing = '';
        newService.tuPianLuJing = '';
        newService.tuPianLuJing = '';
        newService.tuPianKuanDu = 0;
        newService.tuPianGaoDu = 0;
        newService.chongMingMingShiJian = '';
        newService.tuPianChongMingMing = '';
        newService.keYiYiDong = false;
        newService.huoQuTuPianShuJu = function (tuPianMuLuQuan) {
            // 获取图片列表
            let jiShu = 1;
            GFs.readdir(tuPianMuLuQuan, function (yiChang, wenJianLieBiao) {
                // 先初始化
                this.tuPianLieBiao = [];
                eleTuPianLieBiao.innerHTML = '';
                if (yiChang === null) {
                    // 没有异常就继续
                    for (let wenJianMing of wenJianLieBiao) {
                        if (jiShu > CTuPianService.tuPianShuLiang) {
                            break;
                        }
                        this.tuPianLieBiao.push(wenJianMing);
                        // 构造图片列表按钮
                        let tempEle = document.createElement('button');
                        tempEle.id = 'tu-pian-lie-biao-' + jiShu;
                        tempEle.type = 'button';
                        tempEle.className = 'an-niu-tu-pian';
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
        return newService;
    }
}

// 标签类
const CBiaoQianService = {
    createNew: function () {
        let newService = {};
        newService.biaoQianLieBiao = {};
        newService.biaoQianYeLieBiao = {};
        newService.xianZhongBiaoQianYe = 0;
        newService.biaoQianShuJu = {};
        newService.yiJiBiaoQian = {};
        newService.erJiBiaoQian = {};
        newService.sanJiBiaoQian = {};
        newService.yiJiXuanZhongId = '';
        newService.erJiXuanZhongId = '';
        newService.sanJiXuanZhongId = '';
        return newService;
    }
}

// 类实例
let sPeiZhi = CPeiZhiService.createNew();
let sTuPian = CTuPianService.createNew();
let sBiaoQian = CBiaoQianService.createNew();
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

// 点击选择目录
function dianJiXuanZeMuLu() {
    GDialog.showOpenDialog({
        'title': '请选择操作目录',
        'properties': ['openDirectory']
    }).then(function (result) {
        sPeiZhi.sheZhiCaoZuoMuLu(result.filePaths[0]);
        sTuPian.huoQuTuPianShuJu(sPeiZhi.weiFenLeiMuLu);
        // huoQuBiaoQianShuJu();
    });
}

// 点击选择图片
function dianJiXuanZeTuPian() {
    sTuPian.tuPianMing = this.textContent;
    sTuPian.tuPianLuJing = sPeiZhi.weiFenLeiMuLu + '\\' + this.textContent;
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
    if (imgWidth <= CTuPianService.tuPianKuanDuMax && imgHeight <= CTuPianService.tuPianGaoDuMax) {
        // 宽高都小于限制，直接计算偏移量
        imgMarginLeft = Math.round((CTuPianService.tuPianKuanDuMax - imgWidth) / 2 * 100) / 100;
        imgMarginTop = Math.round((CTuPianService.tuPianGaoDuMax - imgHeight) / 2 * 100) / 100;
    } else if (imgWidth <= CTuPianService.tuPianKuanDuMax && imgHeight > CTuPianService.tuPianGaoDuMax) {
        // 只有宽度超过限制，单独计算高度偏移量
        imgWidth = Math.round(imgWidth * (CTuPianService.tuPianGaoDuMax / imgHeight));
        imgMarginLeft = Math.round((CTuPianService.tuPianKuanDuMax - imgWidth) / 2 * 100) / 100;
    } else if (imgWidth > CTuPianService.tuPianKuanDuMax && imgHeight <= CTuPianService.tuPianGaoDuMax) {
        // 只有高度超过限制，单独计算宽度偏移量
        imgHeight = Math.round(imgHeight * (CTuPianService.tuPianKuanDuMax / imgWidth));
        imgMarginTop = Math.round((CTuPianService.tuPianGaoDuMax - imgHeight) / 2 * 100) / 100;
    } else if (imgWidth > CTuPianService.tuPianKuanDuMax && imgHeight > CTuPianService.tuPianGaoDuMax) {
        // 只有宽高都超过限制，判断哪个超的更多，需要同比压缩
        if ((imgWidth / CTuPianService.tuPianKuanDuMax) >= (imgHeight / CTuPianService.tuPianGaoDuMax)) {
            imgHeight = Math.round(imgHeight * (CTuPianService.tuPianKuanDuMax / imgWidth));
            imgMarginTop = Math.round((CTuPianService.tuPianGaoDuMax - imgHeight) / 2 * 100) / 100;
        } else {
            imgWidth = Math.round(imgWidth * (CTuPianService.tuPianGaoDuMax / imgHeight));
            imgMarginLeft = Math.round((CTuPianService.tuPianKuanDuMax - imgWidth) / 2 * 100) / 100;
        }
    }
    this.setAttribute('style', 'margin-left: ' + imgMarginLeft + 'px; margin-top: ' + imgMarginTop + 'px');
}

// 获取保存在文件里的标签
function huoQuBiaoQianShuJu() {
    GFs.readFile(biaoQianMuLu + 'yiJiBiaoQian.json', 'utf8', function (yiChang, yiJiBiaoQianJson) {
        if (yiChang === null) {
            yiJiBiaoQian = JSON.parse(yiJiBiaoQianJson);
            gouZaoYiJiBiaoQian();
        }
    });
    GFs.readFile(biaoQianMuLu + 'yiJiErJiFenZu.json', 'utf8', function (yiChang, yiJiErJiFenZuJson) {
        if (yiChang === null) {
            yiJiErJiFenZu = JSON.parse(yiJiErJiFenZuJson);
        }
    });
    GFs.readFile(biaoQianMuLu + 'sanJiBiaoQian.json', 'utf8', function (yiChang, sanJiBiaoQianJson) {
        if (yiChang === null) {
            sanJiBiaoQian = JSON.parse(sanJiBiaoQianJson);
        }
    });
}

// 切换标签页
function qieHuanBiaoQianYe() {
    for (let j = 0; j < sBiaoQian.biaoQianLieBiao.length; j++) {
        sBiaoQian.biaoQianLieBiao[j].className = 'biao-qian-an-niu';
        sBiaoQian.biaoQianYeLieBiao[j].style.display = 'none';
    }
    let idIndex = this.id.replace('biao-qian-', '');
    sBiaoQian.xianZhongBiaoQianYe = idIndex;
    sBiaoQian.biaoQianYeLieBiao[idIndex].style.display = 'block';
}

// 点击添加标签
function dianJiTianJiaBiaoQian() {
    let xinBianQianId = eleXinBiaoQianIdShuRu.value;
    let xinBiaoQianMing = eleXinBiaoQianMingShuRu.value;
    let muBiaoMuLu = sPeiZhi.caoZuoMuLu;
    if (sBiaoQian.xianZhongBiaoQianYe === 0) {
        sBiaoQian.biaoQianShuJu[xinBianQianId] = xinBiaoQianMing;
        sBiaoQian.yiJiBiaoQian[xinBianQianId] = xinBiaoQianMing;
        muBiaoMuLu = muBiaoMuLu + '\\' + xinBianQianId;
    } else if (sBiaoQian.xianZhongBiaoQianYe === 1) {
        sBiaoQian.biaoQianShuJu[sBiaoQian.yiJiXuanZhongId][xinBianQianId] = xinBiaoQianMing;
        sBiaoQian.erJiBiaoQian[xinBianQianId] = xinBiaoQianMing;
        muBiaoMuLu = muBiaoMuLu + '\\' + sBiaoQian.yiJiXuanZhongId + '\\' + xinBianQianId;
    } else if (sBiaoQian.xianZhongBiaoQianYe === 2) {
        sBiaoQian.biaoQianShuJu[sBiaoQian.yiJiXuanZhongId][sBiaoQian.erJiXuanZhongId][xinBianQianId] = xinBiaoQianMing;
        sBiaoQian.sanJiBiaoQian[xinBianQianId] = xinBiaoQianMing;
        muBiaoMuLu = muBiaoMuLu + '\\' + sBiaoQian.yiJiXuanZhongId + '\\' + sBiaoQian.erJiXuanZhongId + '\\' + xinBianQianId;
    }
    // 保存标签数据
    GFs.opendir(sPeiZhi.biaoQianMuLu, function (yiChang, muLu) {
        if (yiChang !== null) {
            GFs.mkdirSync(sPeiZhi.biaoQianMuLu);
        } else {
            muLu.close();
        }
        GFs.writeFileSync(sPeiZhi.biaoQianMuLu + sPeiZhi.wenJianMingLieBiao.biaoQian, JSON.stringify(sBiaoQian.biaoQianShuJu), 'utf8');
    });
    // 创建标签对应目录
    GFs.opendir(muBiaoMuLu, function (yiChang, muLu) {
        if (yiChang !== null) {
            GFs.mkdirSync(muBiaoMuLu);
        } else {
            muLu.close();
        }
    });
    // 重新构造标签按钮
    gouZaoBiaoQian(sBiaoQian.xianZhongBiaoQianYe);
    // 重置输入框
    eleXinBiaoQianIdShuRu.value='';
    eleXinBiaoQianMingShuRu.value='';
}

function gouZaoBiaoQian(){
    eleErJiBiaoQian.innerHTML = '';
    erJiBiaoQian = gEmpty(yiJiErJiFenZu[yiJiXuanZhongId]) ? {} : yiJiErJiFenZu[yiJiXuanZhongId];
    for (let kBiaoQian2 in erJiBiaoQian) {
        // 构造二级分类标签按钮
        let tempEle = document.createElement('button');
        tempEle.id = kBiaoQian2;
        tempEle.type = 'button';
        tempEle.innerHTML = erJiBiaoQian[kBiaoQian2];
        tempEle.className = 'an-niu-xiao an-niu-lan';
        tempEle.setAttribute('data-level', 'er-ji');
        // 绑定标签点击事件
        tempEle.onclick = dianJiFenLeiBiaoQian;
        eleErJiBiaoQian.appendChild(tempEle);
    }
}

// 构造一级标签
function gouZaoYiJiBiaoQian() {
    eleYiJiBiaoQian.innerHTML = '';
    for (let kBiaoQian in yiJiBiaoQian) {
        // 构造一级分类标签按钮
        let tempEle = document.createElement('button');
        tempEle.id = kBiaoQian
        tempEle.type = 'button';
        tempEle.innerHTML = yiJiBiaoQian[kBiaoQian];
        tempEle.className = 'an-niu-xiao an-niu-lan';
        tempEle.setAttribute('data-level', 'yi-ji');
        // 绑定标签点击事件
        tempEle.onclick = dianJiFenLeiBiaoQian;
        eleYiJiBiaoQian.appendChild(tempEle);
    }
}

// 构造二级标签
function gouZaoErJiBiaoQian() {
    eleErJiBiaoQian.innerHTML = '';
    erJiBiaoQian = gEmpty(yiJiErJiFenZu[yiJiXuanZhongId]) ? {} : yiJiErJiFenZu[yiJiXuanZhongId];
    for (let kBiaoQian2 in erJiBiaoQian) {
        // 构造二级分类标签按钮
        let tempEle = document.createElement('button');
        tempEle.id = kBiaoQian2;
        tempEle.type = 'button';
        tempEle.innerHTML = erJiBiaoQian[kBiaoQian2];
        tempEle.className = 'an-niu-xiao an-niu-lan';
        tempEle.setAttribute('data-level', 'er-ji');
        // 绑定标签点击事件
        tempEle.onclick = dianJiFenLeiBiaoQian;
        eleErJiBiaoQian.appendChild(tempEle);
    }
}

// 构造三级标签
function gouZaoSanJiBiaoQian() {
    eleSanJiBiaoQian.innerHTML = '';
    for (let kBiaoQian3 in sanJiBiaoQian) {
        // 构造标签按钮
        let tempEle = document.createElement('button');
        tempEle.id = kBiaoQian3;
        tempEle.type = 'button';
        tempEle.innerHTML = erJiBiaoQian[kBiaoQian3];
        tempEle.className = 'an-niu-xiao an-niu-lan';
        tempEle.setAttribute('data-level', 'san-ji');
        // 绑定标签点击事件
        tempEle.onclick = dianJiFenLeiBiaoQian;
        eleErJiBiaoQian.appendChild(tempEle);
    }
}

// 点击分类标签
function dianJiFenLeiBiaoQian() {
    let biaoQianJiBie = this.getAttribute('data-level');
    if (biaoQianJiBie === 'yi-ji') {
        // 一级标签互斥，同时获取二级标签
        if (yiJiXuanZhongId === this.id) {
            yiJiXuanZhongId = '';
            erJiBiaoQian = {};
            eleErJiBiaoQian.innerHTML = '';
            muBiaoMuLu = '';
            let yiJiLieBiao = document.getElementById('yi-ji-lie-biao').children;
            for (let i = 0; i < yiJiLieBiao.length; i++) {
                yiJiLieBiao[i].className = 'an-niu-xiao an-niu-lan';
            }
        } else {
            yiJiXuanZhongId = this.id;
            gouZaoErJiBiaoQian();
            muBiaoMuLu = caoZuoMuLu + '\\' + yiJiXuanZhongId + '\\'
                + (gEmpty(erJiXuanZhongId) ? '' : erJiXuanZhongId + '\\');
            let yiJiLieBiao = document.getElementById('yi-ji-lie-biao').children;
            for (let i = 0; i < yiJiLieBiao.length; i++) {
                if (yiJiLieBiao[i].id === this.id) {
                    yiJiLieBiao[i].className = 'an-niu-xiao an-niu-hong';
                } else {
                    yiJiLieBiao[i].className = 'an-niu-xiao an-niu-lan';
                }
            }
        }
    } else if (biaoQianJiBie === 'er-ji') {
        // 二级标签互斥
        if (erJiXuanZhongId === this.id) {
            erJiXuanZhongId = '';
            muBiaoMuLu = caoZuoMuLu + '\\' + yiJiXuanZhongId + '\\';
            let erJiLieBiao = document.getElementById('er-ji-lie-biao').children;
            for (let i = 0; i < erJiLieBiao.length; i++) {
                erJiLieBiao[i].className = 'an-niu-xiao an-niu-lan';
            }
        } else {
            erJiXuanZhongId = this.id;
            muBiaoMuLu = caoZuoMuLu + '\\' + yiJiXuanZhongId + '\\' + erJiXuanZhongId + '\\';
            let erJiLieBiao = document.getElementById('er-ji-lie-biao').children;
            for (let i = 0; i < erJiLieBiao.length; i++) {
                if (erJiLieBiao[i].id === this.id) {
                    erJiLieBiao[i].className = 'an-niu-xiao an-niu-hong';
                } else {
                    erJiLieBiao[i].className = 'an-niu-xiao an-niu-lan';
                }
            }
        }
    } else if (biaoQianJiBie === 'san-ji') {
        // 额外标签可多选
        let xiaBiao = sanJiXuanZhongIdLieBiao.indexOf(this.id)
        if (xiaBiao === -1) {
            sanJiXuanZhongIdLieBiao.push(this.id);
        } else {
            sanJiXuanZhongIdLieBiao.splice(xiaBiao, 1);
        }
    }
    chongMingMingTuPian();
    eleMuBiaoLuJing.innerHTML = muBiaoMuLu + tuPianChongMingMing;
}

// 重命名图片
function chongMingMingTuPian() {
    // 时间
    let date = new Date();
    let shiJian = String(date.getFullYear());
    let tempMing = date.getMonth() + 1;
    shiJian += (tempMing < 10) ? '0' + tempMing : String(tempMing);
    tempMing = date.getDate();
    shiJian += (tempMing < 10) ? '0' + tempMing : String(tempMing);
    tempMing = date.getHours();
    shiJian += (tempMing < 10) ? '0' + tempMing : String(tempMing);
    tempMing = date.getMinutes();
    shiJian += (tempMing < 10) ? '0' + tempMing : String(tempMing);
    tempMing = date.getSeconds();
    shiJian += (tempMing < 10) ? '0' + tempMing : String(tempMing);
    let tuPianMingShuZu = tuPianLuJing.split('.');
    let houZhuiMing = tuPianMingShuZu[tuPianMingShuZu.length - 1];
    if (!gEmpty(erJiXuanZhongId)) {
        if (!gEmpty(yiJiXuanZhongId)) {
            shiJianBiaoShi = shiJian;
            tuPianChongMingMing = erJiXuanZhongId + '_'
                + tuPianKuanDu + '_' + tuPianGaoDu + '_' + shiJian + '.' + houZhuiMing;
            keYiYiDong = true;
        } else {
            tuPianChongMingMing = '';
            keYiYiDong = false;
        }
    } else if (!gEmpty(yiJiXuanZhongId)) {
        shiJianBiaoShi = shiJian;
        tuPianChongMingMing = yiJiXuanZhongId + '_'
            + tuPianKuanDu + '_' + tuPianGaoDu + '_' + shiJian + '.' + houZhuiMing;
        keYiYiDong = true;
    } else {
        tuPianChongMingMing = '';
        keYiYiDong = false;
    }
}

// 点击确认移动
function dianJiQueRenYiDong() {
    if (gEmpty(tuPianLuJing)) {
        alert('未选择图片');
        return;
    }
    let yiDongLuJing = muBiaoMuLu + tuPianChongMingMing;
    let fenLeiSuoYin = {
        biaoShi: shiJianBiaoShi,
        kuanDu: tuPianKuanDu,
        gaoDu: tuPianGaoDu,
        yiJiBiaoQianId: yiJiXuanZhongId,
        erJiBiaoQianId: erJiXuanZhongId,
        sanJiBiaoQianLieBiao: sanJiXuanZhongIdLieBiao,
        tuPianMuLu: yiDongLuJing
    };
    let fenLeiSuoYinLieBiao = {};
    GFs.readFile(biaoQianMuLu + 'fenLeiSuoYin.json', 'utf8', function (yiChang, fenLeiSuoYinJson) {
        if (yiChang === null) {
            if (!gEmpty(fenLeiSuoYinJson)) {
                fenLeiSuoYinLieBiao = JSON.parse(fenLeiSuoYinJson);
            }
            fenLeiSuoYinLieBiao[shiJianBiaoShi] = fenLeiSuoYin;
        } else {
            fenLeiSuoYinLieBiao[shiJianBiaoShi] = fenLeiSuoYin;
        }
        GFs.writeFileSync(biaoQianMuLu + 'fenLeiSuoYin.json', JSON.stringify(fenLeiSuoYinLieBiao), 'utf8');
        GFs.rename(tuPianLuJing, yiDongLuJing, function (err) {
            if (!gEmpty(err)) {
                console.log(err);
                alert('移动图片异常');
            }
            keYiYiDong = false;
            let xiaBiao = tuPianLieBiao.indexOf(xuanZhongTuPianMing)
            if (xiaBiao !== -1) {
                tuPianLieBiao.splice(xiaBiao, 1);
            }
            xuanZhongTuPianMing = '';
            yiJiXuanZhongId = '';
            erJiXuanZhongId = '';
            sanJiXuanZhongIdLieBiao = [];
        });
    });
}