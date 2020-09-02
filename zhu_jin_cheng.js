const Electron = require('electron');
const App = Electron.app;
const BrowserWindow = Electron.BrowserWindow;
const Menu = Electron.Menu;
const IpcMain = Electron.ipcMain;

// 顶部菜单
const caiDanMuBan = [
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
let caiDan = Menu.buildFromTemplate(caiDanMuBan);

// 监听渲染进行发送的消息
IpcMain.on('da-kai-tiao-shi', function(event, arg)  {
    zhuChuangKou.webContents.openDevTools();
})

// 主窗口
let zhuChuangKou = null;
function chuangJianChuangKou() {
    // 创建浏览器窗口
    zhuChuangKou = new BrowserWindow({
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
    Menu.setApplicationMenu(caiDan);
    // 加载主窗口
    zhuChuangKou.loadFile('zhu_chuang_kou.html');
    // 窗口关闭事件
    zhuChuangKou.on('closed', function () {
        zhuChuangKou = null;
    });
    // 打开调试
    // zhuChuangKou.webContents.openDevTools();
}


App.whenReady().then(chuangJianChuangKou)
