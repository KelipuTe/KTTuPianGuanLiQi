const rElectron = require('electron');
const rApp = rElectron.app;
const rBrowserWindow = rElectron.BrowserWindow;
const rMenu = rElectron.Menu;
const rIpcMain = rElectron.ipcMain;
// 主窗口
let bwZhuChuangKou = null;
// 顶部菜单
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

function chuangJianChuangKou() {
    // 创建浏览器窗口
    bwZhuChuangKou = new rBrowserWindow({
        width: 1680,
        height: 880,
        // 不允许改变窗口大小
        // resizable: false,
        webPreferences: {
            // 默认false，不开node integration不能用
            nodeIntegration: true,
            // 默认false，不开remote不能用
            enableRemoteModule: true,
        }
    });
    let oDingBuCaiDan = rMenu.buildFromTemplate(oarrDingBuCaiDanMuBan);
    rMenu.setApplicationMenu(oDingBuCaiDan);
    // 加载主窗口
    bwZhuChuangKou.loadFile('zhu3chuang1kou3.html');
    // 窗口关闭事件
    bwZhuChuangKou.on('closed', function () {
        bwZhuChuangKou = null;
    });
    // 打开调试窗口
    bwZhuChuangKou.webContents.openDevTools();
}

// 监听渲染进程发送的消息
rIpcMain.on('da-kai-tiao-shi', function (event, arg) {
    bwZhuChuangKou.webContents.openDevTools();
})

rApp.whenReady().then(chuangJianChuangKou)