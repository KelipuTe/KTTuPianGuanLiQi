//图片模块

//配置
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
 * @param psMuLu 图片目录路径
 */
function fJiaZaiTuPianLieBiao(pfs, psMuLu) {
    //先初始化
    sarrTuPianMing = [];
    //同步读取目录下的文件
    let sarrWenJianMing = pfs.readdirSync(psMuLu);
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

module.exports.fJiaZaiTuPianLieBiao = fJiaZaiTuPianLieBiao;