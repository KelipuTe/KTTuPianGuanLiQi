const Electron = require('electron');
// 引用app
const App = Electron.app;
// 窗口引用
const BrowserWindow = Electron.BrowserWindow;
// 主窗口
let mainWindow = null;

function createWindow() {
    // 创建浏览器窗口
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {nodeIntegration: true}
    });

    const Menu = Electron.Menu;
    let template = [
        {
            label:'a',
            submenu:[
                {label:'aa'},
                {label: 'ab'}
            ]
        },{
            label:'b',
            submenu:[
                {label:'ba'},
                {label: 'bb'}
            ]
        }
    ]
    let menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    // 加载index.html
    mainWindow.loadFile('index.html');
    // 窗口关闭事件
    mainWindow.on('closed', ()=>{});
    // 打开开发者工具
    // mainWindow.webContents.openDevTools();
}

function closedWindow() {
    mainWindow = null;
}

App.whenReady().then(createWindow)