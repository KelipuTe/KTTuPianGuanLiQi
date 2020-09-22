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

const GWeiFenLeiMuLu = 'WeiFenLei\\';
const GBiaoQianMuLu = 'BiaoQian\\';
const GImgMaxWidth = 900;
const GImgMaxHeight = 800;

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
window.addEventListener('contextmenu',
    function (event) {
        // 取消事件的默认动作
        event.preventDefault();
        // 在目标窗口中弹出菜单
        youJiCaiDan.popup({
            window: GRemote.getCurrentWindow()
        });
    }, false
);

// 页面逻辑
// 目录变量
let caoZuoMuLu = '';
let tuPianMuLu = '';
let biaoQianMuLu = '';
let muBiaoMuLu = '';
// 图片列表变量
let tuPianLieBiao = [];
let tuPianShuLiang = 20;
// 图片列表dom对象
let eleXuanZeMuLu = {};
let eleTuPianLieBiao = {};
// 图片变量
let tuPianLuJing = '';
let tuPianKuanDu = 0;
let tuPianGaoDu = 0;

let xuanZhongTuPianMing = '';
let shiJianBiaoShi = '';
let tuPianChongMingMing = '';
let keYiYiDong = false;
// 图片dom对象
let eleTuPianZhanShi = {};
// 标签页变量
let biaoQianLieBiao = {};
let biaoQianYeLieBiao = {};

let yiJiBiaoQian = {};
let yiJiErJiFenZu = {};
let erJiBiaoQian = {};
let sanJiBiaoQian = {};

let yiJiXuanZhongId = '';
let erJiXuanZhongId = '';
let sanJiXuanZhongIdLieBiao = [];
// 标签页dom对象
let eleYiJiBiaoQian = {};
let eleYiJiIdShuRu = {};
let eleYiJiMingShuRu = {};
let eleYiJiTianJia = {};

let eleErJiBiaoQian = {};
let eleErJiIdShuRu = {};
let eleErJiMingShuRu = {};
let eleErJiTianJia = {};

