// 右击菜单
const youJiCaiDanMuBan = [
    {
        label: '打开调试',
        accelerator: 'F12',
        click: function () {
            // 给主进程发送消息
            GIpcRenderer.send('da-kai-tiao-shi', '申请打开调试');
        }
    }
]
let youJiCaiDan = GMenu.buildFromTemplate(youJiCaiDanMuBan);
// 监听右击事件
window.addEventListener('contextmenu', function (event) {
    // 取消事件的默认动作
    event.preventDefault();
    // 在目标窗口中弹出菜单
    youJiCaiDan.popup({
        window: GRemote.getCurrentWindow()
    });
}, false);
