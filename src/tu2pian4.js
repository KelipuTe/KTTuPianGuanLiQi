//图片模块

const cConfig = {
    iTuPianShuLiang: 20,
    iTuPianKuanMax: 900,
    iTuPianGaoMax: 800,
};

let sarrTuPianMing = [];
let sTuPianMing = '';
let sTuPianLuJing = '';
let iTuPianKuan = 0;
let iTuPianGao = 0;
let iTimestamp = 0;
let sChongMingMing = '';
let sMuBiaoLuJing = '';
let bKeYiYiDong = false;

/**
 * 加载图片
 * @param pfs module:fs
 */
function jiaZaiTuPian(pfs, psMuLu) {
    pfs.readdir(psMuLu, function (exc, sarrWenJianMing) {
        // 先初始化
        sarrTuPianMing = [];
        if (exc === null) {
            // 没有异常就继续
            let iJiShu = 1;
            for (let sWenJianMing of sarrWenJianMing) {
                if (iJiShu > cConfig.iTuPianShuLiang) {
                    break;
                } else {
                    sarrTuPianMing.push(sWenJianMing);
                    ++iJiShu;
                }
            }
        } else {
            console.error(exc)
        }
    });
}

module.exports.jiaZaiTuPian = jiaZaiTuPian;
module.exports.test = test;