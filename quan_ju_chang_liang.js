console.log('Node:' + process.versions.node);
console.log('Chrome:' + process.versions.chrome);
console.log('Electron:' + process.versions.electron);

const Electron = require('electron');
const Remote = Electron.remote;
const Menu = Remote.Menu;
const Dialog = Remote.dialog;
const IpcRenderer = Electron.ipcRenderer;
const fs = require('fs');

