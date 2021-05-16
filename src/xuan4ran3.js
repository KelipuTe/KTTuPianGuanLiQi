//渲染模块

let rHelper = require('./helpers');

//配置
const cConfig = {
    iTuPianKuanMax: 900,
    iTuPianGaoMax: 800,
};

//渲染图片列表
function fTuPianLieBiao(eleTuPianLieBiao, sWeiFenLeiMuLu, sarrTuPianMing, fDianJiXuanZeTuPian) {
    //先清空列表中的元素
    eleTuPianLieBiao.innerHTML = '';
    //然后遍历图片列表重新生成
    let jiShu = 1;
    for (let sTuPianMing of sarrTuPianMing) {
        // 构造图片按钮
        let tempEle = document.createElement('img');
        tempEle.id = 'tu-pian-lie-biao-' + jiShu;
        tempEle.className = 'zuo-tu-pian-zu';
        tempEle.setAttribute('data-wen-jian-ming', sTuPianMing);
        tempEle.src = sWeiFenLeiMuLu + '\\' + sTuPianMing;
        tempEle.onclick = fDianJiXuanZeTuPian;
        eleTuPianLieBiao.appendChild(tempEle);
        ++jiShu;
    }
}

//图片居中
function fTuPianJuZhong(eleTuPianZhanShi) {
    // 获取图片原始大小
    let imgWidth = eleTuPianZhanShi.naturalWidth;
    let imgHeight = eleTuPianZhanShi.naturalHeight;
    let imgMarginLeft = 0;
    let imgMarginTop = 0;
    if (imgWidth <= cConfig.iTuPianKuanMax && imgHeight <= cConfig.iTuPianGaoMax) {
        // 宽高都小于限制，直接计算偏移量
        imgMarginLeft = Math.round((cConfig.iTuPianKuanMax - imgWidth) / 2 * 100) / 100;
        imgMarginTop = Math.round((cConfig.iTuPianGaoMax - imgHeight) / 2 * 100) / 100;
    } else if (imgWidth <= cConfig.iTuPianKuanMax && imgHeight > cConfig.iTuPianGaoMax) {
        // 只有宽度超过限制，单独计算高度偏移量
        imgWidth = Math.round(imgWidth * (cConfig.iTuPianGaoMax / imgHeight));
        imgMarginLeft = Math.round((cConfig.iTuPianKuanMax - imgWidth) / 2 * 100) / 100;
    } else if (imgWidth > cConfig.iTuPianKuanMax && imgHeight <= cConfig.iTuPianGaoMax) {
        // 只有高度超过限制，单独计算宽度偏移量
        imgHeight = Math.round(imgHeight * (cConfig.iTuPianKuanMax / imgWidth));
        imgMarginTop = Math.round((cConfig.iTuPianGaoMax - imgHeight) / 2 * 100) / 100;
    } else if (imgWidth > cConfig.iTuPianKuanMax && imgHeight > cConfig.iTuPianGaoMax) {
        // 只有宽高都超过限制，判断哪个超的更多，需要同比压缩
        if ((imgWidth / cConfig.iTuPianKuanMax) >= (imgHeight / cConfig.iTuPianGaoMax)) {
            imgHeight = Math.round(imgHeight * (cConfig.iTuPianKuanMax / imgWidth));
            imgMarginTop = Math.round((cConfig.iTuPianGaoMax - imgHeight) / 2 * 100) / 100;
        } else {
            imgWidth = Math.round(imgWidth * (cConfig.iTuPianGaoMax / imgHeight));
            imgMarginLeft = Math.round((cConfig.iTuPianKuanMax - imgWidth) / 2 * 100) / 100;
        }
    }
    eleTuPianZhanShi.setAttribute('style', 'margin-left: ' + imgMarginLeft + 'px; margin-top: ' + imgMarginTop + 'px');
}

function fBiaoQianLieBiao(iXuanZhongBQBS, eleBQ, arrDaiGouZaoBQ) {
    for (let kBQ in arrDaiGouZaoBQ) {
        // 构造标签按钮
        let tempEle = document.createElement('button');
        tempEle.id = kBQ;
        tempEle.type = 'button';
        tempEle.innerHTML = arrDaiGouZaoBQ[kBQ];
        tempEle.className = 'an-niu-xiao an-niu-shan-hu-hong';
        tempEle.setAttribute('data-level', iXuanZhongBQBS);
        // 绑定标签点击事件
        // tempEle.onclick = dianJiFenLeiBiaoQian;
        eleBQ.appendChild(tempEle);
    }
}

module.exports.fTuPianLieBiao = fTuPianLieBiao;
module.exports.fTuPianJuZhong = fTuPianJuZhong;
module.exports.fBiaoQianLieBiao = fBiaoQianLieBiao;