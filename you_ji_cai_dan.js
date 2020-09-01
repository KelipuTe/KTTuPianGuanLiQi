const Remote = require('electron').remote;
const Menu = Remote.Menu;
// 右击菜单
const youJiCaiDanMuBan = [
    {
        label: '复制',
        accelerator: 'ctrl+c',
    },
    {
        label: '粘贴',
        accelerator: 'ctrl+v',
    }
]
let youJiCaiDan = Menu.buildFromTemplate(youJiCaiDanMuBan);
// 监听右击事件
window.addEventListener('contextmenu', function (event) {
    // 取消事件的默认动作
    event.preventDefault();
    // 在目标窗口中弹出菜单
    youJiCaiDan.popup({
        window: Remote.getCurrentWindow()
    });
}, false);

