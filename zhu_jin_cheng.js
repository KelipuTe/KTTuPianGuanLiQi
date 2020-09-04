const GElectron = require('electron');
const GApp = GElectron.app;
const GBrowserWindow = GElectron.BrowserWindow;
const GMenu = GElectron.Menu;
const GIpcMain = GElectron.ipcMain;
// 主窗口
let zhuChuangKou = null;
// 顶部菜单
const GCaiDanMuBan = [
    {
        label: '帮助',
        submenu: [
            {
                label: '打开调试',
                accelerator: 'F12',
                click: function () {
                    zhuChuangKou.webContents.openDevTools();
                }
            }
        ]
    }
];

// 监听渲染进行发送的消息
GIpcMain.on('da-kai-tiao-shi', function (event, arg) {
    zhuChuangKou.webContents.openDevTools();
})

function chuangJianChuangKou() {
    // 创建浏览器窗口
    zhuChuangKou = new GBrowserWindow({
        width: 1660,
        height: 860,
        // 不允许改变窗口大小
        // resizable: false,
        webPreferences: {
            // 默认false，不开node integration不能用
            nodeIntegration: true,
            // 默认false，不开remote不能用
            enableRemoteModule: true,
        }
    });
    let caiDan = GMenu.buildFromTemplate(GCaiDanMuBan);
    GMenu.setApplicationMenu(caiDan);
    // 加载主窗口
    zhuChuangKou.loadFile('zhu_chuang_kou.html');
    // 窗口关闭事件
    zhuChuangKou.on('closed', function () {
        zhuChuangKou = null;
    });
    // 打开调试
    // zhuChuangKou.webContents.openDevTools();
}

GApp.whenReady().then(chuangJianChuangKou)
