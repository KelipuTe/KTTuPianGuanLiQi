//图片模块

let rHelper = require('./helpers');

//配置
const cConfig = {
    //图片列表数量
    iTuPianShuLiang: 20,
};

let sarrTuPianMing = [];
let sTuPianMing = '';
let iTuPianKuan = 0;
let iTuPianGao = 0;
let iTimestamp = 0;
let sChongMingMing = '';
let sMuBiaoLuJing = '';
let bKeYiYiDong = false;

/**
 * 加载图片
 * @param pfs module:fs
 * @param psMuLu 图片目录路径
 */
function fJiaZaiTuPianLieBiao(rfs, sMuLu) {
    //先初始化
    sarrTuPianMing = [];
    //同步读取目录下的文件
    let sarrWenJianMing = rfs.readdirSync(sMuLu);
    let iJiShu = 1;
    for (let sWenJianMing of sarrWenJianMing) {
        if (iJiShu > cConfig.iTuPianShuLiang) {
            break;
        } else {
            sarrTuPianMing.push(sWenJianMing);
            ++iJiShu;
        }
    }
    return sarrTuPianMing;
}

function fSetTuPianInfo(sTuPianMing, iImageWidth, iImageHeight) {

}

module.exports.fJiaZaiTuPianLieBiao = fJiaZaiTuPianLieBiao;