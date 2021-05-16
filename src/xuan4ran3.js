//渲染模块

const cConfig = {
    iTPShowKuanMax: 900,
    iTPShowGaoMax: 800,
};

/**
 * 计算图片居中需要的偏移量
 * @param iTPKuan
 * @param iTPGao
 * @returns {{iTPMarginLeft: number, iTPMarginTop: number}}
 */
function fTPJuZhong(iTPKuan,iTPGao){
    let iTPMarginLeft = 0;
    let iTPMarginTop = 0;
    if (iTPKuan <= cConfig.iTPShowKuanMax && iTPGao <= cConfig.iTPShowGaoMax) {
        // 宽高都小于限制，直接计算偏移量
        iTPMarginLeft = Math.round((cConfig.iTPShowKuanMax - iTPKuan) / 2 * 100) / 100;
        iTPMarginTop = Math.round((cConfig.iTPShowGaoMax - iTPGao) / 2 * 100) / 100;
    } else if (iTPKuan <= cConfig.iTPShowKuanMax && iTPGao > cConfig.iTPShowGaoMax) {
        // 只有宽度超过限制，单独计算高度偏移量
        iTPKuan = Math.round(iTPKuan * (cConfig.iTPShowGaoMax / iTPGao));
        iTPMarginLeft = Math.round((cConfig.iTPShowKuanMax - iTPKuan) / 2 * 100) / 100;
    } else if (iTPKuan > cConfig.iTPShowKuanMax && iTPGao <= cConfig.iTPShowGaoMax) {
        // 只有高度超过限制，单独计算宽度偏移量
        iTPGao = Math.round(iTPGao * (cConfig.iTPShowKuanMax / iTPKuan));
        iTPMarginTop = Math.round((cConfig.iTPShowGaoMax - iTPGao) / 2 * 100) / 100;
    } else if (iTPKuan > cConfig.iTPShowKuanMax && iTPGao > cConfig.iTPShowGaoMax) {
        // 只有宽高都超过限制，判断哪个超的更多，需要同比压缩
        if ((iTPKuan / cConfig.iTPShowKuanMax) >= (iTPGao / cConfig.iTPShowGaoMax)) {
            iTPGao = Math.round(iTPGao * (cConfig.iTPShowKuanMax / iTPKuan));
            iTPMarginTop = Math.round((cConfig.iTPShowGaoMax - iTPGao) / 2 * 100) / 100;
        } else {
            iTPKuan = Math.round(iTPKuan * (cConfig.iTPShowGaoMax / iTPGao));
            iTPMarginLeft = Math.round((cConfig.iTPShowKuanMax - iTPKuan) / 2 * 100) / 100;
        }
    }
    return {
        'iTPMarginTop':iTPMarginTop,
        'iTPMarginLeft':iTPMarginLeft
    };
}

module.exports.fTPJuZhong = fTPJuZhong;