let eleSanJiBiaoQian = {};
let eleSanJiIdShuRu = {};
let eleSanJiMingShuRu = {};
let eleSanJiTianJia = {};
// 确认移动dom对象
let eleMuBiaoLuJing = {};
let eleQueRenYiDong = {};
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
    biaoQianLieBiao = document.getElementById('biao-qian-lie-biao').children;
    biaoQianYeLieBiao = document.getElementById('biao-qian-yei-lie-biao').children;
    for (let i = 0; i < biaoQianLieBiao.length; i++) {
        biaoQianLieBiao[i].id = 'biao-qian-' + i;
        biaoQianLieBiao[i].onclick = qieHuanBiaoQianYe;
    }
    // 添加一级标签
    eleYiJiBiaoQian = document.getElementById('yi-ji-lie-biao');
    eleYiJiIdShuRu = document.getElementById('yi-ji-id');
    eleYiJiMingShuRu = document.getElementById('yi-ji-ming');
    eleYiJiTianJia = document.getElementById('yi-ji-tian-jia');
    eleYiJiTianJia.onclick = dianJiTianJiaBiaoQian;
    // 添加二级标签
    eleErJiBiaoQian = document.getElementById('er-ji-lie-biao');
    eleErJiIdShuRu = document.getElementById('er-ji-id');
    eleErJiMingShuRu = document.getElementById('er-ji-ming');
    eleErJiTianJia = document.getElementById('er-ji-tian-jia');
    eleErJiTianJia.onclick = dianJiTianJiaBiaoQian;
    // 添加额外标签
    eleSanJiBiaoQian = document.getElementById('san-ji-lie-biao');
    eleSanJiIdShuRu = document.getElementById('san-ji-id');
    eleSanJiMingShuRu = document.getElementById('san-ji-ming');
    eleSanJiTianJia = document.getElementById('san-ji-tian-jia');
    eleSanJiTianJia.onclick = dianJiTianJiaBiaoQian;
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
        caoZuoMuLu = result.filePaths[0];
        tuPianMuLu = caoZuoMuLu + '\\' + GWeiFenLeiMuLu;
        biaoQianMuLu = caoZuoMuLu + '\\' + GBiaoQianMuLu;
        huoQuTuPianLieBiao();
        huoQuBiaoQian();
    });
}
// 获取图片列表
function huoQuTuPianLieBiao() {
    let jiShu = 1;
    GFs.readdir(tuPianMuLu, function (yiChang, wenJianLieBiao) {
        // 先初始化
        tuPianLieBiao = [];
        eleTuPianLieBiao.innerHTML = '';
        if (yiChang === null) {
            // 没有异常就继续
            for (let wenJianMing of wenJianLieBiao) {
                if (jiShu > tuPianShuLiang) {
                    break;
                }
                tuPianLieBiao.push(wenJianMing);
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
        }
    });
}
// 点击选择图片
function dianJiXuanZeTuPian() {
    let wenJianMing = this.textContent;
    xuanZhongTuPianMing = wenJianMing;
    tuPianLuJing = tuPianMuLu + '\\' + wenJianMing;
    eleTuPianZhanShi.src = tuPianLuJing;
}
// 图片加载的时候计算偏移量，让图片居中
function jiSuanPianYiLiang() {
    // 获取图片原始大小
    let imgWidth = this.naturalWidth;
    let imgHeight = this.naturalHeight;
    tuPianKuanDu = imgWidth;
    tuPianGaoDu = imgHeight;
    let imgMarginLeft = 0;
    let imgMarginTop = 0;
    if (imgWidth <= GImgMaxWidth && imgHeight <= GImgMaxHeight) {
        // 宽高都小于限制，直接计算偏移量
        imgMarginLeft = Math.round((GImgMaxWidth - imgWidth) / 2 * 100) / 100;
        imgMarginTop = Math.round((GImgMaxHeight - imgHeight) / 2 * 100) / 100;
    } else if (imgWidth <= GImgMaxWidth && imgHeight > GImgMaxHeight) {
        // 只有宽度超过限制，单独计算高度偏移量
        imgWidth = Math.round(imgWidth * (GImgMaxHeight / imgHeight));
        imgMarginLeft = Math.round((GImgMaxWidth - imgWidth) / 2 * 100) / 100;
    } else if (imgWidth > GImgMaxWidth && imgHeight <= GImgMaxHeight) {
        // 只有高度超过限制，单独计算宽度偏移量
        imgHeight = Math.round(imgHeight * (GImgMaxWidth / imgWidth));
        imgMarginTop = Math.round((GImgMaxHeight - imgHeight) / 2 * 100) / 100;
    } else if (imgWidth > GImgMaxWidth && imgHeight > GImgMaxHeight) {
        // 只有宽高都超过限制，判断哪个超的更多，需要同比压缩
        if ((imgWidth / GImgMaxWidth) >= (imgHeight / GImgMaxHeight)) {
            imgHeight = Math.round(imgHeight * (GImgMaxWidth / imgWidth));
            imgMarginTop = Math.round((GImgMaxHeight - imgHeight) / 2 * 100) / 100;
        } else {
            imgWidth = Math.round(imgWidth * (GImgMaxHeight / imgHeight));
            imgMarginLeft = Math.round((GImgMaxWidth - imgWidth) / 2 * 100) / 100;
        }
    }
    this.setAttribute('style', 'margin-left: ' + imgMarginLeft + 'px; margin-top: ' + imgMarginTop + 'px');
}
// 获取保存在文件里的标签
function huoQuBiaoQian() {
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
    for (let j = 0; j < biaoQianLieBiao.length; j++) {
        biaoQianLieBiao[j].className = 'biao-qian-an-niu';
        biaoQianYeLieBiao[j].style.display = 'none';
    }
    let idIndex = this.id.replace('biao-qian-', '');
    biaoQianYeLieBiao[idIndex].style.display = 'block';
}
// 点击添加标签
function dianJiTianJiaBiaoQian() {
    let eleId = this.id;
    // 通过按钮id判断是哪一个按钮
    if (eleId === 'yi-ji-tian-jia') {
        // 添加一级标签
        let xinBianQianId = eleYiJiIdShuRu.value;
        let xinBiaoQianMing = eleYiJiMingShuRu.value;
        if (gEmpty(xinBianQianId) || gEmpty(xinBiaoQianMing)) {
            alert('一级标签数据缺失');
            return;
        }
        yiJiBiaoQian[xinBianQianId] = xinBiaoQianMing;
        yiJiErJiFenZu[xinBianQianId] = {};
        // 保存标签数据
        GFs.opendir(biaoQianMuLu, function (yiChang, muLu) {
            if (yiChang !== null) {
                GFs.mkdirSync(biaoQianMuLu);
            } else {
                muLu.close();
            }
            GFs.writeFileSync(biaoQianMuLu + 'yiJiBiaoQian.json', JSON.stringify(yiJiBiaoQian), 'utf8');
            // 重置输入框
            eleYiJiIdShuRu.value = '';
            eleYiJiMingShuRu.value = '';
        });
        // 创建标签对应目录
        let muBiaoMuLu = caoZuoMuLu + '\\' + xinBianQianId
        GFs.opendir(muBiaoMuLu, function (yiChang, muLu) {
            if (yiChang !== null) {
                GFs.mkdirSync(muBiaoMuLu);
            } else {
                muLu.close();
            }
        });
        gouZaoYiJiBiaoQian();
    } else if (eleId === 'er-ji-tian-jia') {
        // 添加二级标签
        if (gEmpty(yiJiXuanZhongId)) {
            alert('未选择一级标签');
            return;
        }
        let xinBianQianId = eleErJiIdShuRu.value;
        let xinBiaoQianMing = eleErJiMingShuRu.value;
        if (gEmpty(xinBianQianId) || gEmpty(xinBiaoQianMing)) {
            alert('二级标签数据缺失');
            return;
        }
        erJiBiaoQian[xinBianQianId] = xinBiaoQianMing;
        if (gEmpty(yiJiErJiFenZu[yiJiXuanZhongId])) {
            yiJiErJiFenZu[yiJiXuanZhongId] = {};
        }
        yiJiErJiFenZu[yiJiXuanZhongId][xinBianQianId] = xinBiaoQianMing;
        // 保存标签数据
        GFs.opendir(biaoQianMuLu, function (yiChang, muLu) {
            if (yiChang !== null) {
                GFs.mkdirSync(biaoQianMuLu);
            } else {
                muLu.close();
            }
            GFs.writeFileSync(biaoQianMuLu + 'yiJiErJiFenZu.json', JSON.stringify(yiJiErJiFenZu), 'utf8');
            // 重置输入框
            eleErJiIdShuRu.value = '';
            eleErJiMingShuRu.value = '';
        });
        // 创建标签对应目录
        let muBiaoMuLu = caoZuoMuLu + '\\' + yiJiXuanZhongId + '\\' + xinBianQianId;
        GFs.opendir(muBiaoMuLu, function (yiChang, muLu) {
            if (yiChang !== null) {
                GFs.mkdirSync(muBiaoMuLu);
            } else {
                muLu.close();
            }
        });
        gouZaoErJiBiaoQian();
    } else if (eleId === 'san-ji-tian-jia') {
        // 添加标签，并写入文件
        let xinBianQianId = eleSanJiIdShuRu.value;
        let xinBiaoQianMing = eleSanJiMingShuRu.value;
        if (gEmpty(xinBianQianId) || gEmpty(xinBiaoQianMing)) {
            alert('额外标签数据缺失');
            return;
        }
        sanJiBiaoQian[xinBianQianId] = xinBiaoQianMing;
        GFs.opendir(biaoQianMuLu, function (yiChang, muLu) {
            if (yiChang !== null) {
                GFs.mkdirSync(biaoQianMuLu);
            } else {
                muLu.close();
            }
            GFs.writeFileSync(biaoQianMuLu + 'sanJiBiaoQian.json', JSON.stringify(sanJiBiaoQian), 'utf8');
            // 重置输入框
            eleErJiIdShuRu.value = '';
            eleErJiMingShuRu.value = '';
        });
        gouZaoSanJiBiaoQian();
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
    GFs.readFile(this.biaoQianMuLu + 'fenLeiSuoYin.json', 'utf8', function (yiChang, fenLeiSuoYinJson) {
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