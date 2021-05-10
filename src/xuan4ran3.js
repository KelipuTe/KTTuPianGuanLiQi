//渲染模块

function fTuPianLieBiao(peleTuPianLieBiao, psWeiFenLeiMuLu, psarrTuPianMing, pfDianJiXuanZeTuPian) {
    let jiShu = 1;
    for (let sTuPianMing of psarrTuPianMing) {
        // 构造图片列表按钮
        let tempEle = document.createElement('img');
        tempEle.id = 'tu-pian-lie-biao-' + jiShu;
        tempEle.className = 'zuo-tu-pian-zu';
        tempEle.setAttribute('data-wen-jian-ming', sTuPianMing);
        tempEle.src = psWeiFenLeiMuLu + '\\' + sTuPianMing;
        tempEle.onclick = pfDianJiXuanZeTuPian;
        peleTuPianLieBiao.appendChild(tempEle);
        ++jiShu;
    }
}

module.exports.fTuPianLieBiao = fTuPianLieBiao;