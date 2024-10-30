import path from 'path'
import serve from 'electron-serve'
import { createWindow } from './helpers'
import { Menu } from 'electron'

const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

;(async () => {
  await app.whenReady()
  Menu.setApplicationMenu(null)
  const mainWindow = createWindow('main', {
    width: 1050,
    height: 630,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    backgroundColor: '#FFFFFF',
    // resizable: false,
    
  })
  if (isProd) {
    await mainWindow.loadURL('app://./auth/login')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/auth/login`)
    // mainWindow.webContents.openDevTools()
  }
})()

app.on('window-all-closed', () => {
  app.quit()
})

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`)
})

// ipcMain.on('show-notification', (event, message) => {
//   const notification = new Notification({
//     title: 'Notification',
//     body: message,
//   });
//   notification.show();
// });