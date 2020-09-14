console.log('Node:' + process.versions.node);
console.log('Chrome:' + process.versions.chrome);
console.log('Electron:' + process.versions.electron);

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