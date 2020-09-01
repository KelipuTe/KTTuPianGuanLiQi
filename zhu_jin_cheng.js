// 引用electron
const Electron = require('electron');
// 引用app
const App = Electron.app;
// 引用窗口
const BrowserWindow = Electron.BrowserWindow;
// 主窗口
let zhuChuangKou = null;
const Menu = Electron.Menu;
// 顶部菜单
const caiDanMuBan = [
    {
        label: '帮助',
        submenu: [
            {
                label: '打开调试',
                accelerator: 'ctrl+t',
                click: function () {
                    zhuChuangKou.webContents.openDevTools();
                }
            }
        ]
    }
];
let caiDan = Menu.buildFromTemplate(caiDanMuBan);

function chuangJianChuangKou() {
    // 创建浏览器窗口
    zhuChuangKou = new BrowserWindow({
        width: 1600,
        height: 900,
        webPreferences: {
            nodeIntegration: true,
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
    zhuChuangKou.webContents.openDevTools();
}

App.whenReady().then(chuangJianChuangKou)
