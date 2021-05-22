//图片模块

const rHelper = require('./helpers');

const rFs = require('fs');

//配置
//iTPNum:图片列表数量
const cConfig = {
    iSArrTPMingLen: 20,
};
//图片名列表
let sarrTPMing = [];

let sTuPianMing = '';
let iTuPianKuan = 0;
let iTuPianGao = 0;
let iTimestamp = 0;
let sChongMingMing = '';
let sMuBiaoLuJing = '';
let bKeYiYiDong = false;

/**
 * 加载图片
 * @param sMuLu 图片目录路径
 */
function fLoadTP(sMuLu) {
    //清空数据
    sarrTPMing = [];
    //同步读取目录下的文件
    let sarrWenJianMing = rFs.readdirSync(sMuLu);
    //一次取一定数量的图片
    let ii = 1;
    for (let sWenJianMing of sarrWenJianMing) {
        if (ii > cConfig.iSArrTPMingLen) {
            break;
        } else {
            sarrTPMing.push(sWenJianMing);
            ++ii;
        }
    }
    return sarrTPMing;
}

function fSetTuPianInfo(sTuPianMing, iImageWidth, iImageHeight) {

}

module.exports.fLoadTP = fLoadTP;