const { app, BrowserWindow, Tray, dialog, ipcMain, Menu, globalShortcut } = require('electron');
const path = require('path');
const express = require('express');

let win;

function init() {
  // BrowserWindow
  const width = 400;
  const height = 510;
  win = new BrowserWindow({
    width,
    height,
    show: false,
    resizable: false,
    frame: false,
    maximizable: false,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      devTools: true, // 允许在打包的应用中使用开发者工具
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      enableRemoteModule: true
    }
  });

  if (app.isPackaged) {
    const server = express();
    server.use('/', express.static(__dirname));
    const srv = server.listen(0, '127.0.0.1', () => {
      if (srv.address().port) {
        win.loadURL(`http://127.0.0.1:${srv.address().port}/dist/index.html`);
      } else {
        win.loadFile('./dist/index.html');
      }
    });
  } else {
    win.loadURL('http://127.0.0.1:9000');
  }

  win.once('ready-to-show', () => {
    win.show();
  });

  win.on('close', (e) => {
    if (!global.isQuit) {
      e.preventDefault();
      if (typeof app.hide === 'function') app.hide();
    }
  });

  global.win = win;
  global.isQuit = false;

  // Tray
  const tray = new Tray(path.join(__dirname, process.platform === 'darwin' ? 'assets/iconOff@2x.png' : 'assets/iconOff.ico'));
  global.tray = tray;

  // IPC
  ipcMain.on('show', () => {
    win.show();
  });
  ipcMain.on('quit', () => {
    global.isQuit = true;
    app.quit();
  });
}



app.on('will-quit', () => {
  // 注销所有快捷键
  globalShortcut.unregisterAll();
});

if (process.platform === 'darwin') {
  app.dock.hide();
}

app.on('window-all-closed', (e) => {
  e.preventDefault();
  app.quit();
});

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (win) {
      win.show();
    }
  });
}
