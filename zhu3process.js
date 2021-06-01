//Electron模块
const rElectron = require('electron');
const rApp = rElectron.app;
const rBrowserWindow = rElectron.BrowserWindow;
const rMenu = rElectron.Menu;
const rIpcMain = rElectron.ipcMain;

//主窗口
let bwZhuChuangKou = null;
//顶部菜单
let oarrDingBuCaiDanMuBan = [
    {
        label: '帮助',
        submenu: [
            {
                label: '打开调试窗口',
                accelerator: 'F12',
                click: function () {
                    bwZhuChuangKou.webContents.openDevTools();
                }
            }
        ]
    }
];

/**
 * 创建浏览器窗口
 */
function fBulidChuang1Kou3() {
    //resizable--设为false，不允许改变窗口大小
    //webPreferences.nodeIntegration--默认false，不设为true，node integration不能用
    //webPreferences.enableRemoteModule--默认false，不设为true，remote不能用
    bwZhuChuangKou = new rBrowserWindow({
        width: 1680,
        height: 980,
        // resizable: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
        }
    });
    let oDingBuCaiDan = rMenu.buildFromTemplate(oarrDingBuCaiDanMuBan);
    rMenu.setApplicationMenu(oDingBuCaiDan);
    //加载主窗口
    bwZhuChuangKou.loadFile('./zhu3window.html');
    //窗口关闭事件
    bwZhuChuangKou.on('closed', function () {
        bwZhuChuangKou = null;
    });
    //打开调试窗口
    bwZhuChuangKou.webContents.openDevTools();
}

//rIpcMain.on()监听渲染进程发送的消息
//打开调试窗口消息
rIpcMain.on('open0debug0window', function (event, arg) {
    bwZhuChuangKou.webContents.openDevTools();
})

rApp.whenReady().then(fBulidChuang1Kou3)